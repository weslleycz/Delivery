import { ListRestaurantsAdm } from "@/components/ListRestaurantsAdm";
import { MenuAdmin } from "@/components/MenuAdmin";
import { OrdersList } from "@/components/OrdersList";
import { RestaurantDashboard } from "@/components/RestaurantDashboard";
import { ThemeProvider } from "@emotion/react";
import { Box, Grid } from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import { Pros } from "../../../components/CardRestaurant";
import { theme } from "../../../theme";

export default function Dashboard() {
    const [page, setPage] = useState("restaurants");
    const [restaurant, setRestaurant] = useState<Pros>();

    return (
        <>
            <Head>
                <meta name="theme-color" content={"#a200ff"} />
                <link rel="icon" href={"/favicon.ico"} />
                <title>Dashboard</title>
            </Head>
            <ThemeProvider theme={theme}>
                <Box>
                    <Grid container spacing={2}>
                        <Grid xs={3} md={2.5}>
                            <MenuAdmin setPage={setPage} />
                        </Grid>
                        <Grid xs={6} md={8}>
                            {page === "restaurants" ? (
                                <>
                                    <ListRestaurantsAdm
                                        setRestaurant={setRestaurant}
                                        setPage={setPage}
                                    />
                                </>
                            ) : page === "restaurant" ? (
                                <></>
                            ) : page === "order" ? (
                                <>
                                    <OrdersList />
                                </>
                            ) : (
                                <>
                                    <RestaurantDashboard
                                        restaurant={restaurant}
                                        setPage={setPage}
                                    />
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>
        </>
    );
}
