import { useEffect } from "react";
import { getSocket } from "../../context/SocketContext";
import axios from "axios";
import { server } from "../../constants/config";

function SocketHandler() {
  const socket = getSocket();

  useEffect(() => {
    const handleConnect = () => {
      axios.put(
        `${server}/api/v1/chats/mark-all-delivered`,
        {},
        { withCredentials: true }
      )
      .catch(err => {
        console.error("Mark all delivered error:", err.response?.data || err.message);
      });
    };

    socket.on("connect", handleConnect);

    if (socket.connected) {
      handleConnect();
    }

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [socket]);

  return null;
}

export default SocketHandler;