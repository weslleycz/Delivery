import { isAdmin } from "@/middlewares/isAdmin";
import { JwtAuthGuard } from "@/middlewares/jwtAuthGuard";
import { getToken } from "@/services/getToken";
import { prismaClient } from "@/services/prismaClient";
import { CreateAddressDTO, UpdateAddressDTO } from "@/validators/Address";
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
    ValidationPipe,
} from "next-api-decorators";

class AddressHandler {
    @Post("/adm")
    @JwtAuthGuard()
    @isAdmin()
    public async createAddressAdm(
        @Res() res: Next.NextApiResponse,
        @Req() req: Next.NextApiRequest,
        @Body(ValidationPipe) body: CreateAddressDTO
    ) {
        try {
            const token = getToken(req.headers.token as string);
            const address = await prismaClient.address.create({
                data: {
                    adms: {
                        connect: {
                            id: token,
                        },
                    },
                    ...body,
                },
            });
            return res.status(200).json({ id: address.id });
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Post("/user")
    @JwtAuthGuard()
    public async createAddressUser(
        @Res() res: Next.NextApiResponse,
        @Req() req: Next.NextApiRequest,
        @Body(ValidationPipe) body: CreateAddressDTO
    ) {
        try {
            const token = getToken(req.headers.token as string);
            const address = await prismaClient.address.create({
                data: {
                    User: {
                        connect: {
                            id: token,
                        },
                    },
                    ...body,
                },
            });
            return res.status(200).json({ id: address.id });
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Get()
    @JwtAuthGuard()
    public async getAllAddressUser(
        @Res() res: Next.NextApiResponse,
        @Req() req: Next.NextApiRequest
    ) {
        try {
            const token = getToken(req.headers.token as string);
            const address = await prismaClient.address.findMany({
                where: {
                    userId: token,
                },
            });
            return res.status(200).json(address);
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Delete("/:id")
    @JwtAuthGuard()
    public async deleteAddress(
        @Res() res: Next.NextApiResponse,
        @Param("id") id: string
    ) {
        try {
            await prismaClient.address.delete({
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
    @JwtAuthGuard()
    public async updateAddress(
        @Res() res: Next.NextApiResponse,
        @Body(ValidationPipe) body: UpdateAddressDTO,
        @Param("id") id: string
    ) {
        try {
            await prismaClient.address.update({
                where: {
                    id,
                },
                data: {
                    ...body,
                },
            });
            return res.status(200).json({ status: "update" });
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}

export default createHandler(AddressHandler);
