import { storage } from "@/services/firebase";
import { CreateAddressDTO } from "@/validators/Address";
import { CreateRestaurantDTO } from "@/validators/Restaurant";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
    Box,
    Button,
    CircularProgress,
    Container,
    Grid,
    Modal,
    TextField,
    Typography,
} from "@mui/material";
import useMediaQuery from "@mui/material/useMediaQuery";
import createValidator from "class-validator-formik";
import { getCookie } from "cookies-next";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Formik } from "formik";
import { useState } from "react";
import { useQuery } from "react-query";
import { api } from "../../services/apí";
import { Pros } from "../CardRestaurant";
import { CardRestaurantAdm } from "../CardRestaurantAdm";
import { Notify, notifyError, notifyInfo, notifySuccess } from "../Notify";
import style from "./styles.module.scss";

const styleM = {
    position: "absolute" as "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 1000,
    bgcolor: "background.paper",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
};

type Props = {
    setPage: any;
    setRestaurant: any;
};

export const ListRestaurantsAdm = ({ setPage, setRestaurant }: Props) => {
    const matches = useMediaQuery("(min-width:600px)");

    const [open, setOpen] = useState(false);
    const handleOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    const [address, setAddress] = useState<CreateAddressDTO>();
    const [isForm, setIsForm] = useState(true);
    const [percent, setPercent] = useState(0);
    const [logo, setLogo] = useState<string>();

    const handleImageAsFile = (e: any) => {
        const image = e.target.files[0];
        const storageRef = ref(storage, `/files/${image.name}`);
        const uploadTask = uploadBytesResumable(storageRef, image);
        uploadTask.on(
            "state_changed",
            (snapshot) => {
                const percent = Math.round(
                    (snapshot.bytesTransferred / snapshot.totalBytes) * 100
                ); // update progress
                setPercent(percent);
            },
            (err) => console.log(err),
            () => {
                // download url
                getDownloadURL(uploadTask.snapshot.ref).then((url) => {
                    setLogo(url);
                });
            }
        );
    };

    const token = getCookie("@tokenAdmin");

    const fetchUsers = async () => {
        const res = await api.get("/restaurant/adm/list", {
            headers: {
                Authorization: token,
            },
        });
        return res.data;
    };

    const { data, status, isLoading, refetch } = useQuery(
        "restaurants",
        fetchUsers
    );

    return (
        <>
            {matches ? (
                <Container sx={{ m: 7 }}>
                    <Typography fontWeight={"bold"} variant="h6" gutterBottom>
                        Restaurantes
                    </Typography>
                    <Grid
                        container
                        rowSpacing={1}
                        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
                    >
                        {isLoading ? (
                            <CircularProgress />
                        ) : (
                            <>
                                {data.map((restaurant: Pros) => {
                                    return (
                                        <>
                                            <Grid
                                                onClick={() => {
                                                    setPage("Product");
                                                    setRestaurant(restaurant);
                                                }}
                                                alignItems={"center"}
                                                item
                                                xs={6}
                                            >
                                                {
                                                    <CardRestaurantAdm
                                                        id={restaurant.id}
                                                        name={restaurant.name}
                                                        logo={restaurant.logo}
                                                    />
                                                }
                                            </Grid>
                                        </>
                                    );
                                })}
                                <Grid
                                    textAlign={"center"}
                                    justifyContent={"center"}
                                    item
                                    xs={6}
                                    onClick={handleOpen}
                                >
                                    <Box className={style.container}>
                                        <AddCircleOutlineIcon
                                            sx={{
                                                fontSize: 90,
                                            }}
                                        />
                                    </Box>
                                </Grid>
                            </>
                        )}
                    </Grid>
                    <div>
                        <Modal
                            open={open}
                            onClose={handleClose}
                            aria-labelledby="parent-modal-title"
                            aria-describedby="parent-modal-description"
                        >
                            <Box sx={{ ...styleM, width: 400 }}>
                                <>
                                    <Container component="main">
                                        <Box
                                            sx={{
                                                marginTop: 4,
                                                display: "flex",
                                                flexDirection: "column",
                                                alignItems: "center",
                                            }}
                                        >
                                            {isForm ? (
                                                <>
                                                    <Formik
                                                        validate={createValidator(
                                                            CreateAddressDTO
                                                        )}
                                                        initialValues={{
                                                            state: "",
                                                            city: "",
                                                            cep: "",
                                                            district: "",
                                                            street: "",
                                                            number: 0,
                                                        }}
                                                        onSubmit={async (
                                                            values,
                                                            {
                                                                resetForm,
                                                                setErrors,
                                                            }
                                                        ) => {
                                                            setAddress(values);
                                                            resetForm();
                                                            setIsForm(false);
                                                        }}
                                                    >
                                                        {({
                                                            values,
                                                            touched,
                                                            errors,
                                                            handleChange,
                                                            handleBlur,
                                                            handleSubmit,
                                                        }) => (
                                                            <>
                                                                <Grid
                                                                    container
                                                                    spacing={2}
                                                                >
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                    >
                                                                        <TextField
                                                                            required
                                                                            fullWidth
                                                                            label="Estado"
                                                                            autoFocus
                                                                            onBlur={handleBlur(
                                                                                "state"
                                                                            )}
                                                                            value={
                                                                                values.state
                                                                            }
                                                                            onChange={handleChange(
                                                                                "state"
                                                                            )}
                                                                        />
                                                                        {errors.state &&
                                                                        touched.state ? (
                                                                            <>
                                                                                <Typography
                                                                                    color={
                                                                                        "error"
                                                                                    }
                                                                                    variant="subtitle2"
                                                                                >
                                                                                    {
                                                                                        errors.state
                                                                                    }
                                                                                </Typography>
                                                                            </>
                                                                        ) : (
                                                                            <>

                                                                            </>
                                                                        )}
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                    >
                                                                        <TextField
                                                                            required
                                                                            fullWidth
                                                                            label="Cidade"
                                                                            onBlur={handleBlur(
                                                                                "city"
                                                                            )}
                                                                            value={
                                                                                values.city
                                                                            }
                                                                            onChange={handleChange(
                                                                                "city"
                                                                            )}
                                                                        />
                                                                        {errors.city &&
                                                                        touched.city ? (
                                                                            <>
                                                                                <Typography
                                                                                    color={
                                                                                        "error"
                                                                                    }
                                                                                    variant="subtitle2"
                                                                                >
                                                                                    {
                                                                                        errors.city
                                                                                    }
                                                                                </Typography>
                                                                            </>
                                                                        ) : (
                                                                            <>

                                                                            </>
                                                                        )}
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        sm={6}
                                                                    >
                                                                        <TextField
                                                                            required
                                                                            fullWidth
                                                                            label="CEP"
                                                                            onBlur={handleBlur(
                                                                                "cep"
                                                                            )}
                                                                            value={
                                                                                values.cep
                                                                            }
                                                                            onChange={handleChange(
                                                                                "cep"
                                                                            )}
                                                                        />
                                                                        {errors.cep &&
                                                                        touched.cep ? (
                                                                            <>
                                                                                <Typography
                                                                                    color={
                                                                                        "error"
                                                                                    }
                                                                                    variant="subtitle2"
                                                                                >
                                                                                    {
                                                                                        errors.cep
                                                                                    }
                                                                                </Typography>
                                                                            </>
                                                                        ) : (
                                                                            <>

                                                                            </>
                                                                        )}
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                        sm={6}
                                                                    >
                                                                        <TextField
                                                                            required
                                                                            fullWidth
                                                                            label="N°"
                                                                            onBlur={handleBlur(
                                                                                "number"
                                                                            )}
                                                                            value={
                                                                                values.number
                                                                            }
                                                                            onChange={handleChange(
                                                                                "number"
                                                                            )}
                                                                            type={
                                                                                "number"
                                                                            }
                                                                        />
                                                                        {errors.number &&
                                                                        touched.number ? (
                                                                            <>
                                                                                <Typography
                                                                                    color={
                                                                                        "error"
                                                                                    }
                                                                                    variant="subtitle2"
                                                                                >
                                                                                    {
                                                                                        errors.number
                                                                                    }
                                                                                </Typography>
                                                                            </>
                                                                        ) : (
                                                                            <>

                                                                            </>
                                                                        )}
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                    >
                                                                        <TextField
                                                                            required
                                                                            fullWidth
                                                                            label="Rua"
                                                                            type="text"
                                                                            onBlur={handleBlur(
                                                                                "street"
                                                                            )}
                                                                            value={
                                                                                values.street
                                                                            }
                                                                            onChange={handleChange(
                                                                                "street"
                                                                            )}
                                                                        />
                                                                        {errors.street &&
                                                                        touched.street ? (
                                                                            <>
                                                                                <Typography
                                                                                    color={
                                                                                        "error"
                                                                                    }
                                                                                    variant="subtitle2"
                                                                                >
                                                                                    {
                                                                                        errors.street
                                                                                    }
                                                                                </Typography>
                                                                            </>
                                                                        ) : (
                                                                            <>

                                                                            </>
                                                                        )}
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                    >
                                                                        <TextField
                                                                            required
                                                                            fullWidth
                                                                            label="Bairro"
                                                                            type="text"
                                                                            onBlur={handleBlur(
                                                                                "district"
                                                                            )}
                                                                            value={
                                                                                values.district
                                                                            }
                                                                            onChange={handleChange(
                                                                                "district"
                                                                            )}
                                                                        />
                                                                        {errors.district &&
                                                                        touched.district ? (
                                                                            <>
                                                                                <Typography
                                                                                    color={
                                                                                        "error"
                                                                                    }
                                                                                    variant="subtitle2"
                                                                                >
                                                                                    {
                                                                                        errors.district
                                                                                    }
                                                                                </Typography>
                                                                            </>
                                                                        ) : (
                                                                            <>

                                                                            </>
                                                                        )}
                                                                    </Grid>
                                                                </Grid>
                                                                <Button
                                                                    fullWidth
                                                                    type="submit"
                                                                    variant="contained"
                                                                    sx={{
                                                                        mt: 3,
                                                                        mb: 2,
                                                                    }}
                                                                    onClick={() => {
                                                                        handleSubmit();
                                                                    }}
                                                                >
                                                                    Proximo
                                                                </Button>
                                                            </>
                                                        )}
                                                    </Formik>
                                                </>
                                            ) : (
                                                <>
                                                    <Formik
                                                        validate={createValidator(
                                                            CreateRestaurantDTO
                                                        )}
                                                        initialValues={{
                                                            name: "",
                                                            color: "#f5f2ff",
                                                            cnpj: "",
                                                        }}
                                                        onSubmit={async (
                                                            values,
                                                            {
                                                                resetForm,
                                                                setErrors,
                                                            }
                                                        ) => {
                                                            const token =
                                                                getCookie(
                                                                    "@tokenAdmin"
                                                                );
                                                            const dataAddress =
                                                                await api.post(
                                                                    "/address/adm",
                                                                    address,
                                                                    {
                                                                        headers:
                                                                            {
                                                                                authorization:
                                                                                    token,
                                                                            },
                                                                    }
                                                                );
                                                            notifyInfo(
                                                                "Criando restaurante"
                                                            );
                                                            try {
                                                                await api.post(
                                                                    "/restaurant",
                                                                    {
                                                                        name: values.name,
                                                                        cnpj: values.cnpj,
                                                                        idAddress:
                                                                            dataAddress
                                                                                .data
                                                                                .id,
                                                                        logo: logo,
                                                                        color: values.color,
                                                                    },
                                                                    {
                                                                        headers:
                                                                            {
                                                                                authorization:
                                                                                    token,
                                                                            },
                                                                    }
                                                                );
                                                                notifySuccess(
                                                                    "Criado com sucesso"
                                                                );
                                                                refetch();
                                                                handleClose();
                                                            } catch (error) {
                                                                notifyError(
                                                                    "Ocorreu um erro inesperado"
                                                                );
                                                            }
                                                        }}
                                                    >
                                                        {({
                                                            values,
                                                            touched,
                                                            errors,
                                                            handleChange,
                                                            handleBlur,
                                                            handleSubmit,
                                                        }) => (
                                                            <>
                                                                <Grid
                                                                    container
                                                                    spacing={2}
                                                                >
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                    >
                                                                        <TextField
                                                                            required
                                                                            fullWidth
                                                                            label="Nome"
                                                                            autoFocus
                                                                            onBlur={handleBlur(
                                                                                "name"
                                                                            )}
                                                                            value={
                                                                                values.name
                                                                            }
                                                                            onChange={handleChange(
                                                                                "name"
                                                                            )}
                                                                        />
                                                                        {errors.name &&
                                                                        touched.name ? (
                                                                            <>
                                                                                <Typography
                                                                                    color={
                                                                                        "error"
                                                                                    }
                                                                                    variant="subtitle2"
                                                                                >
                                                                                    {
                                                                                        errors.name
                                                                                    }
                                                                                </Typography>
                                                                            </>
                                                                        ) : (
                                                                            <>

                                                                            </>
                                                                        )}
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                    >
                                                                        <TextField
                                                                            required
                                                                            fullWidth
                                                                            label="CNPJ"
                                                                            type="text"
                                                                            onBlur={handleBlur(
                                                                                "cnpj"
                                                                            )}
                                                                            value={
                                                                                values.cnpj
                                                                            }
                                                                            onChange={handleChange(
                                                                                "cnpj"
                                                                            )}
                                                                        />
                                                                        {errors.cnpj &&
                                                                        touched.cnpj ? (
                                                                            <>
                                                                                <Typography
                                                                                    color={
                                                                                        "error"
                                                                                    }
                                                                                    variant="subtitle2"
                                                                                >
                                                                                    {
                                                                                        errors.cnpj
                                                                                    }
                                                                                </Typography>
                                                                            </>
                                                                        ) : (
                                                                            <>

                                                                            </>
                                                                        )}
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                    >
                                                                        <TextField
                                                                            required
                                                                            fullWidth
                                                                            onChange={
                                                                                handleImageAsFile
                                                                            }
                                                                            label="Logo"
                                                                            type="file"
                                                                        />
                                                                    </Grid>
                                                                    <Grid
                                                                        item
                                                                        xs={12}
                                                                    >
                                                                        <TextField
                                                                            required
                                                                            fullWidth
                                                                            label="Cor"
                                                                            type="color"
                                                                            onBlur={handleBlur(
                                                                                "color"
                                                                            )}
                                                                            value={
                                                                                values.color
                                                                            }
                                                                            onChange={handleChange(
                                                                                "color"
                                                                            )}
                                                                        />
                                                                        {errors.name &&
                                                                        touched.color ? (
                                                                            <>
                                                                                <Typography
                                                                                    color={
                                                                                        "error"
                                                                                    }
                                                                                    variant="subtitle2"
                                                                                >
                                                                                    {
                                                                                        errors.color
                                                                                    }
                                                                                </Typography>
                                                                            </>
                                                                        ) : (
                                                                            <>

                                                                            </>
                                                                        )}
                                                                    </Grid>
                                                                </Grid>
                                                                <Button
                                                                    fullWidth
                                                                    type="submit"
                                                                    variant="contained"
                                                                    sx={{
                                                                        mt: 3,
                                                                        mb: 2,
                                                                    }}
                                                                    onClick={() => {
                                                                        handleSubmit();
                                                                    }}
                                                                >
                                                                    Criar
                                                                </Button>
                                                            </>
                                                        )}
                                                    </Formik>
                                                </>
                                            )}
                                            <Box
                                                component="form"
                                                noValidate
                                                sx={{ mt: 3 }}
                                            ></Box>
                                        </Box>
                                        <Notify />
                                    </Container>
                                </>
                            </Box>
                        </Modal>
                    </div>
                </Container>
            ) : (
                <Container sx={{ margin: 1 }}>
                    <Typography fontWeight={"bold"} variant="h6" gutterBottom>
                        Restaurantes
                    </Typography>
                    {isLoading ? (
                        <CircularProgress />
                    ) : (
                        <>
                            {data.map((restaurant: Pros) => {
                                return (
                                    <>
                                        <CardRestaurantAdm
                                            id={restaurant.id}
                                            name={restaurant.name}
                                            logo={restaurant.logo}
                                        />
                                    </>
                                );
                            })}
                        </>
                    )}
                </Container>
            )}
        </>
    );
};
