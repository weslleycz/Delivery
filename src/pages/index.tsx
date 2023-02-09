"use client";

import { Hero } from "@/components/Hero";
import { ListRestaurants } from "@/components/ListRestaurants";
import Head from "next/head";
import { prismaClient } from "../services/prismaClient";

export async function getStaticProps() {
    const restaurants = await prismaClient.restaurant.findMany();
    return {
        props: {
            restaurants,
        },
    };
}

type Props = {
    restaurants: [
        {
            id: string;
            name: string;
            logo: string;
        }
    ];
};

export default function Home({ restaurants }: Props) {
    return (
        <>
            <Head>
                <meta name="theme-color" content="#fb9400" />
                <title>Página home</title>
            </Head>
            <Hero />
            <ListRestaurants restaurants={restaurants} />
        </>
    );
}
