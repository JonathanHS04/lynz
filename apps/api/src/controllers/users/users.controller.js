import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import {ApiError} from "../../utils/ApiError.js";
import {prisma} from "../../config/prismaClient.js";

dotenv.config()

export const getUsers = async (req, res) => {
    const users = await prisma.user.findMany({select:{username:true,email:true,role:true}})
    res.json(users);
};

export const createUser = async (req, res) => {
    const {username, email, password} = req.body

    if (await prisma.user.findUnique({where: {username}}))
        throw new ApiError("Username already exists", 400);
    if (await prisma.user.findUnique({where: {email}}))
        throw new ApiError("Email already exists", 400);

    const hashedPassword = await bcrypt.hash(password, Number(process.env.SALT_ROUNDS) || 10)
    const user = await prisma.user.create({data: {username, email, password:hashedPassword}})
    const token = jwt.sign(
        {user_id: user.id}, 
        process.env.SECRET_KEY, 
        {expiresIn: "1h"}
    )

    res
        .cookie("access_token", token, { httpOnly: true, secure: true, sameSite: "lax" })
        .status(201)
        .json({ // <-- CAMBIO: Devolver el usuario creado
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });
};

export const login = async (req, res) => {
    const {email, password} = req.body
    const user = await prisma.user.findUnique({where: {email}})

    if (!user) throw new ApiError("Email not found", 400);

    const passValidation = await bcrypt.compare(password, user.password)
    if (!passValidation) throw new ApiError("Wrong password", 400);

    const token = jwt.sign(
        {user_id: user.id}, 
        process.env.SECRET_KEY, 
        {expiresIn: "1h"}
    )

    res
        .cookie("access_token", token, { 
            httpOnly: true, 
            secure: process.env.NODE_ENV === "production", // Solo true en producción
            sameSite: "lax" 
        })
        .status(200)
        .json({
            id: user.id,
            username: user.username,
            email: user.email,
            role: user.role
        });
}

export const logout = async (req, res) => {
    res.clearCookie("access_token", {httpOnly: true, secure: true, sameSite:"lax"}).sendStatus(200)
}

export const getPublicUserDataById = async (req, res) => {
    const {id} = req.params
    const user = await prisma.user.findUnique({where: {id: id}, select: {username: true, email: true, role: true}})

    if (!user) throw new ApiError("User not found", 404);
    res.json(user)
}

export const getPrivateUserDataById = async (req, res) => {
    const {id} = req.params
    const user = await prisma.user.findUnique({where: {id: id}, select: {username: true, email: true, role: true}})
    if (!user) throw new ApiError("User not found", 404);
    res.json(user)
}


export const updateUserData = async (req, res) => {
    const {id} = req.params
    const {newUsername, newEmail, newPassword} = req.body
    const user = await prisma.user.findUnique({where: {id: id}})

    if (!user) throw new ApiError("User doesnt exist", 400)

    const updates = {}
    if (newUsername && user.username != newUsername){
        if (await prisma.user.findUnique({where: {username: newUsername}}))
            throw new ApiError("Username already exists", 400);
        updates.username = newUsername;
    } 
    if (newEmail && user.email != newEmail) {
        if (await prisma.user.findUnique({where: {email: newEmail}}))
            throw new ApiError("Email already exists", 400);
        updates.email = newEmail;
    }
    if (newPassword) {
        const newHashedPassword = await bcrypt.hash(newPassword,
            Number(process.env.SALT_ROUNDS) || 10);
        updates.password = newHashedPassword
    }
    await prisma.user.update({where:{id: id}, data: updates})

    res.sendStatus(200)
    
};

export const updateUserRole = async (req, res) => {
    const {id} = req.params
    const {role} = req.body
    await prisma.user.update({where:{id: id}, data: {role}})
    res.sendStatus(200)
}

export const requestDeleteUser = async (req, res) => {
    const {id} = req.params
    const user = await prisma.user.findUnique({where: {id: id}})

    if (!user) throw new ApiError("User not found", 400);
    
    const deleteToken = jwt.sign(
        {user_id: user.id}, 
        process.env.SECRET_KEY, 
        {expiresIn: "5m"}
    )

    res
        .cookie("delete_token", deleteToken, {httpOnly: true, secure: true, sameSite:"lax"})
        .status(200)
        .send("Token obtained succesfully, use the given token to delete this account")
}

export const deleteUser = async (req, res) => {
    const token = req.cookies.delete_token
    if (!token) throw new ApiError("Invalid delete account token", 400);

    const {user_id} = jwt.verify(token, process.env.SECRET_KEY)
    const status = await prisma.user.delete({where:{id: user_id}})

    if (!status) throw new ApiError("Username could not be deleted");
    res.clearCookie("delete_token", {httpOnly: true, secure: true, sameSite:"lax"}).sendStatus(204);
};