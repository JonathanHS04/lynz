import {z} from "zod"

export const errorMiddleware = (err, req, res, next) =>{
    let status = err.status || 500
    let message = err.message || "Internal server error"
    let details

    if(err instanceof z.ZodError){
        status = 400
        message = err.issues[0]?.message
        details = err.issues
    }

    console.error(err)

    res.status(status).json({
        message,
        ...(details ? { details } : {}),
    })
}