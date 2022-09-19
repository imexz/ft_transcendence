import socketio from "socket.io-client";
import { hostURL } from "../models/host"

export const socket = socketio.connect(hostURL + ":3000");
export const SocketContext = React.createContext();