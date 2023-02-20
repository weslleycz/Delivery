import { Container, List, Paper, Typography } from "@mui/material";
import { getCookie } from "cookies-next";
import { LatLngExpression } from "leaflet";
import dynamic from "next/dynamic";
import { useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../services/apí";
import { Order } from "../Order";
import { OrderIten } from "../OrderIten";

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

export const OrdersList = () => {
    const MapWithNoSSR = dynamic(() => import("../Map"), {
        ssr: false,
    });
    const [position, setPosition] = useState<LatLngExpression>([
        -6.8923694, -38.5592505,
    ]);

    const [order, setOrder] = useState<IOrder>();

    const token = getCookie("@tokenAdmin");

    const { isLoading, data, refetch } = useQuery(
        "orders",
        async () => {
            const { data } = await api.get("/order/adm", {
                headers: {
                    authorization: token,
                },
            });

            return data as IOrder[];
        },
        {
            refetchInterval: 6000,
        }
    );

    const [page, setPage] = useState("order");

    return (
        <>
            {page === "order" ? (
                <Container sx={{ m: 7 }}>
                    <Typography fontWeight={"bold"} variant="h6" gutterBottom>
                        Pedidos
                    </Typography>
                    <Paper style={{ maxHeight: 400, overflow: "auto" }}>
                        <List>
                            <div>
                                {isLoading ? (
                                    ""
                                ) : (
                                    <>
                                        {data?.map((order) => (
                                            <OrderIten
                                                setOrder={setOrder}
                                                refetch={refetch}
                                                setPosition={setPosition}
                                                key={order.id}
                                                order={order}
                                                setPage={setPage}
                                            />
                                        ))}
                                    </>
                                )}
                            </div>
                        </List>
                    </Paper>
                </Container>
            ) : (
                // <MapWithNoSSR setPage={setPage} position={position} />
                <>
                    <List>
                        <Order setPage={setPage} order={order} />
                    </List>
                </>
            )}
        </>
    );
};
