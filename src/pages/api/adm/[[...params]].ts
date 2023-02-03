import { isAdmin } from "@/middlewares/isAdmin";
import { JwtAuthGuard } from "@/middlewares/jwtAuthGuard";
import { prismaClient } from "@/services/prismaClient";
import { JWT } from "@/types/JWT";
import { compare, hash } from "bcrypt";
import { sign } from "jsonwebtoken";
import * as Next from "next";
import {
    Body,
    createHandler,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Req,
    Res,
    UnauthorizedException,
    ValidationPipe,
} from "next-api-decorators";
import { Error } from "../../../types/Error";
import { CreateAdmDTO, UpdateAdmDTO } from "../../../validators/Adm.dto";
import { LoginUserDTO } from "../../../validators/User.dto";

class ADMHandler {
    @Post()
    public async createUser(
        @Res() res: Next.NextApiResponse,
        @Body(ValidationPipe) body: CreateAdmDTO
    ) {
        const { email, password } = body;
        try {
            await prismaClient.adm.create({
                data: {
                    email,
                    password: await hash(password, 10),
                },
            });
            return res.status(200).json({ status: "created" });
        } catch (error) {
            const e = <Error>error;
            if (e.code === "P2002") {
                throw new UnauthorizedException(
                    `${e.meta.target[0]} já está vinculado`
                );
            } else {
                return res.status(400).json(error);
            }
        }
    }
    
    @Post("/login")
    public async login(
        @Res() res: Next.NextApiResponse,
        @Body(ValidationPipe) body: LoginUserDTO
    ) {
        const { email, password } = body;
        try {
            const data = await prismaClient.adm.findUnique({
                where: {
                    email,
                },
            });
            if (!data) {
                throw new UnauthorizedException("User Not found!");
            }

            if (await compare(password, data.password)) {
                if (process.env.TOKEN_KAY) {
                    return res.status(200).json({
                        token: sign(
                            { data: data.id, isAdmin: true },
                            process.env.TOKEN_KAY,
                            {
                                expiresIn: "24h",
                            }
                        ),
                    });
                }
            } else {
                throw new UnauthorizedException("User Not found!");
            }
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}

export default createHandler(ADMHandler);
