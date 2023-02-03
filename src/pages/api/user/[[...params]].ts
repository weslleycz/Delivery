import { JwtAuthGuard } from "@/middlewares/jwtAuthGuard";
import { JWT } from "@/types/JWT";
import { CreateUserDTO, LoginUserDTO } from "@/validators/User.dto";
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
import { isAdmin } from "../../../middlewares/isAdmin";
import { prismaClient } from "../../../services/prismaClient";
import { Error } from "../../../types/Error";
import { UpdateUserDTO } from "../../../validators/User.dto";

class UserHandler {
    @Post()
    public async createUser(
        @Body(ValidationPipe) body: CreateUserDTO,
        @Res() res: Next.NextApiResponse
    ) {
        const { cpf, email, name, password } = body;
        try {
            await prismaClient.user.create({
                data: {
                    cpf,
                    email,
                    name,
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
        try {
            const { email, password } = body;
            const user = await prismaClient.user.findUnique({
                where: {
                    email,
                },
                select: {
                    id: true,
                    password: true,
                },
            });
            if (!user) {
                throw new UnauthorizedException("e-mail não cadastrado");
            }
            if (await compare(password, user.password)) {
                if (process.env.TOKEN_KAY) {
                    return res.status(200).json({
                        token: sign({ data: user.id }, process.env.TOKEN_KAY, {
                            expiresIn: "24h",
                        }),
                    });
                }
            } else {
                throw new UnauthorizedException("Senha incorreta");
            }
        } catch (error) {
            throw new UnauthorizedException("User Not found!");
        }
    }

    @Get()
    @JwtAuthGuard()
    @isAdmin()
    public async listUser(@Res() res: Next.NextApiResponse) {
        try {
            const users = await prismaClient.user.findMany({
                select: {
                    name: true,
                    cpf: true,
                    email: true,
                    id: true,
                    orders: true,
                    cart: true,
                },
            });
            return res.status(200).json(users);
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Delete("/:id")
    @JwtAuthGuard()
    @isAdmin()
    public async deleteUser(
        @Param("id") id: string,
        @Res() res: Next.NextApiResponse
    ) {
        try {
            await prismaClient.user.delete({
                where: {
                    id,
                },
            });
            return res.status(200).json({ status: "deleted" });
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Put()
    @JwtAuthGuard()
    public async updateUser(
        @Body(ValidationPipe) body: UpdateUserDTO,
        @Res() res: Next.NextApiResponse,
        @Req() req: Next.NextApiRequest
    ) {
        const jsonJWT = <string>req.headers.token;
        const { data } = <JWT>JSON.parse(jsonJWT);
        try {
            await prismaClient.user.update({
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
}

export default createHandler(UserHandler);
