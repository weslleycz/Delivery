import { verify } from "jsonwebtoken";
import { NextApiRequest, NextApiResponse } from "next";
import {
    createMiddlewareDecorator,
    NextFunction,
    UnauthorizedException
} from "next-api-decorators";

export const JwtAuthGuard = createMiddlewareDecorator(
  (req: NextApiRequest, res: NextApiResponse, next: NextFunction) => {
    try {
      const token =<string> req.headers.token;
      if (process.env.TOKEN_KAY) {
        req.headers.token = JSON.stringify(verify(token,process.env.TOKEN_KAY));
        next();
      }
    } catch (error) {
      return next(new UnauthorizedException());
    }
  }
);