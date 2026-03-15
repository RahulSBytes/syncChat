import { createContext, useContext, useMemo, useEffect } from "react";
import { io } from "socket.io-client";

const server = import.meta.env.VITE_SERVER || "http://localhost:8080";

const SocketContext = createContext();

const getSocket = () => useContext(SocketContext);

const SocketProvider = ({ children }) => {
  const socket = useMemo(() => {
   
    return io(server, {
      withCredentials: true,
    });
  }, []);

  // useEffect(() => {
  //   socket.on("connect", () => {
  //     console.log("✅ Socket connected:", socket.id);
  //   });

  //   socket.on("connect_error", (error) => {
  //     console.error("❌ Socket connection error:", error.message);
  //     console.error("Server URL:", server);
  //   });

  //   socket.on("disconnect", (reason) => {
  //     console.log("❌ Socket disconnected:", reason);
  //   });

  //   return () => {
  //     socket.off("connect");
  //     socket.off("connect_error");
  //     socket.off("disconnect");
  //   };
  // }, [socket]);

  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
};

export { SocketProvider, getSocket };