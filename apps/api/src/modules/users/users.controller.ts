import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {ApiError} from "../../utils/ApiError.js";
import {prisma} from "../../config/prismaClient.js";
import {Express, Request, Response} from "express";
import {PublicUser, CompleteUser, UserRole} from "@repo/types";

dotenv.config()

export const getUsers = async (req: Request, res: Response) => {
    const users: PublicUser[] = await prisma.user.findMany({select:{id:true, username:true,email:true,role:true}})
    res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
    const {username, email, password}: 
    {
        username: string, 
        email: string, 
        password: string
    } = req.body

    if (await prisma.user.findUnique({where: {username}}))
        throw new ApiError("Username already exists", 400);
    if (await prisma.user.findUnique({where: {email}}))
        throw new ApiError("Email already exists", 400);

    const hashedPassword: string = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS) || 10)
    const user = await prisma.user.create({data: {username, email, password:hashedPassword}})
    const token = jwt.sign(
        {user_id: user.id}, 
        process.env.SECRET_KEY as string, 
        {expiresIn: "1h"}
    )

    const createdUser: PublicUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    }

    res
        .cookie("access_token", token, { httpOnly: true, secure: true, sameSite: "lax" })
        .status(201)
        .json(createdUser);
};

export const login = async (req: Request, res: Response) => {
    const {email, password}: {email: string, password: string} = req.body
    const user: CompleteUser | null = await prisma.user.findUnique({where: {email}})

    if (!user) throw new ApiError("Email not found", 400);

    const passValidation = await bcrypt.compare(password, user.password)
    if (!passValidation) throw new ApiError("Wrong password", 400);

    const token = jwt.sign(
        {user_id: user.id}, 
        process.env.SECRET_KEY as string, 
        {expiresIn: "1h"}
    )

    const publicUserData: PublicUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    }

    res
        .cookie("access_token", token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", // Solo true en producción
            sameSite: "lax" 
        })
        .status(200)
        .json(publicUserData);
}

export const logout = async (req: Request, res: Response) => {
    res.clearCookie("access_token", {httpOnly: true, secure: true, sameSite:"lax"}).sendStatus(200)
}

export const getPublicUserDataById = async (req: Request<{id: string}>, res: Response) => {
    const {id}: {id: string} = req.params
    const user: PublicUser | null = await prisma.user.findUnique({where: {id: id}, select: {id: true, username: true, email: true, role: true}})

    if (!user) throw new ApiError("User not found", 404);
    res.json(user)
}

export const updateUserData = async (req: Request<{id: string}>, res: Response) => {
    const {id}: {id: string} = req.params
    const {newUsername, newEmail} = req.body
    const user: CompleteUser | null = await prisma.user.findUnique({where: {id: id}})

    if (!user) throw new ApiError("User doesnt exist", 400)
    const updates: {username: string, email: string} = {
        username: newUsername,
        email: newEmail,
    }
    await prisma.user.update({where:{id: id}, data: updates})

    res.sendStatus(200)
    
};

export const updateUserRole = async (req: Request<{ id: string }>, res: Response) => {
    const {id}: {id: string} = req.params
    const {role}: {role: UserRole} = req.body
    await prisma.user.update({where:{id: id}, data: {role}})
    res.sendStatus(200)
}

export const requestDeleteUser = async (req: Request<{id: string}>, res: Response) => {
    const {id}: {id: string} = req.params
    const user: CompleteUser | null = await prisma.user.findUnique({where: {id: id}})

    if (!user) throw new ApiError("User not found", 400);
    
    const deleteToken = jwt.sign(
        {user_id: user.id}, 
        process.env.SECRET_KEY as string, 
        {expiresIn: "5m"}
    )

    res
        .cookie("delete_token", deleteToken, {httpOnly: true, secure: true, sameSite:"lax"})
        .status(200)
        .send("Token obtained succesfully, use the given token to delete this account")
}

export const deleteUser = async (req: Request, res: Response) => {
    const token = req.cookies.delete_token
    if (!token) throw new ApiError("Invalid delete account token", 400);

    const {id} = jwt.verify(token, process.env.SECRET_KEY as string) as PublicUser
    const status = await prisma.user.delete({where:{id}})

    if (!status) throw new ApiError("Username could not be deleted");
    res.clearCookie("delete_token", {httpOnly: true, secure: true, sameSite:"lax"}).sendStatus(204);
};