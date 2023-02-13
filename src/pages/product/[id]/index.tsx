import { api } from "@/services/apí";
import { idbConfig } from "@/services/indexdb";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { getCookie } from "cookies-next";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import setupIndexedDB, { useIndexedDBStore } from "use-indexeddb";
import { Notify, notifyError, notifySuccess } from "../../../components/Notify";

import { prismaClient } from "@/services/prismaClient";
import { ThemeProvider } from "@emotion/react";
import { createTheme, TextField } from "@mui/material";
import Button from "@mui/material/Button";
import Head from "next/head";
import { Menu } from "../../../components/Menu";
import style from "./styles.module.scss";
import { stripe } from "../../../services/stripe";

type Products = {
    id: string;
    name: string;
    price: number;
    description: string;
    type: string;
    discount: string;
    restaurant: string;
};

type IRestaurant = {
    id: string;
    name: string;
    logo: string;
    color: string;
    cnpj: string;
    admId: string;
    addressId: string;
};

export async function getStaticPaths() {
    return {
        paths: [{ params: { id: "1" } }, { params: { id: "2" } }],
        fallback: true,
    };
}

type StaticParams = {
    params: {
        id: string;
    };
};

export async function getStaticProps({ params }: StaticParams) {
    const product = await prismaClient.product.findFirst({
        where: {
            id: params.id,
        },
    });

    const image = await stripe.products.list({
        ids: [params.id],
    });

    

    return {
        props: { product,image:image.data[0].images[0] },
        // Re-generate the post at most once per second
        // if a request comes in
        revalidate: 600,
    };
}

type IProps = {
    product: Products;
    image:string;
};

export default function Product({ product,image }: IProps) {
    const router = useRouter();
    // const [product, setProduct] = useState<Products>();
    const [quantidade, setQuantidade] = useState(1);
    const { add } = useIndexedDBStore("products");
    const [rest, setRest] = useState<IRestaurant>({
        id: "",
        name: "",
        logo: "",
        color: "#fb9400",
        cnpj: "",
        admId: "",
        addressId: "",
    });
    // const [image, setImage] = useState("");

    useEffect(() => {
        (async () => {
            if (router.query.id != undefined) {
                // const product = await api.get(
                //     `/product/select/${router.query.id}`
                // );
                // const image = await api.get(
                //     `/product/imagems/${router.query.id}`
                // );
                const rest = await api.get(
                    `/restaurant/${router.query.idRest}`
                );
                // setProduct(product.data);
                // setImage(image.data);
                setRest(rest.data);
            }
        })();
        setupIndexedDB(idbConfig)
            .then(() => console.log("success"))
            .catch((e) => console.error("error / unsupported", e));
    }, [router.query.id]);

    function saveToCart() {
        add({ id: product?.id, quantity: quantidade })
            .then(() => {
                const cookie = getCookie("@token");
                if (cookie != undefined) {
                    notifySuccess("Item adicionado ao Carrinho");
                } else {
                    router.push(
                        `/login?color=${rest.color.substring(1)}&logo=${
                            rest.logo
                        }&id=${rest.id}`
                    );
                }
            })
            .catch((error) => {
                notifyError("Erro ao adicionar item ao Carrinho");
            });
    }

    return (
        <>
            <Head>
                <meta name="theme-color" content={rest.color} />
                <link rel="icon" href={rest.logo} />
                <title>{product?.name}</title>
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

                <Box className={style.container}>
                    <Grid container spacing={2} className={style.containerGrid}>
                        <Grid item xs={6} md={4}>
                            <Box sx={{padding:17}}>
                            <img
                                src={image}
                                alt={product?.description}
                                width={400}
                                height={400}
                                className={style.image}
                            />
                            </Box>
                        </Grid>
                        <Grid item xs={9} md={6} sx={{ alignSelf: "center" }}>
                            <Box sx={{padding:20}}>
                                <h3>{product?.name}</h3>
                                <h5>{product?.description}</h5>
                                <h3>
                                    {(
                                        (product?.price as number) / 100
                                    ).toLocaleString("pt-br", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </h3>
                                <TextField
                                    id="outlined-basic"
                                    label="Quantidade"
                                    variant="outlined"
                                    type={"number"}
                                    value={quantidade}
                                    onChange={(event) =>
                                        setQuantidade(
                                            event.target
                                                .value as unknown as number
                                        )
                                    }
                                />
                                <Button
                                    variant="contained"
                                    onClick={() => {
                                        saveToCart();
                                    }}
                                    className={style.button}
                                >
                                    Adicionar ao Carrinho
                                </Button>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
            </ThemeProvider>
            <Notify />
        </>
    );
}
