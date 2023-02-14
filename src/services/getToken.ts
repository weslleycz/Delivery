import { verify } from "jsonwebtoken";
import { JWT } from "../types/JWT";

export const getToken = (token: string) => {
    if (process.env.TOKEN_KAY) {
        const jsonJWT = <string>token;
        const { data } = <JWT>JSON.parse(jsonJWT);
        return data
    }
}