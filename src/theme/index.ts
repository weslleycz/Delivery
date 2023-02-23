import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
    palette: {
        primary: {
            main: "#a200ff",
            contrastText: "#FFFFFF",
        },
        success: {
            main: "#48cc13",
            contrastText: "#FFFFFF",
        },
        error: {
            main: "#ff5151",
            contrastText: "#FFFFFF",
        },
        info: {
            main: "#bd77eb",
            contrastText: "#FFFFFF",
        },
    },
});
