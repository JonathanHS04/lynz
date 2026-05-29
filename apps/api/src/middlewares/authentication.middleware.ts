import jwt from "jsonwebtoken"
import { ApiError } from "../utils/ApiError.js"
import { prisma } from "../config/prismaClient.js"
import { NextFunction, Request, Response } from "express"
import { PublicUser, CompleteUser, PublicUserRequest } from "@repo/types"

export const authentication = async (req: PublicUserRequest, res: Response, next: NextFunction) => {
    const token = req.cookies.access_token
    let data: PublicUser | null = null;

    if(!token) throw new ApiError("You have to login first", 401);

    try{
        data = jwt.verify(token, process.env.SECRET_KEY!) as PublicUser
    } catch(error){
        throw new ApiError("Session expired, please re-login", 401)
    }
    
    const user: CompleteUser | null = await prisma.user.findUnique({ where: { id: data.id } });

    if (!user) throw new ApiError("Username doesnt exist", 400)

    const publicUser: PublicUser = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    }

    req.user = publicUser

    next()
}