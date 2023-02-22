import { Box, ThemeProvider, Typography } from "@mui/material";
import { theme } from "../../theme";
import style from "./styles.module.scss";

export const Hero = () => {
    return (
        <>
            <ThemeProvider theme={theme}>
                <Box className={style.container}>
                    <Typography
                        display="block"
                        fontWeight={"bold"}
                        variant="h3"
                        gutterBottom
                    >
                        Delivery de comida
                        <br />
                        nunca foi tão fácil
                    </Typography>
                </Box>
            </ThemeProvider>
        </>
    );
};
