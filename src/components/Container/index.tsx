import { Box, createTheme, ThemeProvider } from "@mui/material";
import { ReactNode } from "react";

type Props={
    color:string,
    children:ReactNode
}

export const Container = ({children,color}:Props) => {
    return (
        <Box>
            <ThemeProvider
                theme={createTheme({
                    palette: {
                        primary: {
                            main: color,
                            contrastText: "#FFFFFF",
                        },
                    },
                })}
            >
                {children}
            </ThemeProvider>
        </Box>
    );
};
