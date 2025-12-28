import { serverUrl } from "@/config/config";
import axios from "axios";

export const api = axios.create({
    baseURL: `${serverUrl}`,
    withCredentials: true,
});