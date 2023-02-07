import { isAdmin } from "@/middlewares/isAdmin";
import { JwtAuthGuard } from "@/middlewares/jwtAuthGuard";
import { getToken } from "@/services/getToken";
import { prismaClient } from "@/services/prismaClient";
import {
    CreateRestaurantDTO,
    UpdateRestaurantDTO,
} from "@/validators/Restaurant";
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
            const { cnpj, idAddress, logo, name, color } = body;
            const token = getToken(req.headers.token as string);
            const restaurant = await prismaClient.restaurant.create({
                data: {
                    cnpj,
                    name,
                    addressId: idAddress,
                    admId: token,
                    logo,
                    color,
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

    @Get()
    public async litAllRestaurant(@Res() res: Next.NextApiResponse) {
        try {
            const restaurants = await prismaClient.restaurant.findMany();
            return res.status(200).json(restaurants);
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Get("/:id")
    public async selectRestaurant(
        @Param("id") id: string,
        @Res() res: Next.NextApiResponse
    ) {
        try {
            const restaurant = await prismaClient.restaurant.findFirst({
                where: {
                    id,
                },
            });
            return res.status(200).json(restaurant);
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Delete("/:id")
    @JwtAuthGuard()
    @isAdmin()
    public async deleteRestaurant(
        @Param("id") id: string,
        @Res() res: Next.NextApiResponse,
        @Body(ValidationPipe) body: UpdateRestaurantDTO
    ) {
        try {
            const restaurant = await prismaClient.restaurant.delete({
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
    @isAdmin()
    public async updateRestaurant(
        @Param("id") id: string,
        @Res() res: Next.NextApiResponse,
        @Body(ValidationPipe) body: UpdateRestaurantDTO
    ) {
        try {
            const restaurant = await prismaClient.restaurant.update({
                data: {
                    ...body,
                },
                where: {
                    id,
                },
            });
            return res.status(200).json({ status: "update" });
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Get("/adm/list")
    @JwtAuthGuard()
    @isAdmin()
    public async getRestaurantAdm(
        @Res() res: Next.NextApiResponse,
        @Req() req: Next.NextApiRequest
    ) {
        try {
            const token = getToken(req.headers.token as string);
            const restaurants = await prismaClient.restaurant.findMany({
                where: {
                    admId: token,
                },
            });
            return res.status(200).json(restaurants);
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}

export default createHandler(RestaurantHandler);
