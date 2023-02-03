import { isAdmin } from "@/middlewares/isAdmin";
import { JwtAuthGuard } from "@/middlewares/jwtAuthGuard";
import { prismaClient } from "@/services/prismaClient";
import { CreateProductDTO } from "@/validators/Product";
import * as Next from "next";
import {
    Body,
    createHandler,
    Post,
    Res,
    ValidationPipe,
} from "next-api-decorators";
import { stripe } from "../../../services/stripe";

class ProductHandler {
    @Post()
    @JwtAuthGuard()
    @isAdmin()
    public async createProduct(
        @Body(ValidationPipe) body: CreateProductDTO,
        @Res() res: Next.NextApiResponse
    ) {
        try {
            const { description, name, price,type,discount,imagens } = body;
            const product = await prismaClient.product.create({
                data: {
                    description,
                    name,
                    price,
                    type,
                    discount
                },
            });
            await stripe.products.create({
                name: name,
                id:product.id,
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
}

export default createHandler(ProductHandler);
