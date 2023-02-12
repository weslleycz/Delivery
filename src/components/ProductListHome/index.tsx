import { Grid } from "@mui/material";
import {useEffect, useState} from "react"
import {useQuery} from "react-query"
import { CardProducts } from "../CardProducts";
import { api } from "../../services/apí"

type Props = {
    idRest:string
}

type Products = {
    id:string,
    name:string,
    price:number,
    description:string,
    type:string,
    discount:string,
    restaurant:string
}

export const ProductListHome = ({idRest}:Props) => {

    const [pages, setPages] = useState(1);


    const fetchProducts = (page = pages) => api.get(`/product/${idRest}/?page=${pages}`).then((res) => res.data)

    const {
        isLoading,
        isError,
        error,
        data,
        isFetching,
        isPreviousData,
      } = useQuery({
        queryKey: ['products', pages],
        queryFn: () => fetchProducts(pages),
        keepPreviousData : true
      })


    return (
        <>
            <div>
            {isLoading ? (
                <div>Loading...</div>
            ) : (
                <Grid container rowSpacing={1} columnSpacing={{ xs: 1, sm: 2, md: 3 }} sx={{marginBottom:5}}>   
                {data.products.map((product:Products) => (
                     <Grid item xs={1} sx={{marginLeft: 10}}>
                        <CardProducts key={product.id} idProd={product.id} name={product.name} price={product.price} type={product.type} idRest={idRest}/>
                    </Grid>
                ))}
                </Grid>
            )}
            </div>
        </>
    );
};
