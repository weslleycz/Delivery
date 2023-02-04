import { isAdmin } from "@/middlewares/isAdmin";
import { JwtAuthGuard } from "@/middlewares/jwtAuthGuard";
import { getToken } from "@/services/getToken";
import { prismaClient } from "@/services/prismaClient";
import { CreateRestaurantDTO, UpdateRestaurantDTO } from "@/validators/Restaurant";
import * as Next from "next";
import {
    Body,
    createHandler,
    Get,
    Param,
    Post,
    Req,
    Res,
    Delete,
    UnauthorizedException,
    ValidationPipe,
    Put,
} from "next-api-decorators";
import { Error } from "../../../types/Error";

class RestaurantHandler {
    @Post()
    @JwtAuthGuard()
    @isAdmin()
    public async createRestaurant(
        @Res() res: Next.NextApiResponse,
        @Req() req: Next.NextApiRequest,
        @Body(ValidationPipe) body: CreateRestaurantDTO
    ) {
        try {
            const { cnpj, idAddress, logo, name } = body;
            const token = getToken(req.headers.token as string);
            const restaurant = await prismaClient.restaurant.create({
                data: {
                    cnpj,
                    name,
                    addressId: idAddress,
                    admId: token,
                    logo,
                },
            });
            return res.status(200).json({ status: "created" });
        } catch (error) {
            const e = <Error>error;
            if (e.code === "P2002") {
                throw new UnauthorizedException(`Já está vinculado`);
            } else {
                return res.status(400).json(error);
            }
        }
    }

}

export default createHandler(RestaurantHandler);
