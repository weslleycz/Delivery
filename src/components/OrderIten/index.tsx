import { api } from "@/services/apí";
import { Box, Divider, Grid, ListItem, ListItemText } from "@mui/material";
import { getCookie } from "cookies-next";
import { LatLngExpression } from "leaflet";
import Image from "next/image";
import { Notify, notifyError, notifySuccess } from "../Notify";

type User = {
    id: string;
    email: string;
    password: string;
    cpf: string;
    name: string;
};

type address = {
    id: string;
    state: string;
    city: string;
    cep: string;
    district: string;
    street: string;
    number: number;
    latitude: string;
    longitude: string;
    userId: string;
};

type IOrder = {
    id: string;
    frete: number;
    total: number;
    subtotal: number;
    pay: boolean;
    delivered: boolean;
    payment: string;
    latitude: string;
    longitude: string;
    status: string;
    current_latitude: string;
    current_longitude: string;
    paymentLinkId: string;
    mensagem: string;
    paymentLink: string;
    userId: string;
    restaurantId: string;
    addressId: string;
    User: User;
    address: address;
    products: [
        {
            id: string;
            name: string;
            price: number;
            description: string;
            type: string;
            img: string;
            discount: string;
            cartId: string;
            restaurantId: string;
            orderId: string;
        }
    ];
};

type Props = {
    setPage: (valor: string) => void;
    setPosition: (valor: LatLngExpression) => void;
    setOrder: (valor: any) => void;
    order: IOrder;
    refetch: any;
};

export const OrderIten = ({
    setPage,
    order,
    setPosition,
    refetch,
    setOrder,
}: Props) => {
    const token = getCookie("@tokenAdmin");

    const handleCancel = async () => {
        try {
            await api.delete(`/order/restaurant/${order.id}`, {
                headers: {
                    Authorization: token,
                },
            });
            notifySuccess("Pedido cancelado com sucesso");
            refetch();
        } catch (error) {
            notifyError("Ocorreu um erro inesperado");
        }
    };

    const handleConfirme = async () => {
        try {
            await api.get(`/order/send/${order.id}`, {
                headers: {
                    authorization: token,
                },
            });
            notifySuccess("Pedido entregue");
            refetch();
        } catch (error) {
            console.log(error);
            notifyError("Ocorreu um erro inesperado");
        }
    };

    return (
        <>
            <Box
                sx={{
                    p: 2,
                }}
            >
                <Notify />
                <ListItem
                    button
                    onClick={() => {
                        setOrder(order);
                        setPage("Order");
                    }}
                >
                    <ListItemText
                        sx={{ fontWeight: "bold", fontSize: 60 }}
                        primary={
                            <Grid container spacing={1}>
                                <Grid item xs={6} md={8}>
                                    {order.User.name}
                                </Grid>
                                <Grid item xs={6} md={4}>
                                    <Box sx={{ marginLeft: 20 }}>
                                        <Image
                                            src={
                                                order.payment === "Money"
                                                    ? "/money.png"
                                                    : "/Card.png"
                                            }
                                            alt="Picture of the author"
                                            width={35}
                                            height={35}
                                        />
                                    </Box>
                                </Grid>
                            </Grid>
                        }
                        secondary={`Rua ${order.address.street} - ${order.address.district} 
                    ${order.address.number}`}
                    />
                </ListItem>
                <Divider light />
            </Box>
        </>
    );
};

//
