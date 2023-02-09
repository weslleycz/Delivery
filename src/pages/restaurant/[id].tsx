import { Button } from "@mui/material";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import { Container } from "../../components/Container";
import { api } from "../../services/apí";

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
            <Container color={data.color}>
                <Button variant="contained">Contained</Button>
            </Container>
        </>
    ) : (
        <></>
    );
}
