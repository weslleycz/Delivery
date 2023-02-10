/* eslint-disable @next/next/no-img-element */
import { Box, Button, Container, Link, Stack } from "@mui/material";
import style from "./styles.module.scss";

type IRestaurant = {
    id: string;
    logo: string;
    name: string;
    color: string;
};

export const Menu = ({ id, logo, name, color }: IRestaurant) => {
    return (
        <>
            <Box className={style.conteiner}>
                <Stack direction="row" className={style.cont}>
                    <Link href={`/restaurant/${id}`}>
                        <img src={logo} alt="Logo" width={50} height={50} />
                    </Link>
                    <Container maxWidth="xs">
                        <Stack direction="row" spacing={3}>
                            <Link href={`/restaurant/${id}`}>
                                <Button color="primary" variant="text">
                                    Início
                                </Button>
                            </Link>

                            <Link
                                href={`/restaurant/${name}?id=${id}/products`}
                            >
                                <Button color="primary" variant="text">
                                    Produtos
                                </Button>
                            </Link>

                            <Link href="/login">
                                <Button color="primary" variant="text">
                                    Contato
                                </Button>
                            </Link>
                        </Stack>
                    </Container>
                    <Stack direction="row" spacing={3}>
                        <Link
                            href={`/login?color=${color.substring(
                                1
                            )}&logo=${logo}&id=${id}`}
                        >
                            <Button color="primary" variant="text">
                                Entrar
                            </Button>
                        </Link>
                        <Link
                            href={`/signup?color=${color.substring(
                                1
                            )}&logo=${logo}&id=${id}`}
                        >
                            <Button size="small" variant="contained">
                                cadastre-se
                            </Button>
                        </Link>
                    </Stack>
                </Stack>
            </Box>
        </>
    );
};
