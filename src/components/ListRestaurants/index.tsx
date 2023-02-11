import { CircularProgress, Container, Grid, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useQuery } from "react-query";
import { api } from "../../services/apí";
import { CardRestaurant, Pros } from "../CardRestaurant";

export const ListRestaurants = () => {
    const matches = useMediaQuery("(min-width:600px)");

    const fetchUsers = async () => {
        const res = await api.get("/restaurant");
        return res.data;
    };

    const { data, status, isLoading } = useQuery("", fetchUsers);

    return (
        <>
            {matches ? (
                <Container sx={{ marginBottom: 8, marginTop: 8 }} maxWidth="md">
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
                                            <Grid item xs={6}>
                                                {
                                                    <CardRestaurant
                                                        id={restaurant.id}
                                                        name={restaurant.name}
                                                        logo={restaurant.logo}
                                                    />
                                                }
                                            </Grid>
                                        </>
                                    );
                                })}
                            </>
                        )}
                    </Grid>
                </Container>
            ) : (
                <Container sx={{ margin: 1 }} maxWidth="sm">
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
                                        <CardRestaurant
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
