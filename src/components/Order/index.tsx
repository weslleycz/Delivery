import { api } from "@/services/apí";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
    Box,
    Button,
    Container,
    Divider,
    Grid,
    ListItem,
    ListItemText,
    Paper,
    Stack,
} from "@mui/material";
import { getCookie } from "cookies-next";
import { useQuery } from "react-query";
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
    products: products;
};

type products = [
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
        quantity: number;
    }
];

type Props = {
    order: IOrder | undefined;
    setPage: (valor: string) => void;
    setPosition: any;
    refetch: any;
};

export const Order = ({ order, setPage, setPosition, refetch }: Props) => {
    const token = getCookie("@tokenAdmin");

    const { isLoading, isError, data, error } = useQuery(
        "products",
        async () => {
            const list = await api.get(`/order/card/${order?.id}`, {
                headers: {
                    Authorization: token,
                },
            });
            return list.data as products;
        }
    );

    const handleCancel = async (order: IOrder | undefined) => {
        try {
            await api.delete(`/order/restaurant/${order?.id}`, {
                headers: {
                    Authorization: token,
                },
            });
            notifySuccess("Pedido cancelado com sucesso");
            refetch();
            setPage("order");
        } catch (error) {
            notifyError("Ocorreu um erro inesperado");
        }
    };

    const handleConfirme = async (order: IOrder | undefined) => {
        try {
            notifySuccess("Pedido entregue");
            await api.get(`/order/send/${order?.id}`, {
                headers: {
                    authorization: token,
                },
            });
            refetch();
            setPage("order");
        } catch (error) {
            console.log(error);
            notifyError("Ocorreu um erro inesperado");
        }
    };

    return (
        <>
            <Container sx={{ m: 7 }}>
                <ChevronLeftIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => setPage("order")}
                />
                <Paper style={{ maxHeight: 400, overflow: "auto" }}>
                    <ListItem>
                        <ListItemText
                            primary={`👨🏻‍🦱 ${order?.User.name}`}
                            secondary={`Pedido ${order?.id}`}
                        />
                    </ListItem>
                    <Divider light />
                    <ListItem
                        onClick={() => {
                            setPosition([
                                Number(order?.address.latitude),
                                Number(order?.address.longitude),
                            ]);
                            setPage("Map");
                        }}
                        sx={{ cursor: "pointer" }}
                    >
                        <ListItemText
                            primary={"📌 Endereço"}
                            secondary={`${order?.address.city}, 
                            ${order?.address.street},
                            nº ${order?.address.number}.
                            `}
                        />
                    </ListItem>
                    <Divider light />
                    {data?.map((product) => {
                        return (
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <ListItem>
                                            <ListItemText
                                                secondary={`${product.quantity}x ${product.name}`}
                                            />
                                        </ListItem>
                                    </Grid>
                                    <Grid item xs={4}>
                                        <Box marginLeft={22}>
                                            <strong>
                                                {(
                                                    (product?.price as number) /
                                                    100
                                                ).toLocaleString("pt-br", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </strong>
                                        </Box>
                                    </Grid>
                                </Grid>
                            </>
                        );
                    })}
                    <Divider light />
                    <ListItem>
                        <Grid container spacing={2}>
                            <Grid item xs={8}>
                                <b
                                    style={{
                                        fontWeight: "bold",
                                        color: "#7ff352",
                                    }}
                                >
                                    Total
                                </b>
                            </Grid>
                            <Grid item xs={4}>
                                <Box marginLeft={22}>
                                    <b
                                        style={{
                                            fontWeight: "bold",
                                            color: "#7ff352",
                                        }}
                                    >
                                        {(
                                            (order?.total as number) / 100
                                        ).toLocaleString("pt-br", {
                                            style: "currency",
                                            currency: "BRL",
                                        })}
                                    </b>
                                </Box>
                            </Grid>
                        </Grid>
                    </ListItem>
                    <Divider light />
                    <ListItem sx={{ padding: 5 }}>
                        <Box>
                            <Stack spacing={2} direction="row">
                                <Button
                                    onClick={() => handleConfirme(order)}
                                    color="success"
                                    variant="contained"
                                >
                                    Confirmar entrega{" "}
                                </Button>
                                <Button
                                    onClick={() => handleCancel(order)}
                                    color="error"
                                    variant="contained"
                                >
                                    Cancelar pedido
                                </Button>
                            </Stack>
                        </Box>
                    </ListItem>
                </Paper>
                <Notify />
            </Container>
        </>
    );
};
