import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/services/apí";
import { CardProducts } from "@/components/CardProducts";
import { useQuery } from "react-query";
import styles from "./styles.module.scss"
import Pagination from "@mui/material/Pagination";
import {ThemeProvider} from "@emotion/react";
import {createTheme} from "@mui/material";
import { Menu } from "@/components/Menu";
import Head from "next/head";

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
    name:string,
    price:number,
    id: string,
    type:string
    restaurantId: string
}

export default function ListProducts(){

    const router = useRouter();
    const {id, color} = router.query;
    const [pages, setPages] = useState(1)
    const [rest, setRest] = useState<IRestaurant>({
        id: "",
        name: "",
        logo: "",
        color: "#fb9400",
        cnpj: "",
        admId:"",
        addressId:"",
    })
    
    const fetchProducts = async (page = pages) => {
        const result = await api.get(`/product/${id}?page=${page}`)
        return result.data;
    }

    const {
        isLoading,
        isError,
        error,
        data,
        isFetching,
        isPreviousData,
    } = useQuery(['products', pages], () => fetchProducts(pages), { keepPreviousData : true })
    
    useEffect(()=>{
        (async ()=>{
            if(router.query.id != undefined){
                const rest = await api.get(`/restaurant/${router.query.id}`)
                setRest(rest.data)
            }
            
        })()
        
    },[router.query])


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
            <Menu
                color={rest.color}
                name={rest.name}
                id={rest.id}
                logo={rest.logo}
            />
            <div>
                {isLoading ? (
                <div>Loading...</div>
                ) : (
                <div className={styles.container}>
                    {data.products.map((product:Products) => (
                    <CardProducts idProd={product.id} idRest={product.restaurantId} name={product.name} type={product.type} price={product.price} key={product.id}/>
                    ))}
                </div>
                )}
                
                {isFetching ? <span> Loading...</span> : null}{' '}
            </div>
            <Pagination className={styles.pagination} count={data.totalPages} page={pages} onChange={(event: React.ChangeEvent<unknown>, value: number) => {
                setPages(value);
            }}/>
        </ThemeProvider>
        </>
      )
}