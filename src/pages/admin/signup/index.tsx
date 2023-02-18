import { ThemeProvider } from "@emotion/react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import createValidator from "class-validator-formik";
import { Formik } from "formik";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Notify, notifyError, notifySuccess } from "../../../components/Notify";
import { api } from "../../../services/apí";

import { CreateAdmDTO } from "@/validators/Adm.dto";
import {
    Box,
    Button,
    Container,
    createTheme,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    OutlinedInput,
    Typography,
} from "@mui/material";
import style from "../login/styles.module.scss";

export default function SignUp() {
    type AxiosCreateUserError = {
        response: { data: { message: string } };
    };

    const router = useRouter();
    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: any) => {
        event.preventDefault();
    };

    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const handleClickShowConfirmPassword = () =>
        setShowConfirmPassword((show) => !show);

    const handleMouseDownConfirmPassword = (event: any) => {
        event.preventDefault();
    };

    const { query } = useRouter();

    return (
        <>
            <Head>
                <meta name="theme-color" content={"#" + query.color} />
                <link rel="icon" href={query.logo as string} />
                <title>Cadastrar-se</title>
            </Head>
            <Container
                sx={{ marginBlock: 5 }}
                maxWidth="xs"
                className={style["container-all"]}
            >
                <ThemeProvider
                    theme={createTheme({
                        palette: {
                            primary: {
                                main: "#FB9400",
                                contrastText: "#FFFFFF",
                            },
                        },
                    })}
                >
                    <Box
                        sx={{
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                            marginTop: 1,
                        }}
                    >
                        <img
                            src={"/favicon.ico"}
                            alt="Logo"
                            width={100}
                            height={100}
                        />
                    </Box>
                    <div className={style.logo}>
                        <p>Realizar um Cadastro no App.</p>
                    </div>
                    <Formik
                        validate={createValidator(CreateAdmDTO)}
                        initialValues={{
                            email: "",
                            password: "",
                            passwordConfirm: "",
                        }}
                        onSubmit={async (values, { resetForm, setErrors }) => {
                            const { email, password, passwordConfirm } = values;
                            try {
                                await api.post("/adm", {
                                    email,
                                    password,
                                    passwordConfirm,
                                });
                                notifySuccess("Usuário Criado com Sucesso!");
                                setTimeout(() => {
                                    router.push("/login");
                                }, 500);
                            } catch (error) {
                                const errorData = error as AxiosCreateUserError;
                                setErrors({
                                    email: errorData.response.data.message,
                                });
                                notifyError(errorData.response.data.message);
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
                                <InputLabel
                                    htmlFor="outlined-adornment-password"
                                    className={style.titleInput}
                                >
                                    Email
                                </InputLabel>
                                <OutlinedInput
                                    required
                                    fullWidth
                                    id="email"
                                    name="email"
                                    autoComplete="email"
                                    autoFocus
                                    onBlur={handleBlur("email")}
                                    value={values.email}
                                    onChange={handleChange("email")}
                                    sx={{ margin: " 0 0 0.5rem 0" }}
                                />
                                {errors.email && touched.email ? (
                                    <>
                                        <Typography
                                            color={"error"}
                                            variant="subtitle1"
                                        >
                                            {errors.email}
                                        </Typography>
                                    </>
                                ) : (
                                    <></>
                                )}

                                <InputLabel
                                    htmlFor="outlined-adornment-password"
                                    className={style.titleInput}
                                >
                                    Senha
                                </InputLabel>

                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={showPassword ? "text" : "password"}
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={
                                                    handleClickShowPassword
                                                }
                                                onMouseDown={
                                                    handleMouseDownPassword
                                                }
                                                edge="end"
                                            >
                                                {showPassword ? (
                                                    <VisibilityOffIcon />
                                                ) : (
                                                    <RemoveRedEyeIcon />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    required
                                    fullWidth
                                    name="password"
                                    onBlur={handleBlur("password")}
                                    value={values.password}
                                    onChange={handleChange("password")}
                                    autoComplete="current-password"
                                    sx={{ margin: " 0 0 0.5rem 0" }}
                                />
                                {errors.password && touched.password ? (
                                    <>
                                        <Typography
                                            color={"error"}
                                            variant="subtitle1"
                                        >
                                            {errors.password}
                                        </Typography>
                                    </>
                                ) : null}

                                <InputLabel
                                    htmlFor="outlined-adornment-password"
                                    className={style.titleInput}
                                >
                                    Confirmar Senha
                                </InputLabel>

                                <OutlinedInput
                                    id="outlined-adornment-password"
                                    type={
                                        showConfirmPassword
                                            ? "text"
                                            : "password"
                                    }
                                    endAdornment={
                                        <InputAdornment position="end">
                                            <IconButton
                                                aria-label="toggle password visibility"
                                                onClick={
                                                    handleClickShowConfirmPassword
                                                }
                                                onMouseDown={
                                                    handleMouseDownConfirmPassword
                                                }
                                                edge="end"
                                            >
                                                {showConfirmPassword ? (
                                                    <VisibilityOffIcon />
                                                ) : (
                                                    <RemoveRedEyeIcon />
                                                )}
                                            </IconButton>
                                        </InputAdornment>
                                    }
                                    required
                                    fullWidth
                                    name="passwordConfirm"
                                    onBlur={handleBlur("passwordConfirm")}
                                    value={values.passwordConfirm}
                                    onChange={handleChange("passwordConfirm")}
                                    autoComplete="current-passwordConfirm"
                                    sx={{ margin: " 0 0 0.5rem 0" }}
                                />
                                {errors.passwordConfirm &&
                                touched.passwordConfirm ? (
                                    <>
                                        <Typography
                                            color={"error"}
                                            variant="subtitle1"
                                        >
                                            {errors.passwordConfirm}
                                        </Typography>
                                    </>
                                ) : null}

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    sx={{ width: "100%" }}
                                    size="medium"
                                    onClick={() => {
                                        handleSubmit();
                                    }}
                                >
                                    Realizar Cadastro
                                </Button>

                                <Typography variant="body1" gutterBottom>
                                    Fazer Login?{" "}
                                    <Link href={"login"}>Clique aqui!</Link>
                                </Typography>
                            </>
                        )}
                    </Formik>
                </ThemeProvider>
            </Container>
            <Notify />
        </>
    );
}
