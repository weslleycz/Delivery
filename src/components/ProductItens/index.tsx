import { Grid } from "@mui/material";
import { CardProducts } from "../CardProducts";

type Products = {
    name: string;
    price: number;
    idProd: string;
    idRest: string;
    type: string;
    restaurantId: string;
    img: string;
    description:string;
};

type Props = {
    product: Products;
};

export const ProductItens = ({ product }: Props) => {
    return (
        <>
            <Grid item sx={{ marginLeft: 4, marginTop: 1,":active":{
                  outline: "none"
            },
            ":focus":{
                outline: "none"
            }
             }}>
                <CardProducts
                    key={product.idProd}
                    idProd={product.idProd}
                    name={product.name}
                    price={product.price}
                    type={product.type}
                    idRest={product.idRest}
                    img={product.img}
                    description={product.description}
                />
            </Grid>
        </>
    );
};
