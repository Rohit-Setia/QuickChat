import { io } from "socket.io-client";
const backendUrl = import.meta.env.VITE_BACKEND_URL;
const baseUrl = backendUrl.replace(/\/api$/, "");

const socket = io(`${baseUrl}`, {
  autoConnect: false,
});

export default socket;
