import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import { Container } from "@mui/material";

type Props = {
    setPage: any;
};

export const ProductAdm = ({ setPage }: Props) => {
    return (
        <>
            <Container sx={{ m: 7 }}>
                <ChevronLeftIcon
                    sx={{ cursor: "pointer" }}
                    onClick={() => setPage("restaurants")}
                />
            </Container>
        </>
    );
};
