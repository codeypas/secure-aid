import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";
import { tokenPayload } from "../types/types";

export const getToken = () => Cookies.get("token");

export const verifyToken = () => {
    const token = getToken();
    if (!token) return null;

    try {
        const decoded: tokenPayload = jwtDecode(token);
        return decoded;
    } catch (error) {
        console.error(error);
        return null;
    }
}