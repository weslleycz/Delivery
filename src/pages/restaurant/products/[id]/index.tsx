import { Menu } from "@/components/Menu";
import { ProductItens } from "@/components/ProductItens";
import { api } from "@/services/apí";
import { ThemeProvider } from "@emotion/react";
import { createTheme, Grid } from "@mui/material";
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
    img: string;
};

export async function getServerSideProps({}) {
    return {
        props: {},
    };
}

export default function ListProducts() {
    const router = useRouter();
    const { id } = router.query;
    const [pages, setPages] = useState(1);
    const [totalPags, setTotalPags] = useState(1);
    const [axiosIsLoading, setAxiosIsLoading] = useState(true);

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
        setPages(result.data.page);
        setTotalPags(result.data.totalPages);
        return result.data.products as Products[];
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
                setAxiosIsLoading(false);
            }
        })();
    }, [router.query]);
    return (
        <>
            <Head>
                <meta name="theme-color" content={rest.color} />
                <link rel="icon" href={rest.logo} />
                <title>Produtos</title>
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
                {axiosIsLoading ? (
                    <></>
                ) : (
                    <>
                        <Menu
                            color={rest.color}
                            name={rest.name}
                            id={rest.id}
                            logo={rest.logo}
                        />
                        <Grid
                            container
                            spacing={0.2}
                            sx={{ marginBottom: 5, marginTop: 5 }}
                        >
                            {data?.map((product) => {
                                return (
                                    <>
                                        <ProductItens
                                            product={{
                                                idProd: product.id,
                                                idRest: router.query
                                                    .id as string,
                                                name: product.name,
                                                price: product.price,
                                                type: product.type,
                                                img: product.img,
                                                restaurantId: router.query
                                                    .id as string,
                                            }}
                                        />
                                    </>
                                );
                            })}
                        </Grid>
                        <Pagination
                            className={styles.pagination}
                            count={totalPags}
                            page={pages}
                            onChange={(
                                event: React.ChangeEvent<unknown>,
                                value: number
                            ) => {
                                setPages(value);
                            }}
                        />
                    </>
                )}
            </ThemeProvider>
        </>
    );
}
