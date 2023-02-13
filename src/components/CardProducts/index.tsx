import { api } from "@/services/apí";
import { Skeleton, Stack } from "@mui/material";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import { useState } from "react";
import { useQuery } from "react-query";
import style from "./styles.module.scss";

type Products = {
    name: string;
    price: number;
    idProd: string;
    type: string;
    idRest: string;
};

export function CardProducts({ idProd, name, price, type, idRest }: Products) {
    const fetchImage = async () => {
        const result = await api.get(`/product/imagems/${idProd}`);
        return result.data;
    };

    const { isLoading, isError, data, error } = useQuery("movies", fetchImage);


    return (
        <Link href={`/product/${idProd}?idRest=${idRest}`}>
            <Box className={style.containerCard}>
                {isLoading ? (
                    <>
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
                    </>
                ) : (
                    <>
                        <img
                            src={data}
                            alt=""
                            width={130}
                            height={130}
                            className={style.image}
                        />
                        <h4>{name}</h4>
                        <p>{type}</p>
                        <h5>
                            {(price / 100).toLocaleString("pt-br", {
                                style: "currency",
                                currency: "BRL",
                            })}
                        </h5>
                    </>
                )}
            </Box>
        </Link>
    );
}
