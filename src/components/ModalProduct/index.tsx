import { Notify, notifyError, notifySuccess } from "@/components/Notify";
import { api } from "@/services/apí";
import { storage } from "@/services/firebase";
import AddIcon from "@mui/icons-material/Add";
import {
    Autocomplete,
    Box,
    Button,
    Container,
    Fab,
    Grid,
    Modal,
    TextField,
} from "@mui/material";
import { getCookie } from "cookies-next";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Formik } from "formik";
import { useState } from "react";

const style = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 450,
    bgcolor: "background.paper",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

type Props = {
    openCreate: boolean;
    setOpenCreate: (valor: boolean) => void;
    restaurantId: string | undefined;
    refetch: () => void;
};

const top100Films = [
    { label: "Refeição", type: "Refeição" },
    { label: "Lanche", type: "Lanche" },
    { label: "Bebida", type: "Bebida" },
    { label: "Sobremesa", type: "Sobremesa" },
];

type IValore={
    label:string;
    type:string;
}

export const ModalProduct = ({
    openCreate,
    setOpenCreate,
    refetch,
    restaurantId,
}: Props) => {
    const handleOpen = () => setOpenCreate(true);
    const handleClose = () => setOpenCreate(false);
    const [percent, setPercent] = useState(0);
    const [img, setImg] = useState<string>();
    const token = getCookie("@tokenAdmin");
    const [value, setValue] = useState<IValore | null>();

    const handleImageAsFile = (e: any) => {
        const image = e.target.files[0];
        const storageRef = ref(storage, `/files/${Math.random()}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                );
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setImg(url);
                });
            }
        );
    };

    return (
        <div>
            <Fab onClick={() => handleOpen()} color="primary" aria-label="add">
                <AddIcon />
            </Fab>
            <Modal
                open={openCreate}
                onClose={handleClose}
                aria-labelledby="modal-modal-title"
                aria-describedby="modal-modal-description"
            >
                <Box sx={style}>
                    <Formik
                        initialValues={{
                            name: "",
                            price: 0,
                            description: "",
                            type: "",
                        }}
                        onSubmit={(values, { setSubmitting }) => {
                            (async () => {
                                try {
                                    await api.post(
                                        "/product",
                                        {
                                            name: values.name,
                                            price: values.price * 100,
                                            description: values.description,
                                            type: value?.type,
                                            idRestaurant: restaurantId,
                                            imagens: [img],
                                        },
                                        {
                                            headers: {
                                                Authorization: token,
                                            },
                                        }
                                    );
                                    refetch();
                                    handleClose();
                                    notifySuccess("Criado com sucesso");
                                } catch (error) {
                                    notifyError("Ocorreu um erro inesperado.");
                                }
                            })();
                        }}
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                            isSubmitting,
                        }) => (
                            <Container sx={{ marginTop: 2 }} component="main">
                                <Grid container spacing={2}>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Nome"
                                            autoFocus
                                            onBlur={handleBlur("name")}
                                            value={values.name}
                                            onChange={handleChange("name")}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Preço"
                                            type={"number"}
                                            autoFocus
                                            onBlur={handleBlur("price")}
                                            value={values.price}
                                            onChange={handleChange("price")}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            label="Descrição"
                                            multiline
                                            rows={4}
                                            autoFocus
                                            onBlur={handleBlur("description")}
                                            value={values.description}
                                            onChange={handleChange(
                                                "description"
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Autocomplete
                                            style={{ width: "100%" }}
                                            fullWidth
                                            disablePortal
                                            options={top100Films}
                                            sx={{ width: 300 }}
                                            onChange={(
                                                event: any,
                                                newValue
                                            ) => {
                                                setValue(newValue);
                                            }}
                                            renderInput={(params) => (
                                                <TextField
                                                    onChange={handleChange(
                                                        "type"
                                                    )}
                                                    required
                                                    label="Tipo"
                                                    autoFocus
                                                    onBlur={handleBlur("type")}
                                                    value={values.type}
                                                    {...params}
                                                />
                                            )}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <TextField
                                            required
                                            fullWidth
                                            type={"file"}
                                            autoFocus
                                            onChange={handleImageAsFile}
                                        />
                                    </Grid>
                                    <Grid item xs={12}>
                                        <Button
                                            fullWidth
                                            type="submit"
                                            variant="contained"
                                            sx={{
                                                mt: 2,
                                                mb: 2,
                                            }}
                                            onClick={() => {
                                                handleSubmit();
                                            }}
                                        >
                                            Criar produto
                                        </Button>
                                    </Grid>
                                </Grid>
                            </Container>
                        )}
                    </Formik>
                </Box>
            </Modal>
            <Notify />
        </div>
    );
};
