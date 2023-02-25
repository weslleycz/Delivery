import { useCart } from "@africasokoni/react-use-cart";
import { Button, Grid, Stack, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import { useState } from "react";
import { CartButton } from "../CartButton";
import {  notifySuccess } from "../Notify";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 950,
    bgcolor: "background.paper",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

type Props = {
    open: boolean;
    setOpen: any;
    img: string;
    name: string;
    price: number;
    description: string;
    id: string;
};

export const ModalProductIten = ({
    open,
    setOpen,
    img,
    price,
    name,
    description,
    id,
}: Props) => {
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);
    const [num, setNum] = useState<number>(1);
    const { addItem, getItem, updateItemQuantity } = useCart();

    const handlingAddItem = () => {
        if (num != 0) {
            const item = getItem(id);
            if (item === undefined) {
                addItem({
                    id: id,
                    name: name,
                    discount_price: 0,
                    price:price,
                    quantity: num,
                    itemSku: {
                        discount_price: 0,
                        id: id,
                        quantity: num,
                    },
                });
                handleClose();
                notifySuccess("Item adicionado");
            } else {
                console.log(typeof item.quantity);
                
                updateItemQuantity(item.id, Number(num) + Number(item.quantity));
                handleClose();
                notifySuccess("Item adicionado");
            }
        }
    };

    return (
        <>
            <Modal
                open={open}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box borderRadius={2} sx={style}>
                    <Box sx={{ padding: 2 }}>
                        <Grid
                            container
                            rowSpacing={1}
                            columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                        >
                            <Grid item xs={6}>
                                <img
                                    src={img}
                                    alt=""
                                    width={400}
                                    height={400}
                                />
                            </Grid>
                            <Grid item xs={6}>
                                <Box textAlign={"center"}>
                                    <Typography
                                        sx={{ fontWeight: "bolder" }}
                                        variant="h4"
                                        gutterBottom
                                    >
                                        {name}
                                    </Typography>
                                    <Typography
                                        color={"GrayText"}
                                        variant="body2"
                                        gutterBottom
                                    >
                                        {description}
                                    </Typography>
                                </Box>
                                <Typography
                                    sx={{ fontWeight: "bolder" }}
                                    variant="h3"
                                    gutterBottom
                                >
                                    {(price / 100).toLocaleString("pt-br", {
                                        style: "currency",
                                        currency: "BRL",
                                    })}
                                </Typography>
                                <Stack
                                    marginTop={24}
                                    direction="row"
                                    spacing={1}
                                >
                                    <TextField
                                        type={"number"}
                                        // eslint-disable-next-line react/jsx-no-duplicate-props
                                        sx={{ width: "35%" }}
                                        onChange={(e) => setNum(e.target.value)}
                                        value={num}
                                    />
                                    <Button
                                        size="large"
                                        onClick={() => handlingAddItem()}
                                        fullWidth
                                        variant="contained"
                                        endIcon={
                                            <>
                                                {(
                                                    (price / 100) *
                                                    num
                                                ).toLocaleString("pt-br", {
                                                    style: "currency",
                                                    currency: "BRL",
                                                })}
                                            </>
                                        }
                                    >
                                        Adicionar
                                    </Button>
                                </Stack>
                            </Grid>
                        </Grid>
                    </Box>
                </Box>
            </Modal>
        </>
    );
};
