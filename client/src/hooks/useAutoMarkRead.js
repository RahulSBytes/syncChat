// hooks/useAutoMarkRead.js
import { useEffect, useRef } from 'react';
import axios from 'axios';
import { server } from '../constants/config.js';

export function useAutoMarkRead(chatId, isVisible) {
  const hasMarkedRef = useRef(false);

  useEffect(() => {
    if (!chatId || !isVisible) return;

    const markRead = async () => {
      if (hasMarkedRef.current) return;
      
      try {
        await axios.put(
          `${server}/api/v1/chats/read/${chatId}`,
          {},
          { withCredentials: true }
        );
        hasMarkedRef.current = true;
      } catch (error) {
        console.error('Error marking read:', error);
      }
    };

    markRead();

    // Reset when chatId changes
    return () => {
      hasMarkedRef.current = false;
    };
  }, [chatId, isVisible]);
}