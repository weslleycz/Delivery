import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
    Box,
    CircularProgress,
    Container,
    Grid,
    Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { getCookie } from "cookies-next";
import { useQuery } from "react-query";
import { api } from "../../services/apí";
import { Pros } from "../CardRestaurant";
import { CardRestaurantAdm } from "../CardRestaurantAdm";
import style from "./styles.module.scss";

export const ListRestaurantsAdm = () => {
    const matches = useMediaQuery("(min-width:600px)");

    const token = getCookie("@tokenAdmin");
    
    const fetchUsers = async () => {
        const res = await api.get("/restaurant/adm/list",{
            headers:{
                Authorization:token
            }
        });
        return res.data;
    };

    const { data, status, isLoading } = useQuery("", fetchUsers);

    return (
        <>
            {matches ? (
                <Container sx={{ m:7 }}>
                    <Typography fontWeight={"bold"} variant="h6" gutterBottom>
                        Restaurantes
                    </Typography>
                    <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                {data.map((restaurant: Pros) => {
                                    return (
                                        <>
                                            <Grid
                                                alignItems={"center"}
                                                item
                                                xs={6}
                                            >
                                                {
                                                    <CardRestaurantAdm
                                                        id={restaurant.id}
                                                        name={restaurant.name}
                                                        logo={restaurant.logo}
                                                    />
                                                }
                                            </Grid>
                                        </>
                                    );
                                })}
                                <Grid
                                    textAlign={"center"}
                                    justifyContent={"center"}
                                    item
                                    xs={6}
                                >
                                    <Box className={style.container}>
                                        <AddCircleOutlineIcon
                                         sx={{
                                            fontSize:90
                                         }} />
                                    </Box>
                                </Grid>
                            </>
                        )}
                    </Grid>
                </Container>
            ) : (
                <Container sx={{ margin: 1 }}>
                    <Typography fontWeight={"bold"} variant="h6" gutterBottom>
                        Restaurantes
                    </Typography>
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            {data.map((restaurant: Pros) => {
                                return (
                                    <>
                                        <CardRestaurantAdm
                                            id={restaurant.id}
                                            name={restaurant.name}
                                            logo={restaurant.logo}
                                        />
                                    </>
                                );
                            })}
                        </>
                    )}
                </Container>
            )}
        </>
    );
};
