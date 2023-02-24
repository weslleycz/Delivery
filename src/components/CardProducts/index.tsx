import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import style from "./styles.module.scss";

type Products = {
    name: string;
    price: number;
    idProd: string;
    type: string;
    idRest: string;
    img: string;
};

export function CardProducts({
    idProd,
    name,
    price,
    type,
    idRest,
    img,
}: Products) {
    return (
        <Link href={`#`}>
            <Box className={style.containerCard}>
                <img
                    src={img}
                    alt=""
                    width={150}
                    height={150}
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
            </Box>
        </Link>
    );
}
