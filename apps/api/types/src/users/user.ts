import { Express, Request } from "express";
export type UserRole = "user" | "moderator" | "admin";

export type PublicUser = {
    id: string;
    username: string;
    email: string;
    role: UserRole;
}

export type PublicUserRequest = Request & {
    user?: PublicUser
}

export type CompleteUser = PublicUser & {
    password: string;
}