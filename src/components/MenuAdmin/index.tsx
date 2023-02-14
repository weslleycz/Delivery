import GridViewIcon from "@mui/icons-material/GridView";
import DeliveryDiningIcon from '@mui/icons-material/DeliveryDining';
import LogoutIcon from "@mui/icons-material/Logout";
import { Box, Button, List, ListItem } from "@mui/material";
import { deleteCookie } from "cookies-next";
import Image from "next/image";
import style from "./styles.module.scss";
import { useRouter } from "next/router";

type Props={
    setPage:(valor:string)=>void;
}

export const MenuAdmin = ({setPage}:Props) => {

    const router = useRouter();

    const handleLogoff = () => {
        deleteCookie("@tokenAdmin");
        router.push(`/admin/login`);
    };

    return (
        <>
            <Box padding={3} className={style.conteiner}>
                <List>
                    <ListItem sx={{ margin: 3 }} component="div" disablePadding>
                        <Image
                            src="/logo.svg"
                            alt="Picture of the author"
                            width={80}
                            height={80}
                        />
                    </ListItem>
                    <ListItem component="div" disablePadding>
                        <Button
                            size="large"
                            onClick={()=>setPage("restaurants")}
                            startIcon={<GridViewIcon />}
                        >
                            <strong>Restaurantes</strong>
                        </Button>
                    </ListItem>
                    <ListItem component="div" disablePadding>
                        <Button
                            size="large"
                            onClick={()=>setPage("order")}
                            startIcon={<DeliveryDiningIcon />}
                        >
                            <strong>Pedidos</strong>
                        </Button>
                    </ListItem>
                    <ListItem
                        sx={{ marginTop: 40 }}
                        component="div"
                        disablePadding
                    >
                        <Button
                            onClick={() => handleLogoff()}
                            size="large"
                            sx={{}}
                            startIcon={<LogoutIcon />}
                        >
                            <strong>Exit</strong>
                        </Button>
                    </ListItem>
                </List>
            </Box>
        </>
    );
};
