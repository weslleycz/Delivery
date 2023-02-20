import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import {
    Box,
    Container,
    Divider,
    Grid,
    ListItem,
    ListItemText,
    Paper,
} from "@mui/material";

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
    order: IOrder | undefined;
    setPage: (valor: string) => void;
};

export const Order = ({ order, setPage }: Props) => {
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
                            primary={order?.User.name}
                            secondary={`Pedido ${order?.id}`}
                        />
                    </ListItem>
                    <Divider light />
                    {order?.products.map((product) => {
                        return (
                            <>
                                <Grid container spacing={2}>
                                    <Grid item xs={8}>
                                        <ListItem>
                                            <ListItemText
                                                secondary={`1x ${product.name}`}
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
                </Paper>
            </Container>
        </>
    );
};
