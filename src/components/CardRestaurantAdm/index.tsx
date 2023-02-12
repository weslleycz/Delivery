import { Avatar, Box, Stack, Typography } from "@mui/material";
import style from "./styles.module.scss";

export type Pros = {
    id: string;
    name: string;
    logo: string;
};

export const CardRestaurantAdm = ({ id, name, logo }: Pros) => {
    return (
        <>
            <Box className={style.container}>
                <Stack direction="row" spacing={2}>
                    <Avatar sx={{ height: 100, width: 100 }} src={logo} />
                    <Box>
                        <Typography fontWeight="bold" gutterBottom>
                            {name}
                        </Typography>
                    </Box>
                </Stack>
            </Box>
        </>
    );
};
