import bcrypt from "bcrypt"
import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../config/prismaClient.js";
import { Request, Response, NextFunction } from "express";
import { CompleteUser, PublicUser, PublicUserRequest } from "@repo/types";

export const isModerator = (req: PublicUserRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new Error("Unauthorized")
    }
    if ( req.user.role === "moderator" || req.user.role === "admin") next();
    else throw new ApiError("User doesnt have administrator permissions", 403)
}

export const isAdmin = (req: PublicUserRequest, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new Error("Unauthorized")
    }
    if ( req.user.role === "admin") next();
    else throw new ApiError("User doesnt have administrator permissions", 403)
}

export const isModeratorOrOwnerWithPassword = async (req: Request<{id:string}> & { user?: PublicUser }, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new Error("Unauthorized")
    }
    const {id}: {id: string} = req.params

    const {password} = req.body
    const user: CompleteUser | null = await prisma.user.findUnique({ where: { id } });
    if(!user) throw new ApiError("User does not exist", 400)

    if (req.user.role != "admin" && req.user.role != "moderator") {
        if (id != req.user.id) throw new ApiError("You cannot update another user's data", 403)
        if (!password) throw new ApiError("You need to enter the user password to change your data", 400)
        const passValidation = await bcrypt.compare(password, user.password)
        if (!passValidation) throw new ApiError("Wrong password", 401)
    }
    next()
}

export const isModeratorOrOwner = async (req: Request<{id:string}> & { user?: PublicUser }, res: Response, next: NextFunction) => {
    if (!req.user) {
        throw new Error("Unauthorized")
    }
    const {id}: {id: string} = req.params
    const user = await prisma.user.findUnique({ where: { id } });
    if(!user) throw new ApiError("User does not exist", 400)
    if (req.user.role != "admin" && req.user.role != "moderator") {
        if (id != req.user.id) throw new ApiError("You cannot update another user's data", 403)
    }
    next()
}