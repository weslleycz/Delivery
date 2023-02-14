import { api } from "@/services/apí";
import DeleteIcon from "@mui/icons-material/Delete";
import SendIcon from "@mui/icons-material/Send";
import { Box, Button, Chip, ListItemText, Stack } from "@mui/material";
import { getCookie } from "cookies-next";
import { LatLngExpression } from "leaflet";
import React from "react";
import { Notify, notifyError, notifySuccess } from "../Notify";

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
    order: IOrder;
    refetch: any;
};

export const OrderIten = ({ setPage, order, setPosition, refetch }: Props) => {
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
                    // cursor: "pointer",
                }}
            >
                <Stack direction="row" spacing={1}>
                    <Chip
                        onClick={() => {
                            setPage("orderIten");
                            setPosition([
                                Number(order.latitude),
                                Number(order.longitude),
                            ]);
                        }}
                        label={"Endereço"}
                        color="info"
                    />
                    <Chip
                        label={
                            order.payment === "Money" ? "Dinheiro" : "Cartão"
                        }
                        color="secondary"
                    />
                </Stack>

                <Notify />
                <ListItemText
                    sx={{ fontWeight: "bold",fontSize:60 }}
                    primary={(order.total / 100).toLocaleString("pt-br", {
                        style: "currency",
                        currency: "BRL",
                    })}
                    
                    secondary={
                        <React.Fragment>
                            {
                                <ul>
                                    {order.products.map((product) => (
                                        <li key={product.id + product.id}>
                                            1- {product.name}
                                        </li>
                                    ))}
                                </ul>
                            }
                        </React.Fragment>
                    }
                />
                <Stack
                    sx={{
                        marginTop: 2,
                    }}
                    direction="row"
                    spacing={2}
                >
                    <Button
                        variant="contained"
                        color="success"
                        onClick={()=>handleConfirme()}
                        endIcon={<SendIcon />}
                    >
                        Confirmar entrega
                    </Button>
                    <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleCancel()}
                        startIcon={<DeleteIcon />}
                    >
                        Cancelar pedido
                    </Button>
                </Stack>
            </Box>
        </>
    );
};

//
