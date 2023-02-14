import { NextApiRequest, NextApiResponse } from "next";

import {
    createMiddlewareDecorator,
    NextFunction,
    UnauthorizedException
} from "next-api-decorators";
import { JWT } from "../types/JWT";

export const isAdmin = createMiddlewareDecorator(
    (req: NextApiRequest, res: NextApiResponse, next: NextFunction)=>{
        const jsonJWT =<string> req.headers.token;
        const {isAdmin} = <JWT> JSON.parse(jsonJWT);
        if (isAdmin) {
            
            next();
        }else{
            return next(new UnauthorizedException("Authorization Required"));
        }
    }
);