import { Box, Grid, ThemeProvider, Typography } from "@mui/material";
import { theme } from "../../theme";
import { Motoboy } from "../Motoboy";
import style from "./styles.module.scss";

type Props = {
    color: string;
};

export const Hero = ({ color }: Props) => {
    return (
        <>
            <ThemeProvider theme={theme}>
                <Box sx={{ flexGrow: 1 }} className={style.container}>
                    <Grid container spacing={2}>
                        <Grid
                            spacing={0}
                            direction="column"
                            alignItems="center"
                            justifyContent="center"
                            item
                            xs={5}
                            md={7}
                        >
                            <Typography
                                marginTop={18}
                                display="block"
                                fontWeight={"bold"}
                                variant="h3"
                                gutterBottom
                            >
                                <strong style={{ color: color }}>
                                    {"Delivery "}
                                </strong>
                                de comida
                                <br />
                                nunca foi tão fácil
                            </Typography>
                            <Box>
                                <center>
                                    <Typography
                                        color={"GrayText"}
                                        width={"57%"}
                                        variant="subtitle1"
                                        gutterBottom
                                    >
                                        Lorem ipsum dolor sit amet consectetur adipisicing elit. 
                                        Ex obcaecati incidunt pariatur corrupti.Lorem
                                    </Typography>
                                </center>
                            </Box>
                        </Grid>
                        <Grid item xs={4} md={1}>
                            <Motoboy color={color} />
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>
        </>
    );
};
