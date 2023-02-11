import { Box, Grid, Typography } from "@mui/material";
import Image from "next/image";
import hambuger from "../../../public/hambuger.svg";

type Pros = {
    color: string;
};

export const HeroRestaurant = ({ color }: Pros) => {
    return (
        <>
            <Box padding={4}>
                <Grid
                    container
                    rowSpacing={1}
                    columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                >
                    <Grid
                        textAlign={"center"}
                        alignItems={"center"}
                        display="block"
                        xs={7}
                    >
                        <Box p={13}>
                        <Typography
                            sx={{ fontWeight: "bold" }}
                            variant="h3"
                            gutterBottom
                        >
                            <b style={{ color: color }}>Entrega</b> Mais{" "}
                            <b style={{ color: color }}>Rápida</b> da Cidade
                        </Typography>
                        </Box>
                    </Grid>
                    <Grid xs={5}>
                        <Image
                            src={hambuger}
                            alt="Picture of the author"
                            width={500}
                            height={500}
                        />
                    </Grid>
                </Grid>
            </Box>
        </>
    );
};
