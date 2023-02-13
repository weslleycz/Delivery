import { AppProps } from "next/app";
import { QueryClient, QueryClientProvider } from "react-query";
import "../app/globals.scss";

const queryClient = new QueryClient();


export default function App({ Component, pageProps }: AppProps) {
    return (
        <>
            <QueryClientProvider client={queryClient}>
                <Component {...pageProps} />
            </QueryClientProvider>
        </>
    );
}
