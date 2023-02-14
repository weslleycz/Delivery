import { isAdmin } from "@/middlewares/isAdmin";
import { JwtAuthGuard } from "@/middlewares/jwtAuthGuard";
import { emailGenerator } from "@/services/emailGenerator";
import { getToken } from "@/services/getToken";
import { stripe } from "@/services/stripe";
import { CreateOrderDTO } from "@/validators/Order.dto";
import { v4 as uuidv4 } from 'uuid';
import { Prisma } from "@prisma/client";
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

            const productsList =<Prisma.ProductWhereUniqueInput> products.map((valor) => {
                return { id: valor.id}
            });

            const subtotal = products.reduce((acc, obj) => {
                return acc + obj.price;
            }, 0);

            if (caymentMethod === "Money") {
                const order = await prismaClient.order.create({
                    data: {
                        paymentLinkId:uuidv4().toString(),
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
                        products: {
                            connect: productsList,
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
                        status: "Aguardando o envio",
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
                const formName = <string>restaurant?.name;

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
                        intro: "Compra realizada com sucesso.",
                        formName: formName,
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
                        status: "Aguardando o pagamento",
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
                const formName = <string>restaurant?.name;

                const mailData = {
                    from: `${restaurant?.name}@gurudelivery.com`,
                    to: user?.email,
                    cc: user?.email,
                    subject: `Pagamento`,
                    html: emailGenerator({
                        link: paymentLink.url,
                        logo: logo,
                        name: user?.name as string,
                        text: "Agora basta efetuar o pagamento para podermos enviar o seu pedido",
                        title: "Efetuar pagamento",
                        color: color,
                        intro: "Compra realizada com sucesso.",
                        formName,
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

    @Get("/user")
    @JwtAuthGuard()
    public async getOrderUser(
        @Req() req: Next.NextApiRequest,
        @Res() res: Next.NextApiResponse
    ) {
        try {
            const token = getToken(req.headers.token as string);
            const order = await prismaClient.order.findMany({
                where: {
                    userId: token,
                },
            });
            return res.status(200).json(order);
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Get("/restaurant/:id")
    @JwtAuthGuard()
    @isAdmin()
    public async getOrderRestaurant(
        @Req() req: Next.NextApiRequest,
        @Res() res: Next.NextApiResponse,
        @Param("id") id: string
    ) {
        try {
            const order = await prismaClient.order.findMany({
                where: {
                    OR: [
                        { pay: true, restaurantId: id },
                        { payment: "Money", restaurantId: id },
                    ],
                    NOT: [{ status: "Cancelado" }, { status: "Entregue" }],
                },
            });

            return res.status(200).json(order);
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Get("/adm")
    @JwtAuthGuard()
    @isAdmin()
    public async getOrderAdm(
        @Req() req: Next.NextApiRequest,
        @Res() res: Next.NextApiResponse
    ) {
        try {
            const token = getToken(req.headers.token as string);

            const restaurants = await prismaClient.restaurant.findMany({
                where: {
                    admId: token,
                },
                select: {
                    id: true,
                },
            });

            const restaurantsList = restaurants.map((valor) => valor.id);

            const order = await prismaClient.order.findMany({
                where: {
                    OR: [
                        {
                            pay: true,
                            restaurantId: { in: restaurantsList },
                        },
                        {
                            payment: "Money",
                            restaurantId: { in: restaurantsList },
                        },
                    ],
                    NOT: [{ status: "Cancelado" }, { status: "Entregue" }],
                },
                include:{
                    products:true
                }
            });

            return res.status(200).json(order);
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Delete("/restaurant/:id")
    @JwtAuthGuard()
    @isAdmin()
    public async deleteOrderAdm(
        @Req() req: Next.NextApiRequest,
        @Res() res: Next.NextApiResponse,
        @Param("id") id: string
    ) {
        try {
            const order = await prismaClient.order.update({
                data: {
                    status: "Cancelado",
                },
                where: {
                    id,
                },
            });

            const user = await prismaClient.user.findFirst({
                where: {
                    id: order.userId?.toString(),
                },
            });

            const restaurant = await prismaClient.restaurant.findFirst({
                where: {
                    id: order.restaurantId?.toString(),
                },
            });

            const logo = <string>restaurant?.logo?.toString();
            const color = <string>restaurant?.color?.toString();
            const formName = <string>restaurant?.name;

            const mailData = {
                from: `suporte@gurudelivery.com`,
                to: user?.email,
                cc: user?.email,
                subject: `Pedido cancelado 🥺`,
                html: emailGenerator({
                    link: `${req.rawHeaders[1]}`,
                    logo,
                    name: restaurant?.name as string,
                    text: "Tente comprar novamente se o produto ainda estiver disponível.",
                    title: "Voltar para o site",
                    color: color,
                    intro: `Pedido ${order.id} foi cancelado pelo o restaurante.`,
                    formName,
                }),
            };

            if (order.payment !== "Money") {
                await stripe.paymentLinks.update(
                    order.paymentLinkId as string,
                    {
                        active: false,
                    }
                );
                await prismaClient.order.update({
                    data: {
                        paymentLink: null,
                    },
                    where: {
                        id,
                    },
                });
            }

            transporter.sendMail(mailData, function (err, info) {
                if (err) {
                    console.log(err);
                }
            });

            return res.status(200).json({ status: "deleted" });
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Delete("/user/:id")
    @JwtAuthGuard()
    public async deleteOrderUser(
        @Req() req: Next.NextApiRequest,
        @Res() res: Next.NextApiResponse,
        @Param("id") id: string
    ) {
        try {
            const order = await prismaClient.order.update({
                data: {
                    status: "Cancelado",
                },
                where: {
                    id,
                },
            });

            const user = await prismaClient.user.findFirst({
                where: {
                    id: order.userId?.toString(),
                },
            });

            const restaurant = await prismaClient.restaurant.findFirst({
                where: {
                    id: order.restaurantId?.toString(),
                },
            });

            const logo = <string>restaurant?.logo?.toString();
            const color = <string>restaurant?.color?.toString();
            const formName = <string>restaurant?.name;

            const mailData = {
                from: `suporte@gurudelivery.com`,
                to: user?.email,
                cc: `suporte@gurudelivery.com`,
                subject: `Pedido cancelado 🥺`,
                html: emailGenerator({
                    link: `${req.rawHeaders[1]}`,
                    logo,
                    name: user?.name as string,
                    text: "Se isso foi um erro efetue a compra novamente.",
                    title: "Voltar para o site",
                    color: color,
                    intro: `Pedido ${order.id} cancelado com sucesso.`,
                    formName,
                }),
            };

            if (order.payment !== "Money") {
                await stripe.paymentLinks.update(
                    order.paymentLinkId as string,
                    {
                        active: false,
                    }
                );
                await prismaClient.order.update({
                    data: {
                        paymentLink: null,
                    },
                    where: {
                        id,
                    },
                });
            }

            transporter.sendMail(mailData, function (err, info) {
                if (err) {
                    console.log(err);
                }
            });

            transporter.sendMail(
                {
                    from: `suporte@gurudelivery.com`,
                    to: user?.email,
                    cc: user?.email,
                    subject: `Pedido cancelado ${order.id}`,
                    html: emailGenerator({
                        link: `${req.rawHeaders[1]}`,
                        logo,
                        name: restaurant?.name as string,
                        text: "Volte para o seu dashboard para acompanhar os pedidos.",
                        title: "Voltar para o dashboard",
                        color: color,
                        intro: `Pedido ${order.id} foi cancelado pelo o cliente ${user?.name},
                        portador do cpf ${user?.cpf}.`,
                        formName,
                    }),
                },
                function (err, info) {
                    if (err) {
                        console.log(err);
                    }
                }
            );

            return res.status(200).json({ status: "deleted" });
        } catch (error) {
            return res.status(400).json(error);
        }
    }

    @Get("/send/:id")
    @JwtAuthGuard()
    @isAdmin()
    public async sendOrder(
        @Param("id") id: string,
        @Res() res: Next.NextApiResponse
    ) {
        try {
            await prismaClient.order.update({
                where: {
                    id: id,
                },
                data: {
                    status: "Entregue",
                },
            });
            return res.status(200).json({ status: "confirmed" });
        } catch (error) {
            return res.status(400).json(error);
        }
    }
}

export default createHandler(OrderHandler);
