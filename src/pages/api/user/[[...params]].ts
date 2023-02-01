import { CreateUserDTO } from "@/validators/User.dto";
import { hash } from "bcrypt";
import * as Next from "next";
import {
    Body,
    createHandler,
    Post,
    Res,
    UnauthorizedException,
    ValidationPipe,
} from "next-api-decorators";
import { prismaClient } from "../../../services/prismaClient";
import { Error } from "../../../types/Error";

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
}

export default createHandler(UserHandler);
