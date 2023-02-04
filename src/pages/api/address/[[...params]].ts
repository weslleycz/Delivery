import { isAdmin } from "@/middlewares/isAdmin";
import { JwtAuthGuard } from "@/middlewares/jwtAuthGuard";
import { getToken } from "@/services/getToken";
import { prismaClient } from "@/services/prismaClient";
import { CreateAddressDTO } from "@/validators/Address";
import * as Next from "next";
import {
    Body,
    createHandler,
    Post,
    Req,
    Res,
    ValidationPipe,
} from "next-api-decorators";

class AddressHandler {
    @Post("/adm")
    @JwtAuthGuard()
    @isAdmin()
    public async createRestaurant(
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
            return res.status(200).json({id:address.id});
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}

export default createHandler(AddressHandler);
