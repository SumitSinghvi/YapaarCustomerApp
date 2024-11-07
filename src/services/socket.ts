import AsyncStorage from "@react-native-async-storage/async-storage";
import { io, Socket } from "socket.io-client";
import store from "../providers/store";
import { logout } from "../slices/authSlice";

let socket: Socket | null = null;

export const initializeSocket = async () => {
  const token = await AsyncStorage.getItem("token");
  if (!token) {
    return null;
  }
  socket = io(`${process.env.EXPO_PUBLIC_BACKEND_URL_WS}`);
  console.log("Connecting to socket...");
  socket.emit("authenticate", token);
  socket.on("authenticated", (data: any) => {
    console.log("Authenticated as: ", data);
  });
  socket.on("unauthorized", (msg: string) => {
    console.log("Socket unauthorized:", msg);
    store.dispatch(logout());
  });
};

export const getSocket = (): Socket => {
  if (!socket) {
    throw new Error("Socket is not initialized");
  }
  return socket;
};
