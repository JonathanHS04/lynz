import bcrypt from "bcrypt"
import { ApiError } from "../utils/ApiError.js";
import { prisma } from "../config/prismaClient.js";

export const isModerator = (req, res, next) => {
    if ( req.user.role === "moderator" || req.user.role === "admin") next();
    else throw new ApiError("User doesnt have administrator permissions", 403)
}

export const isAdmin = (req, res, next) => {
    if ( req.user.role === "admin") next();
    else throw new ApiError("User doesnt have administrator permissions", 403)
}

export const isModeratorOrOwnerWithPassword = async (req, res, next) => {
    let id = req.params.id

    const {password} = req.body
    const user = await prisma.user.findUnique({ where: { id: id } });
    if(!user) throw new ApiError("User does not exist", 400)

    if (req.user.role != "admin" && req.user.role != "moderator") {
        if (id != req.user.id) throw new ApiError("You cannot update another user's data", 403)
        if (!password) throw new ApiError("You need to enter the user password to change your data", 400)
        const passValidation = await bcrypt.compare(password, user.password)
        if (!passValidation) throw new ApiError("Wrong password", 401)
    }
    next()
}

export const isModeratorOrOwner = async (req, res, next) => {
    let id = req.params.id
    const user = await prisma.user.findUnique({ where: { id: id } });
    if(!user) throw new ApiError("User does not exist", 400)
    if (req.user.role != "admin" && req.user.role != "moderator") {
        if (id != req.user.id) throw new ApiError("You cannot update another user's data", 403)
    }
    next()
}