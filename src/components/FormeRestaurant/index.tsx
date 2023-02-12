import { storage } from "@/services/firebase";
import { Button, Grid, TextField, Typography } from "@mui/material";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import createValidator from "class-validator-formik";
import { getCookie } from "cookies-next";
import { getDownloadURL, ref, uploadBytesResumable } from "firebase/storage";
import { Formik } from "formik";
import { useRouter } from "next/router";
import { useState } from "react";
import { api } from "../../services/apí";
import { CreateAddressDTO } from "../../validators/Address";
import { CreateRestaurantDTO } from "../../validators/Restaurant";
import { Notify, notifyError, notifyInfo, notifySuccess } from "../Notify";

export const FormeRestaurant = (handleClose: any) => {
    const [address, setAddress] = useState<CreateAddressDTO>();
    const [isForm, setIsForm] = useState(true);
    const [percent, setPercent] = useState(0);
    const [logo, setLogo] = useState<string>();
    const router = useRouter();

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

    return (
<></>
    );
};
