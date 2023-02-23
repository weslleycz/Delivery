/* eslint-disable @next/next/no-img-element */
import { useCart } from "@africasokoni/react-use-cart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import {
    Box,
    Button,
    Container,
    Link,
    Stack,
    useMediaQuery,
} from "@mui/material";
import Badge from "@mui/material/Badge";
import { getCookie } from "cookies-next";
import { useEffect, useState } from "react";
import style from "./styles.module.scss";

type IRestaurant = {
    id: string;
    logo: string;
    name: string;
    color: string;
};

export const Menu = ({ id, logo, name, color }: IRestaurant) => {
    const [token, setToken] = useState<string | undefined>(undefined);
    const [valor, setValor] = useState(0);

    const { isEmpty, totalUniqueItems, items, updateItemQuantity, removeItem } =
        useCart();

    useEffect(() => {
        let tokenGet = getCookie("@token");
        setToken(tokenGet as string);
    }, []);

    const matches = useMediaQuery("(min-width:600px)");

    return matches ? (
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
                    <Stack direction="row" spacing={3}>
                        {token != undefined ? (
                            <>
                                <Badge
                                    sx={{ right: 40 }}
                                    badgeContent={totalUniqueItems}
                                    color="primary"
                                >
                                    <ShoppingCartIcon color="action" />
                                </Badge>
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
    ) : (
        <>
            {" "}
            <Box p={5} width={800} className={style.conteiner}>
                <Stack direction="row" className={style.cont}>
                    <Link href={`/restaurant/${id}`}>
                        <img src={logo} alt="Logo" width={70} height={70} />
                    </Link>
                    <Container maxWidth="xs">
                        <Stack direction="row" spacing={3}>
                            <Link href={`/restaurant/${id}`}>
                                <Button
                                    size="large"
                                    color="primary"
                                    variant="text"
                                >
                                    Início
                                </Button>
                            </Link>

                            <Link
                                href={`/restaurant/${name}?id=${id}/products`}
                            >
                                <Button
                                    size="large"
                                    color="primary"
                                    variant="text"
                                >
                                    Produtos
                                </Button>
                            </Link>
                        </Stack>
                    </Container>
                    <Stack direction="row" spacing={3}>
                        {token != undefined ? (
                            <>
                                <Badge
                                    sx={{ right: 40 }}
                                    badgeContent={valor}
                                    color="primary"
                                >
                                    <ShoppingCartIcon
                                        width={150}
                                        color="action"
                                    />
                                </Badge>
                            </>
                        ) : (
                            <>
                                <Link
                                    href={`/restaurant/login?color=${color.substring(
                                        1
                                    )}&logo=${logo}&id=${id}`}
                                >
                                    <Button
                                        color="primary"
                                        size="medium"
                                        variant="text"
                                    >
                                        Entrar
                                    </Button>
                                </Link>
                                <Link
                                    href={`/restaurant/signup?color=${color.substring(
                                        1
                                    )}&logo=${logo}&id=${id}`}
                                >
                                    <Button size="large" variant="contained">
                                        cadastre-se
                                    </Button>
                                </Link>
                            </>
                        )}
                    </Stack>
                </Stack>
            </Box>
        </>
    );
};
