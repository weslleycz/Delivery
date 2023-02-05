"use client";
import { theme } from "@/theme";
import { ThemeProvider } from "@emotion/react";
import { QueryClient, QueryClientProvider } from "react-query";
import "./globals.scss";

const queryClient = new QueryClient();

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="pt-BR">
            {/*
        <head /> will contain the components returned by the nearest parent
        head.tsx. Find out more at https://beta.nextjs.org/docs/api-reference/file-conventions/head
      */}
            <head />
            <body>
                <QueryClientProvider client={queryClient}>
                    <ThemeProvider theme={theme}>{children}</ThemeProvider>
                </QueryClientProvider>
            </body>
        </html>
    );
}
