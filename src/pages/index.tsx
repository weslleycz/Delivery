"use client";

import { ListRestaurants } from "@/components/ListRestaurants";
import Head from "next/head";

export default function Home() {
    return (
        <>
            <Head>
                <meta name="theme-color" content="#fb9400" />
                <link rel="icon" href="/favicon.ico" />
                <title>Página home</title>
            </Head>
            <ListRestaurants />
        </>
    );
}
