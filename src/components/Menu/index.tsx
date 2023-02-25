/* eslint-disable @next/next/no-img-element */
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, Button, Container, Link, Stack } from "@mui/material";
import { getCookie, removeCookies } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Cart } from "../Cart";
import style from "./styles.module.scss";

type IRestaurant = {
    id: string;
    logo: string;
    name: string;
    color: string;
};

export const Menu = ({ id, logo, name, color }: IRestaurant) => {
    const [token, setToken] = useState<string | undefined>(undefined);
    const router = useRouter();

    useEffect(() => {
        let tokenGet = getCookie("@token");
        setToken(tokenGet as string);
    }, []);

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
                                href={`/restaurant/products/${id}?color=${color}`}
                            >
                                <Button color="primary" variant="text">
                                    Produtos
                                </Button>
                            </Link>
                        </Stack>
                    </Container>
                    <Stack sx={{ padding: 3 }} direction="row" spacing={2}>
                        {token != undefined ? (
                            <>
                                <Stack direction="row" spacing={2}>
                                    <Button
                                        color="primary"
                                        onClick={() => {
                                            removeCookies("@token");
                                            router.push(
                                                `/restaurant/login?color=${color.substring(
                                                    1
                                                )}&logo=${logo}&id=${id}`
                                            );
                                        }}
                                        variant="text"
                                    >
                                        <LogoutIcon color="primary" />
                                    </Button>
                                    <Cart />
                                </Stack>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={`/restaurant/login?color=${color.substring(
                                        1
                                    )}&logo=${logo}&id=${id}`}
                                >
                                    <Button color="primary" variant="text">
                                        Entrar
                                    </Button>
                                </Link>
                                <Link
                                    href={`/restaurant/signup?color=${color.substring(
                                        1
                                    )}&logo=${logo}&id=${id}`}
                                >
                                    <Button size="small" variant="contained">
                                        cadastre-se
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Stack>
                    <Box></Box>
                </Stack>
            </Box>
        </>
    );
};
