import  jwt  from "jsonwebtoken";

interface TokenPayload{
    userId: string;
    role: "user" | "admin";
}

export const generateToken = (payload: TokenPayload)=>{
    const token = jwt.sign(payload,process.env.JWT_SECRET!,{
        expiresIn: "1h"
    })
    return token;
}