import { Avatar, Box, Rating, Stack, Typography } from "@mui/material";
import Link from "next/link";
import style from "./styles.module.scss";

export type Pros = {
    id: string;
    name: string;
    logo: string;
};

export const CardRestaurant = ({ id, name, logo }: Pros) => {
    return (
        <>
            <Link href={`/restaurant/${id}`}>
                <Box key={id} className={style.container}>
                    <Stack direction="row" spacing={2}>
                        <Avatar sx={{ height: 100, width: 100 }} src={logo} />
                        <Box>
                            <Typography fontWeight="bold" gutterBottom>
                                {name}
                            </Typography>
                            <Rating name="read-only" value={5} readOnly />
                        </Box>
                    </Stack>
                </Box>
            </Link>
        </>
    );
};
