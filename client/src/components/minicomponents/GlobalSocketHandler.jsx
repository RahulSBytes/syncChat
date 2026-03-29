import { getSocket } from "../../context/SocketContext";
import  useSocketEvents  from "../../hooks/useSocketEvents";
import { useChatStore } from "../../store/chatStore";
import { useApiStore } from "../../store/apiStore";
import { useAuthStore } from "../../store/authStore";
import axios from "axios";
import { server } from "../../constants/config";
import {
  NEW_MESSAGE,
  MESSAGE_DELIVERED,
  MESSAGE_READ,
  UNREAD_COUNT_UPDATED,
  REFETCH_CHATS,
  MESSAGE_DELETED,
  UPDATE_LAST_MESSAGE,
  UPDATE_CHAT,
} from "../../constants/events";

function GlobalSocketHandler() {
  const socket = getSocket();
  const user = useAuthStore((state) => state.user);
  const currentSelectedChatId = useChatStore((state) => state.currentSelectedChatId);
  

  const { 
    addMessageFromSocket, 
    updateMessageStatuses, 
    
    updateMessageDeletionFromSocket,
    updateContactsList,
    fetchContact,
    incrementUnreadCount,  
    setUnreadCount,  
    updateChat,
  } = useApiStore();

  useSocketEvents(socket, {
    [NEW_MESSAGE]: async (data) => {
      
      const isMyMessage = data.sender._id === user?._id;
      const isCurrentChat = data.chat === currentSelectedChatId;
      
      
      if (!isMyMessage) {
        try {
         await axios.put(
            `${server}/api/v1/chats/delivered/${data.chat}`,
            {},
            { withCredentials: true }
          );
        } catch (err) {
          console.error("Mark delivered error:", err);
        }
      }
      
      if (isCurrentChat) {
        addMessageFromSocket(data);
        
        if (!isMyMessage) {
          setTimeout(() => {
            axios.put(
              `${server}/api/v1/chats/read/${data.chat}`,
              {},
              { withCredentials: true }
            ).catch(err => console.error("Mark read error:", err));
          }, 1000);
        }
      } else {
        // Message for different chat - increment unread
        if (!isMyMessage) {
          incrementUnreadCount(data.chat);
        }
      }
    },

    [MESSAGE_DELIVERED]: ({ messageIds}) => {
      updateMessageStatuses(messageIds, "delivered");
    },

    [MESSAGE_READ]: ({ messageIds }) => {
      updateMessageStatuses(messageIds, "read");
    },

  [UNREAD_COUNT_UPDATED]: ({ chatId, unreadCount, increment }) => {
      console.log("🔢 UNREAD_COUNT_UPDATED:", { chatId, unreadCount, increment });
      
      if (increment) {
        incrementUnreadCount(chatId);
      } else {
        setUnreadCount(chatId, unreadCount);
      }
    },

    [REFETCH_CHATS]: () => {
      fetchContact();
    },

    [MESSAGE_DELETED]: (data) => {
      updateMessageDeletionFromSocket(data[0]);
    },

    [UPDATE_LAST_MESSAGE]: (data) => {
      updateContactsList(data);
    },

    [UPDATE_CHAT]: (data) => {
      updateChat(data);
    },
  });

  return null;
}

export default GlobalSocketHandler;