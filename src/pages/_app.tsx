import { CartProvider } from "@africasokoni/react-use-cart";
import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import "../app/globals.scss";

const queryClient = new QueryClient();

export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <CartProvider>
                <QueryClientProvider client={queryClient}>
                    <Component {...pageProps} />
                </QueryClientProvider>
            </CartProvider>
        </>
    );
}
