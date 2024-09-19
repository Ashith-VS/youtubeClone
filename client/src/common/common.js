import { io } from "socket.io-client";
import { baseUrl } from "../http/apiConfig";

export const socket =io(baseUrl)