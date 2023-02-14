import { CardProducts } from "@/components/CardProducts";
import { Menu } from "@/components/Menu";
import { api } from "@/services/apí";
import { ThemeProvider } from "@emotion/react";
import { createTheme, Skeleton, Stack } from "@mui/material";
import Pagination from "@mui/material/Pagination";
import Head from "next/head";
import { useRouter } from "next/router";
import React, { useEffect, useState } from "react";
import { useQuery } from "react-query";
import styles from "./styles.module.scss";

type IRestaurant = {
    id: string;
    name: string;
    logo: string;
    color: string;
    cnpj: string;
    admId: string;
    addressId: string;
};

type Products = {
    name: string;
    price: number;
    id: string;
    type: string;
    restaurantId: string;
};

export default function ListProducts() {
    const router = useRouter();
    const { id } = router.query;
    const [pages, setPages] = useState(1);
    const [rest, setRest] = useState<IRestaurant>({
        id: "",
        name: "",
        logo: "",
        color: "#fb9400",
        cnpj: "",
        admId: "",
        addressId: "",
    });

    const fetchProducts = async (page = pages) => {
        const result = await api.get(`/product/${id}?page=${page}`);
        return result.data;
    };

    const { isLoading, isError, error, data, isFetching, isPreviousData } =
        useQuery(["products", pages], () => fetchProducts(pages), {
            keepPreviousData: true,
        });

    useEffect(() => {
        (async () => {
            if (router.query.id != undefined) {
                const rest = await api.get(`/restaurant/${router.query.id}`);
                setRest(rest.data);
            }
        })();
    }, [router.query]);

    return (
        <>
            <Head>
                <meta name="theme-color" content={rest.color} />
                <link rel="icon" href={rest.logo} />
                <title>Produtos do Restaurante</title>
            </Head>
            <ThemeProvider
                theme={createTheme({
                    palette: {
                        primary: {
                            main: rest.color,
                            contrastText: "#FFFFFF",
                        },
                    },
                })}
            >
                <Menu
                    color={rest.color}
                    name={rest.name}
                    id={rest.id}
                    logo={rest.logo}
                />
                <div>
                    {isLoading ? (
                        <div className={styles.container}>
                            <Stack spacing={1}>
                                {/* For variant="text", adjust the height via font-size */}
                                <Skeleton
                                    variant="text"
                                    sx={{ fontSize: "1rem" }}
                                />

                                {/* For other variants, adjust the size with `width` and `height` */}
                                <Skeleton
                                    variant="rectangular"
                                    width={130}
                                    height={60}
                                />
                                <Skeleton
                                    variant="rounded"
                                    width={130}
                                    height={60}
                                />
                            </Stack>
                        </div>
                    ) : (
                        <div className={styles.container}>
                            {data.products.map((product: Products) => (
                                <CardProducts
                                    idProd={product.id}
                                    idRest={product.restaurantId}
                                    name={product.name}
                                    type={product.type}
                                    price={product.price}
                                    key={product.id}
                                />
                            ))}
                        </div>
                    )}
                </div>
                <Pagination
                    className={styles.pagination}
                    count={1}
                    page={pages}
                    onChange={(
                        event: React.ChangeEvent<unknown>,
                        value: number
                    ) => {
                        setPages(value);
                    }}
                />
            </ThemeProvider>
        </>
    );
}
