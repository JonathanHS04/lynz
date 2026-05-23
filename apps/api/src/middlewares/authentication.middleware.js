import jwt from "jsonwebtoken"
import dotenv from "dotenv"
import { ApiError } from "../utils/ApiError.js"
import { prisma } from "../config/prismaClient.js"

dotenv.config()

export const authentication = async (req, res, next) => {
    const token = req.cookies.access_token
    let data = null;

    if(!token) throw new ApiError("You have to login first", 401);

    try{
        data = jwt.verify(token, process.env.SECRET_KEY)
    } catch(error){
        throw new ApiError("Session expired, please re-login", 401)
    }
    
    const user = await prisma.user.findUnique({ where: { id: data.user_id } });

    if (!user) throw new ApiError("Username doesnt exist", 400)

    req.user = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role
    }

    next()
}