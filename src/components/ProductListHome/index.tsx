import { Grid } from "@mui/material";
import { useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../services/apí";
import { CardProducts } from "../CardProducts";

type Props = {
    idRest: string;
};

type Products = {
    id: string;
    name: string;
    price: number;
    description: string;
    type: string;
    discount: string;
    restaurant: string;
    img: string;
};

export const ProductListHome = ({ idRest }: Props) => {
    const [pages, setPages] = useState(1);

    const fetchProducts = (page = pages) =>
        api.get(`/product/${idRest}/?page=${pages}`).then((res) => res.data);

    const { isLoading, isError, error, data, isFetching, isPreviousData } =
        useQuery({
            queryKey: ["products", pages],
            queryFn: () => fetchProducts(pages),
            keepPreviousData: true,
        });

    return (
        <>
            <div>
                {isLoading ? (
                    <div>Loading...</div>
                ) : (
                    <Grid container spacing={0.2} sx={{ marginBottom: 5 }}>
                        {data.products.map((product: Products) => (
                            // eslint-disable-next-line react/jsx-key
                            <Grid item sx={{ marginLeft: 5, marginTop: 2 }}>
                                <CardProducts
                                    key={product.id}
                                    idProd={product.id}
                                    name={product.name}
                                    price={product.price}
                                    type={product.type}
                                    idRest={idRest}
                                    img={product.img}
                                />
                            </Grid>
                        ))}
                    </Grid>
                )}
            </div>
        </>
    );
};
