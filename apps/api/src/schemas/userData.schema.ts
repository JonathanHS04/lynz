import {z} from "zod"

export const userDataSchema: z.ZodType = z.object({
    username: z
        .string()
        .min(3, { message: "El username debe tener al menos 3 caracteres" })
        .max(30, { message: "El username no puede superar 30 caracteres" }),
    email: z.email({ message: "El email no es válido" }),
    password: z
        .string()
        .min(6, { message: "La contraseña debe tener al menos 6 caracteres" })
        .max(100, { message: "La contraseña es demasiado larga" }),
})