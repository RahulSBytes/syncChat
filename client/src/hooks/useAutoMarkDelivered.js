// hooks/useAutoMarkDelivered.js

import { useEffect } from "react";
import axios from "axios";
import { server } from "../constants/config";

export function useAutoMarkDelivered(chatId) {
  useEffect(() => {
    if (!chatId) return;

    const markDelivered = async () => {
      try {
        await axios.put(
          `${server}/api/v1/chats/delivered/${chatId}`,
          {},
          { withCredentials: true }
        ); 
      } catch (error) {
        // Silent fail - not critical
        console.error("Mark delivered error:", error);
      }
    };

    // Mark as delivered after messages load
    const timer = setTimeout(markDelivered, 500);
    return () => clearTimeout(timer);
  }, [chatId]);
}