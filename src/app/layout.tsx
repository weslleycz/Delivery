"use client";
import { theme } from "@/theme";
import { ThemeProvider } from "@emotion/react";
import "./globals.scss";

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
                <ThemeProvider theme={theme}>{children}</ThemeProvider>
            </body>
        </html>
    );
}
