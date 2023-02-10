/* eslint-disable @next/next/no-title-in-document-head */
import { Button } from "@mui/material";
import Head from "next/head";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container } from "../../../components/Container";
import { Menu } from "../../../components/Menu";
import { api } from "../../../services/apí";

type IRestaurant = {
    id: string;
    name: string;
    logo: string;
    color: string;
    cnpj: string;
    admId: string;
    addressId: string;
};


export default function HomeRestaurant() {
    const router = useRouter();
    const { id } = router.query;
    const [data, setData] = useState<IRestaurant | null>(null);

    useEffect(() => {
        (async () => {
            if (id != undefined) {
                try {
                    const restaurant = await api.get(`/restaurant/${id}`);
                    setData(restaurant.data);
                } catch (error) {
                    router.push("/restaurant");
                }
            }
        })();
    });
    return data != null ? (
        <>
            <Head>
                <meta name="theme-color" content={data.color} />
                <link rel="icon" href={data.logo} />
                <title>{data.name}</title>
            </Head>
            <Container color={data.color}>
                <Menu color={data.color} name={data.name} id={data.id} logo={data.logo} />
                <Button variant="contained">Contained</Button>
            </Container>
        </>
    ) : (
        <></>
    );
}
