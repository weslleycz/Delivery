import { isAdmin } from "@/middlewares/isAdmin";
import { JwtAuthGuard } from "@/middlewares/jwtAuthGuard";
import { prismaClient } from "@/services/prismaClient";
import { CreateProductDTO, UpdateProductDTO } from "@/validators/Product";
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
import { stripe } from "../../../services/stripe";

type Query = {
    page: string;
};

class ProductHandler {
    @Post()
    @JwtAuthGuard()
    @isAdmin()
    public async createProduct(
        @Body(ValidationPipe) body: CreateProductDTO,
        @Res() res: Next.NextApiResponse
    ) {
        try {
            const {
                description,
                name,
                price,
                type,
                discount,
                imagens,
                idRestaurant,
            } = body;
            const product = await prismaClient.product.create({
                data: {
                    description,
                    name,
                    price,
                    type,
                    discount,
                    img:imagens[0],
                    Restaurant: {
                        connect: {
                            id: idRestaurant,
                        },
                    },
                },
            });
            await stripe.products.create({
                name: name,
                id: product.id,
                images: imagens,
                description: description,
                default_price_data: {
                    unit_amount: price,
                    currency: "BRL",
                },
                expand: ["default_price"],
            });
            return res.status(200).json({ status: "created" });
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Get("/:id")
    public async paginationProduct(
        @Res() res: Next.NextApiResponse,
        @Req() req: Next.NextApiRequest,
        @Param("id") restaurantId: string
    ) {
        try {
            const { page } = <Query>req.query;
            const cursor: number = +page;
            if (cursor === 1 || cursor === 0) {
                const products = await prismaClient.product.findMany({
                    where: {
                        restaurantId,
                    },
                    take: 12,
                    orderBy: {
                        id: "asc",
                    },
                });
                const counter = await prismaClient.product.count();
                const totalPages = Math.ceil(counter / 12);
                return res
                    .status(200)
                    .json({ products, page: cursor, totalPages });
            } else {
                const products = await prismaClient.product.findMany({
                    take: 12,
                    skip: cursor * 12,
                    orderBy: {
                        id: "asc",
                    },
                });
                const counter = await prismaClient.product.count();
                const totalPages = Math.ceil(counter / 12);
                return res
                    .status(200)
                    .json({ products, page: cursor, totalPages });
            }
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Get()
    @JwtAuthGuard()
    @isAdmin()
    public async listProduct(@Res() res: Next.NextApiResponse) {
        try {
            const products = await prismaClient.product.findMany();
            return res.status(200).json(products);
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Delete("/:id")
    @JwtAuthGuard()
    @isAdmin()
    public async deleteProduct(
        @Param("id") id: string,
        @Res() res: Next.NextApiResponse
    ) {
        try {
            await prismaClient.product.delete({
                where: {
                    id,
                },
            });
            await stripe.products.update(id, {
                active: false,
            });
            return res.status(200).json({ status: "deleted" });
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Put("/:id")
    @JwtAuthGuard()
    @isAdmin()
    public async updateProduct(
        @Body(ValidationPipe) body: UpdateProductDTO,
        @Res() res: Next.NextApiResponse,
        @Param("id") id: string
    ) {
        try {
            await prismaClient.product.update({
                data: {
                    ...body,
                },
                where: {
                    id: id,
                },
            });
            await stripe.products.update(id, {
                ...body,
            });
            return res.status(200).json({ status: "update" });
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Get("/imagems/:id")
    public async getImagens(
        @Param("id") id: string,
        @Res() res: Next.NextApiResponse
    ) {
        const product = await prismaClient.product.findFirst({
            where:{
               id 
            },
            select:{
               img:true

            }
        })
        return res.status(200).json(product?.img);
    }

    @Get("/select/:id")
    public async setProduct(
        @Res() res: Next.NextApiResponse,
        @Param("id") id: string
    ) {
        try {
            const product = await prismaClient.product.findFirst({
                where: {
                    id,
                },
            });
            return res.status(200).json(product);
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}

export default createHandler(ProductHandler);
