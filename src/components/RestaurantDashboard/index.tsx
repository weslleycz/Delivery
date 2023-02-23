import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import EqualizerIcon from "@mui/icons-material/Equalizer";
import HouseIcon from "@mui/icons-material/House";
import Inventory2Icon from "@mui/icons-material/Inventory2";
import { Box, Button, Container, Paper } from "@mui/material";
import { Pros } from "../../components/CardRestaurant";

type Props = {
    setPage: any;
    restaurant: Pros | undefined;
};

export const RestaurantDashboard = ({ setPage, restaurant }: Props) => {
    return (
        <>
            <Container sx={{ m: 7 }}>
                <ChevronLeftIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => setPage("restaurants")}
                />
                <Box
                    sx={{
                        display: "flex",
                        flexWrap: "wrap",
                        marginTop: 0.9,
                        "& > :not(style)": {
                            m: 1,
                            width: 180,
                            height: 180,
                        },
                    }}
                >
                    <Paper elevation={3}>
                        <Button
                            href={`/restaurant/${restaurant?.id}`}
                            fullWidth
                            sx={{ height: 180 }}
                            variant="contained"
                        >
                            <Box alignItems={"center"} textAlign={"center"}>
                                <HouseIcon
                                    sx={{ fontSize: 100, color: "white" }}
                                />
                                Página
                            </Box>
                        </Button>
                    </Paper>
                    <Paper onClick={() => setPage("Metrics")} elevation={3}>
                        <Button
                            fullWidth
                            sx={{ height: 180 }}
                            variant="contained"
                        >
                            <Box alignItems={"center"} textAlign={"center"}>
                                <EqualizerIcon
                                    sx={{ fontSize: 100, color: "white" }}
                                />
                                <strong>Métricas</strong>
                            </Box>
                        </Button>
                    </Paper>

                    <Paper onClick={() => setPage("Products")} elevation={3}>
                        <Button
                            fullWidth
                            sx={{ height: 180 }}
                            variant="contained"
                        >
                            <Box alignItems={"center"} textAlign={"center"}>
                                <Inventory2Icon
                                    sx={{ fontSize: 100, color: "white" }}
                                />
                                <strong>Produtos</strong>
                            </Box>
                        </Button>
                    </Paper>
                </Box>
            </Container>
        </>
    );
};
