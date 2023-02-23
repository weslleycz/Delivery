import { api } from "@/services/apí";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Box, Container } from "@mui/material";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import Chart from "react-google-charts";
import { Pros } from "../../components/CardRestaurant";

type Props = {
    setPage: any;
    restaurant: Pros | undefined;
};

type IMetrics = {
    canceled: number;
    confirmed: number;
    pending: number;
};

export const RestaurantMetrics = ({ setPage, restaurant }: Props) => {
    const [metrics, setMetrics] = useState<IMetrics>({
        canceled: 1,
        confirmed: 1,
        pending: 1,
    });

    useEffect(() => {
        (async () => {
            const token = getCookie("@tokenAdmin");
            const rest = await api.get(`/order/metrics/${restaurant?.id}`, {
                headers: {
                    Authorization: token,
                },
            });
            setMetrics({
                canceled: rest.data.canceled,
                confirmed: rest.data.confirmed,
                pending: rest.data.pending,
            });
        })();
    }, [restaurant]);

    const data = [
        ["", "Entregues", "Pendentes", "Cancelados"],
        ["Pedidos", metrics.confirmed, metrics.pending, metrics.canceled],
    ];

    return (
        <>
            <Container sx={{ m: 7 }}>
                <ChevronLeftIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => setPage("restaurants")}
                />
                <Box marginTop={4}>
                    <Chart
                        chartType="Bar"
                        width="100%"
                        height="400px"
                        data={data}
                        options={{
                            chart: {
                                title: "Pedidos",
                                subtitle:
                                    "Relações dos pedido entregue e cancelado",
                            },
                            colors: ["#80ff60", "#bd77eb", "#ff5151"],
                        }}
                    />
                </Box>
            </Container>
        </>
    );
};
