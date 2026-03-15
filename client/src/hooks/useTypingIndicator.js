import { useState, useRef, useCallback } from 'react';
import { getSocket } from '../context/SocketContext.jsx';
import { START_TYPING, STOP_TYPING } from '../constants/events.js';
import { useEffect } from 'react';

export const useTypingIndicator = (chatId, members) => {
  const socket = getSocket();
  const [isTyping, setIsTyping] = useState(false);
  const typingTimeoutRef = useRef(null);



  // ✅ Start typing (with debounce)
  const startTyping = useCallback(() => {
    if (!isTyping) {
      setIsTyping(true);
      socket.emit(START_TYPING, { chatId, members });
    }

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Auto-stop after 3 seconds of inactivity
    typingTimeoutRef.current = setTimeout(() => {
      stopTyping();
    }, 2000);
  }, [isTyping, chatId, members, socket]);



  // ✅ Stop typing
  const stopTyping = useCallback(() => {
    if (isTyping) {
      setIsTyping(false);
      socket.emit(STOP_TYPING, { chatId, members });
    }

    // Clear timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
      typingTimeoutRef.current = null;
    }
  }, [isTyping, chatId, members, socket]);

  // ✅ Cleanup on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
      if (isTyping) {
        socket.emit(STOP_TYPING, { chatId, members });
      }
    };
  }, []);

  return { startTyping, stopTyping };
};