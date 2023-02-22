/* eslint-disable @next/next/no-img-element */
"use client";

import { ThemeProvider } from "@emotion/react";
import RemoveRedEyeIcon from "@mui/icons-material/RemoveRedEye";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import createValidator from "class-validator-formik";
import { setCookie } from "cookies-next";
import { Formik } from "formik";
import moment from "moment";
import Head from "next/head";
import { useRouter } from "next/router";
import { useState } from "react";
import { Notify, notifyError } from "../../../components/Notify";
import { api } from "../../../services/apí";
import { LoginUserDTO } from "../../../validators/User.dto";

import {
    Box,
    Button,
    Container,
    createTheme,
    Divider,
    IconButton,
    InputAdornment,
    InputLabel,
    Link,
    OutlinedInput,
    Typography,
} from "@mui/material";
import style from "./styles.module.scss";
import { theme } from "@/theme";

export default function Login() {
    type AxiosError = {
        response: { data: { name: string } };
    };

    const router = useRouter();

    const [showPassword, setShowPassword] = useState(false);

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    const handleMouseDownPassword = (event: any) => {
        event.preventDefault();
    };

    const { query } = useRouter();

    return (
        <>
            <Head>
                <meta name="theme-color" content={"#" + query.color} />
                <link rel="icon" href={"/favicon.ico"} />
                <title>Página de Login Adm</title>
            </Head>
            <Container maxWidth="xs" className={style["container-all"]}>
                <ThemeProvider
                    theme={theme}
                >
                    <Box
                        sx={{
                            justifyContent: "center",
                            display: "flex",
                            alignItems: "center",
                        }}
                    >
                        <img
                            src={"/favicon.ico"}
                            alt="Logo"
                            width={100}
                            height={100}
                        />
                    </Box>
                    <p>Use suas credenciais para realizar o login.</p>
                    <Formik
                        validate={createValidator(LoginUserDTO)}
                        initialValues={{ email: "", password: "" }}
                        onSubmit={async (values, { resetForm, setErrors }) => {
                            const { email, password } = values;
                            try {
                                const result = await api.post("/adm/login", {
                                    email,
                                    password,
                                });
                                setCookie("@tokenAdmin", result.data.token, {
                                    expires: new Date(
                                        moment().add(24, "hours").format()
                                    ),
                                });
                                router.push(`/admin/dashboard`);
                            } catch (error) {
                                const errorData = error as AxiosError;
                                setErrors({
                                    email: "Usuário não cadastrado",
                                });
                                notifyError("Usuário não cadastrado");
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
                                                    <RemoveRedEyeIcon />
                                                ) : (
                                                    <VisibilityOffIcon />
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
                                    Entrar
                                </Button>

                                <Typography variant="body1" gutterBottom>
                                    Esqueceu a senha?{" "}
                                    <Link href="/">Clique aqui!</Link>
                                </Typography>
                                <Divider
                                    sx={{
                                        border: `0.1rem solid ${
                                            "#" + query.color
                                        }`,
                                        width: "100%",
                                        margin: "1rem 0",
                                        background: "#" + query.color,
                                    }}
                                />
                                <Typography variant="body1" gutterBottom>
                                    Não tem conta?{" "}
                                    <Link href={"signup"}>Cadastrar-se</Link>
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
