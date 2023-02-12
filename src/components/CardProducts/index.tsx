import React, { useEffect, useState } from "react";
import { api } from "@/services/apí";
import Box from "@mui/material/Box";

import style from "./styles.module.scss";


type Products = {
    name:string,
    price:number,
    idProd: string,
    type:string
}


export function CardProducts({idProd, name, price, type}:Products){

    const [image,setImage] = useState("")

    useEffect(()=>{
        (async()=>{
            const result = await api.get(`/product/imagems/${idProd}`)
            setImage(result.data)
        })()
    },[])

    return (
        <Box className={style.containerCard}>
            <img src={image} alt="" width={130} height={130} className={style.image}/>
            <h4>{name}</h4>
            <p>{type}</p>
            <h5>{(price/100).toLocaleString('pt-br',{style: 'currency', currency: 'BRL'})}</h5>
        </Box>
            
    )
}