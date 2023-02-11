import { MenuAdmin } from "@/components/MenuAdmin";
import { ThemeProvider } from "@emotion/react";
import { Box, Grid } from "@mui/material";
import Head from "next/head";
import { theme } from "../../../theme";

export default function Dashboard() {
    return (
        <>
            <Head>
                <meta name="theme-color" content={"#fb9400"} />
                <link rel="icon" href={"/favicon.ico"} />
                <title>Página de Login Adm</title>
            </Head>
            <ThemeProvider theme={theme}>
                <Box>
                    <Grid container spacing={2}>
                        <Grid xs={3} md={2.5}>
                            <MenuAdmin />
                        </Grid>
                        <Grid xs={6} md={8}>

                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>
        </>
    );
}
