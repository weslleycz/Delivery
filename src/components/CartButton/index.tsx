import { Item, useCart } from "@africasokoni/react-use-cart";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { Badge, Box, Divider, Stack, Typography } from "@mui/material";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import { alpha, styled } from "@mui/material/styles";
import * as React from "react";

const StyledMenu = styled((props: MenuProps) => (
    <Menu
        elevation={0}
        anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
        }}
        transformOrigin={{
            vertical: "top",
            horizontal: "right",
        }}
        {...props}
    />
))(({ theme }) => ({
    "& .MuiPaper-root": {
        borderRadius: 6,
        marginTop: theme.spacing(1),
        minWidth: 180,
        color:
            theme.palette.mode === "light"
                ? "rgb(55, 65, 81)"
                : theme.palette.grey[300],
        boxShadow:
            "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
        "& .MuiMenu-list": {
            padding: "4px 0",
        },
        "& .MuiMenuItem-root": {
            "& .MuiSvgIcon-root": {
                fontSize: 18,
                color: theme.palette.text.secondary,
                marginRight: theme.spacing(1.5),
            },
            "&:active": {
                backgroundColor: alpha(
                    theme.palette.primary.main,
                    theme.palette.action.selectedOpacity
                ),
            },
        },
    },
}));

export const CartButton = () => {
    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const { totalUniqueItems, items, removeItem } = useCart();
    const [totalItens, setTotalItens] = React.useState<Item[]>([]);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setTotalItens(items);
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div>
            <Button
                color="primary"
                aria-controls={open ? "demo-customized-menu" : undefined}
                aria-haspopup="true"
                aria-expanded={open ? "true" : undefined}
                disableElevation
                onClick={handleClick}
                variant="text"
            >
                <Badge badgeContent={totalUniqueItems} color="primary">
                    <ShoppingCartIcon color="primary" />
                </Badge>
            </Button>
            <StyledMenu
                id="demo-customized-menu"
                MenuListProps={{
                    "aria-labelledby": "demo-customized-button",
                }}
                anchorEl={anchorEl}
                open={open}
                onClose={handleClose}
            >
                {totalItens.map((itens, index) => {
                    return (
                        <>
                            <Box padding={1.6}>
                                {index != 0 ? <Divider /> : null}
                                <Stack spacing={2}>
                                    <Box marginTop={index != 0 ? 2 : 0}>
                                        <Stack direction="row" spacing={7}>
                                            <Box width={80}>
                                                <strong>{`${itens.quantity}x ${itens.displayName}`}</strong>
                                            </Box>
                                            <Box>
                                                {(
                                                    (Number(itens.price) /
                                                        100) *
                                                    Number(itens.quantity)
                                                ).toLocaleString("pt-br", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </Box>
                                        </Stack>
                                    </Box>
                                    <Box>
                                        <Stack direction="row" spacing={2}>
                                            <Typography
                                                color={"primary"}
                                                variant="body2"
                                                gutterBottom
                                                sx={{ cursor: "pointer" }}
                                            >
                                                Editar
                                            </Typography>
                                            <Typography
                                                onClick={() => {
                                                    removeItem(itens.id);
                                                    handleClose();
                                                }}
                                                color={"GrayText"}
                                                variant="body2"
                                                gutterBottom
                                                sx={{ cursor: "pointer" }}
                                            >
                                                Remover
                                            </Typography>
                                        </Stack>
                                    </Box>
                                </Stack>
                            </Box>
                        </>
                    );
                })}
                <Box sx={{ padding: 1.9 }}>
                    {totalUniqueItems != 0 ? (
                        <Button fullWidth variant="contained">
                            Finalizar pedido
                        </Button>
                    ) : null}
                    <Stack spacing={1}>
                        <Button fullWidth variant="text">
                            Meus pedidos
                        </Button>
                    </Stack>
                </Box>
            </StyledMenu>
        </div>
    );
};
