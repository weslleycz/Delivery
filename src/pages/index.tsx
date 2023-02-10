"use client";

import { Hero } from "@/components/Hero";
import { ListRestaurants } from "@/components/ListRestaurants";
import Head from "next/head";
import { prismaClient } from "../services/prismaClient";


export default function Home() {
    return (
        <>
            <Head>
                <meta name="theme-color" content="#fb9400" />
                <title>Página home</title>
            </Head>
            <Hero />
            <ListRestaurants />
        </>
    );
}
