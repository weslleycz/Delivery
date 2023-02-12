import React, { useEffect, useState } from "react";
import { useRouter } from "next/router";
import { api } from "@/services/apí";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { idbConfig } from "@/services/indexdb";
import setupIndexedDB, { useIndexedDBStore } from "use-indexeddb";
import { Notify, notifyError, notifySuccess  } from "../../../components/Notify";
import { getCookie } from "cookies-next";

import style from "./styles.module.scss"
import { Menu } from "../../../components/Menu";
import {ThemeProvider} from "@emotion/react";
import {createTheme, TextField} from "@mui/material";
import Button from "@mui/material/Button";
import Head from "next/head";

type Products = {
    id:string,
    name:string,
    price:number,
    description:string,
    type:string,
    discount:string,
    restaurant:string
}

type IRestaurant = {
    id: string;
    name: string;
    logo: string;
    color: string;
    cnpj: string;
    admId: string;
    addressId: string;
};


export default function Product(){

    const router = useRouter()
    const [product, setProduct] = useState<Products>()
    const [quantidade, setQuantidade] = useState(1)
    const { add } = useIndexedDBStore("products");
    const [rest, setRest] = useState<IRestaurant>({
        id: "",
        name: "",
        logo: "",
        color: "#fb9400",
        cnpj: "",
        admId:"",
        addressId:"",
    })
    const [image, setImage] = useState("")

    useEffect(()=>{
        (async ()=>{
            if(router.query.id != undefined){
                const product = await api.get(`/product/select/${router.query.id}`)
                const image = await api.get(`/product/imagems/${router.query.id}`)
                const rest = await api.get(`/restaurant/${router.query.idRest}`)
                setProduct(product.data)
                setImage(image.data)
                setRest(rest.data)
            }
        })()
        setupIndexedDB(idbConfig)
        .then(() => console.log("success"))
        .catch(e => console.error("error / unsupported", e));
    },[router.query.id])

    function saveToCart(){
        
        add({ id:product?.id , quantity: quantidade }).then(()=>{

            const cookie = getCookie("@token")
            if(cookie!=undefined){
                notifySuccess("Item adicionado ao Carrinho")
            }else{
                router.push(`/login?color=${rest.color.substring(
                    1
                )}&logo=${rest.logo}&id=${rest.id}`)
            }  
        }).catch((error)=>{
            notifyError("Erro ao adicionar item ao Carrinho")
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
                        <img src={image} alt={product?.description} width={400} height={400} className={style.image}/>
                    </Grid>
                    <Grid item xs={6} md={4} sx={{alignSelf:"center"}}>
                        <h3>{product?.name}</h3>
                        <h5>{product?.description}</h5>
                        <h3>{(product?.price/100).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</h3>
                        <TextField id="outlined-basic" label="Quantidade" variant="outlined" type={"number"} value={quantidade} onChange={(event)=>setQuantidade(event.target.value)}/>
                        <Button variant="contained" onClick={()=>{
                            saveToCart()
                        }} className={style.button}>Adicionar ao Carrinho</Button>
                    </Grid>
                </Grid>
            </Box>
                </ThemeProvider>
                <Notify />
        </>
    )
}