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
    public async loginAdm(
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

    @Put()
    @JwtAuthGuard()
    @isAdmin()
    public async updateAdm(
        @Res() res: Next.NextApiResponse,
        @Req() req: Next.NextApiRequest,
        @Body(ValidationPipe) body: UpdateAdmDTO
    ) {
        const jsonJWT = <string>req.headers.token;
        const { data } = <JWT>JSON.parse(jsonJWT);
        try {
            await prismaClient.adm.update({
                data: {
                    ...body,
                },
                where: {
                    id: data,
                },
            });
            return res.status(200).json({ status: "update" });
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Get()
    @JwtAuthGuard()
    @isAdmin()
    public async listAdm(@Res() res: Next.NextApiResponse) {
        try {
            const adm = await prismaClient.adm.findMany({
                select: {
                    id: true,
                    email: true,
                    _count: true,
                    restaurants: true,
                },
            });
            return res.status(200).json(adm);
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}

export default createHandler(ADMHandler);
