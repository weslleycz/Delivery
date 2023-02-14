import { ListRestaurantsAdm } from "@/components/ListRestaurantsAdm";
import { MenuAdmin } from "@/components/MenuAdmin";
import { OrdersList } from "@/components/OrdersList";
import { ThemeProvider } from "@emotion/react";
import { Box, Grid } from "@mui/material";
import dynamic from "next/dynamic";
import Head from "next/head";
import { useState } from "react";
import { theme } from "../../../theme";

export default function Dashboard() {
    const [page, setPage] = useState("restaurants");
    const [restaurantId, setRestaurantId] = useState("restaurants");

    return (
        <>
            <Head>
                <meta name="theme-color" content={"#fb9400"} />
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
                                    <ListRestaurantsAdm />
                                </>
                            ) : page === "restaurant" ? (
                                <></>
                            ) : page === "order" ? (
                                <>
                                    <OrdersList />
                                </>
                            ) : (
                                <></>
                            )}
                           
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>
        </>
    );
}
