import zod from "zod"
import { Request, Response, NextFunction } from "express";
export const validate = (schema: zod.ZodType) => (req: Request, res: Response, next: NextFunction)=> {
    const result = schema.parse({
        ...req.body,
        ...req.query,
        ...req.params,
    });
    next()
}