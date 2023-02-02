import { CreateUserDTO } from "@/validators/User.dto";
import { hash } from "bcrypt";
import * as Next from "next";
import {
    Body,
    createHandler,
    Delete,
    Get,
    Param,
    Post,
    Put,
    Res,
    UnauthorizedException,
    ValidationPipe,
} from "next-api-decorators";
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

    @Get()
    public async listUser(@Res() res: Next.NextApiResponse) {
        try {
            const users = await prismaClient.user.findMany();
            console.log(users);
            return res.status(200).json(users);
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Delete("/:id")
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

    @Put("/:id")
    public async updateUser(
        @Param("id") id: string,
        @Body(ValidationPipe) body: UpdateUserDTO,
        @Res() res: Next.NextApiResponse
    ) {
        try {
            const data = body;
            await prismaClient.user.update({
                where: {
                    id,
                },
                data: {
                    ...data,
                },
            });
            return res.status(200).json({ status: "update" });
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}

export default createHandler(UserHandler);
