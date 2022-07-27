export const JWT_SECRET = "Levelupprojectatlp7";
import * as jwt from "jsonwebtoken";

export interface AuthTokenPayload{
    userId:number;
}


export function decodeAuthHeader(authHeader:String):AuthTokenPayload{
    const token =authHeader.replace("Bearer","");

    if(!token){
        throw new Error("No token Provided");
    }

    return jwt.verify(token, JWT_SECRET) as AuthTokenPayload;
}