import { ListRestaurantsAdm } from "@/components/ListRestaurantsAdm";
import { MenuAdmin } from "@/components/MenuAdmin";
import { OrdersList } from "@/components/OrdersList";
import { ProductAdm } from "@/components/ProductAdm";
import { ThemeProvider } from "@emotion/react";
import { Box, Grid } from "@mui/material";
import Head from "next/head";
import { useState } from "react";
import { theme } from "../../../theme";

export default function Dashboard() {
    const [page, setPage] = useState("restaurants");
    const [restaurantId, setRestaurantId] = useState<string>();
    
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
                                    <ListRestaurantsAdm  setPage={setPage} />
                                </>
                            ) : page === "restaurant" ? (
                                <></>
                            ) : page === "order" ? (
                                <>
                                    <OrdersList />
                                </>
                            ) : (
                                <>
                                <ProductAdm setPage={setPage}/>
                                </>
                            )}
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>
        </>
    );
}
