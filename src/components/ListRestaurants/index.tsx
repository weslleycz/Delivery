import { Container, Grid, Typography } from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import { CardRestaurant, Pros } from "../CardRestaurant";

type IRestaurant = {
    restaurants: Pros[];
};

export const ListRestaurants = ({ restaurants }: IRestaurant) => {
    const matches = useMediaQuery("(min-width:600px)");
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
                        {restaurants?.map((restaurant) => {
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
                    </Grid>
                </Container>
            ) : (
                <Container sx={{ margin: 1 }} maxWidth="sm">
                      <Typography fontWeight={"bold"} variant="h6" gutterBottom>
                        Restaurantes
                    </Typography>
                    {restaurants.map((restaurant) => {
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
                </Container>
            )}
        </>
    );
};
