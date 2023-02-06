import { JwtAuthGuard } from "@/middlewares/jwtAuthGuard";
import { emailGenerator } from "@/services/emailGenerator";
import { getToken } from "@/services/getToken";
import { stripe } from "@/services/stripe";
import { CreateOrderDTO } from "@/validators/Order.dto";
import * as Next from "next";
import {
    Body,
    createHandler,
    Post,
    Req,
    Res,
    ValidationPipe,
} from "next-api-decorators";
import { transporter } from "../../../services/nodemailer";
import { prismaClient } from "../../../services/prismaClient";

type IPtripe = {
    price: string;
    quantity: number;
};

class OrderHandler {
    @Post()
    @JwtAuthGuard()
    public async createOrder(
        @Body(ValidationPipe) body: CreateOrderDTO,
        @Req() req: Next.NextApiRequest,
        @Res() res: Next.NextApiResponse
    ) {
        try {
            const {
                caymentMethod,
                addressId,
                idRestaurant,
                mensagem,
                productsCard,
            } = body;
            const token = getToken(req.headers.token as string);

            const productIds = <string[]>(
                productsCard.map((products) => products.id)
            );

            const address = await prismaClient.address.findFirst({
                where: {
                    id: addressId,
                },
            });
            const latitude = <string>address?.latitude;
            const longitude = <string>address?.longitude;

            const products = await prismaClient.product.findMany({
                where: {
                    id: { in: productIds },
                },
            });

            const subtotal = products.reduce((acc, obj) => {
                return acc + obj.price;
            }, 0);

            if (caymentMethod === "Money") {
                const order = await prismaClient.order.create({
                    data: {
                        pay: false,
                        delivered: false,
                        frete: 0,
                        latitude,
                        longitude,
                        User: {
                            connect: {
                                id: token,
                            },
                        },
                        address: {
                            connect: {
                                id: address?.id,
                            },
                        },
                        payment: caymentMethod,
                        subtotal,
                        total: 0 + subtotal,
                        restaurant: {
                            connect: {
                                id: idRestaurant,
                            },
                        },
                        mensagem: mensagem,
                        status:"Aguardando o envio"
                    },
                });

                const restaurant = await prismaClient.restaurant.findFirst({
                    where: {
                        id: idRestaurant,
                    },
                });

                const user = await prismaClient.user.findFirst({
                    where: {
                        id: token,
                    },
                });

                const logo = <string>restaurant?.logo;
                const color = <string>restaurant?.color;

                const mailData = {
                    from: `${restaurant?.name}@gurudelivery.com`,
                    to: user?.email,
                    cc: user?.email,
                    subject: `Pedido confirmado 😋`,
                    html: emailGenerator({
                        link: `${req.rawHeaders[1]}/order/${order.id}`,
                        logo: logo,
                        name: restaurant?.name as string,
                        text: "No link abaixo você pode acompanhar o seu pedido.",
                        title: "Acompanhar pedido",
                        color: color,
                    }),
                };
                transporter.sendMail(mailData, function (err, info) {
                    if (err) {
                        console.log(err);
                    }
                });

                return res.status(200).json({ url: `/order/${order.id}` });
            } else {
                const listProducts = <IPtripe[]>await Promise.all(
                    productsCard.map(async (product) => {
                        const data = await stripe.products.retrieve(
                            product.id as string
                        );
                        return {
                            price: data.default_price,
                            quantity: product.quantity,
                        };
                    })
                );
                
                const paymentLink = await stripe.paymentLinks.create({
                    line_items: listProducts,
                    payment_method_types: ["card"],
                });

                await prismaClient.order.create({
                    data: {
                        pay: false,

                        delivered: false,
                        frete: 0,
                        latitude,
                        longitude,
                        User: {
                            connect: {
                                id: token,
                            },
                        },
                        address: {
                            connect: {
                                id: address?.id,
                            },
                        },
                        payment: caymentMethod,
                        subtotal,
                        total: 0 + subtotal,
                        restaurant: {
                            connect: {
                                id: idRestaurant,
                            },
                        },
                        mensagem: mensagem,
                        paymentLink: paymentLink.url,
                        paymentLinkId: paymentLink.id,
                        status:"Aguardando o pagamento"
                        
                    },
                });

                const restaurant = await prismaClient.restaurant.findFirst({
                    where: {
                        id: idRestaurant,
                    },
                });

                const user = await prismaClient.user.findFirst({
                    where: {
                        id: token,
                    },
                });

                const logo = <string>restaurant?.logo;
                const color = <string>restaurant?.color;

                const mailData = {
                    from: `${restaurant?.name}@gurudelivery.com`,
                    to: user?.email,
                    cc: user?.email,
                    subject: `Pagamento`,
                    html: emailGenerator({
                        link: paymentLink.url,
                        logo: logo,
                        name: restaurant?.name as string,
                        text: "Agora basta efetuar o pagamento para podermos enviar o seu pedido",
                        title: "Efetuar pagamento",
                        color: color,
                    }),
                };
                transporter.sendMail(mailData, function (err, info) {
                    if (err) {
                        console.log(err);
                    }
                });

                return res.status(200).json({ url: paymentLink.url });
            }
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}

export default createHandler(OrderHandler);
