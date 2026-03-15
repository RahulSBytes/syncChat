import { create } from "zustand";
import axios from "axios";
import { server } from "../constants/config.js";
import { apiRequest } from "../helpers/helpers.js";
import { persist } from "zustand/middleware";

export const useApiStore = create(
  persist((set, get) => ({
    messagesRelatedToChat: [],

    fetchMessages: async (currentSelectedChatId) => {
      const [data, error] = await apiRequest(
        axios.get(`${server}/api/v1/chats/getmsgs/${currentSelectedChatId}`, {
          withCredentials: true,
        })
      );
      if (error) return false;
      set({ messagesRelatedToChat: data.chat });
      return true;
    },

    updateMessageDeletionFromSocket: (data) => {
      set((state) => ({
        messagesRelatedToChat: state.messagesRelatedToChat.map((msg) => {
          console.log(msg._id === data._id, msg._id, data._id);
          return msg._id === data._id ? data : msg;
        }),
      }));
    },

    addMessageFromSocket: (newMessage) => {
      console.log("newMessage ::", newMessage);
      const { messagesRelatedToChat } = get();
      if (messagesRelatedToChat.some((m) => m._id === newMessage._id)) return;
      set({ messagesRelatedToChat: [...messagesRelatedToChat, newMessage] });
    },

    contacts: [],

    // ######## count related methods

    unreadCounts: {},
    totalUnread: 0,

    setUnreadCounts: (unreadCounts, totalUnread) => {
      set({ unreadCounts, totalUnread });
    },

    setUnreadCount: (chatId, count) => {
      set((state) => {
        const newCounts = { ...state.unreadCounts, [chatId]: count };
        const total = Object.values(newCounts).reduce((sum, c) => sum + c, 0);

        return {
          unreadCounts: newCounts,
          totalUnread: total,
        };
      });
    },

    incrementUnreadCount: (chatId) => {
      set((state) => {
        const currentCount = state.unreadCounts[chatId] || 0;
        const newCount = currentCount + 1;

        return {
          unreadCounts: {
            ...state.unreadCounts,
            [chatId]: newCount,
          },
          totalUnread: state.totalUnread + 1,
        };
      });
    },

    resetUnreadCount: (chatId) => {
      set((state) => {
        const oldCount = state.unreadCounts[chatId] || 0;

        return {
          unreadCounts: {
            ...state.unreadCounts,
            [chatId]: 0,
          },
          totalUnread: Math.max(0, state.totalUnread - oldCount),
        };
      });
    },

    // ######## count related methods

    fetchContact: async () => {
console.log("fetching contacts")

      const [data, error] = await apiRequest(
        axios.get(`${server}/api/v1/chats`, { withCredentials: true })
      );
      if (error) return false;
      set({ contacts: data.chats });
      return true;
    },

    updateContactsList: (data) => {
      set((state) => ({
        contacts: state.contacts.map((contact) =>
          data.chatId == contact._id
            ? { ...contact, lastMessage: data.lastMessageObj }
            : contact
        ),
      }));
    },

    newContactAdded: (data) => {
      set((state) => ({
        contacts: state.contacts.push(data),
      }));
    },

    updateChat: (updatedChat) => {
      set((state) => ({
        contacts: state.contacts.map((chat) =>
          chat._id === updatedChat._id ? { ...chat, ...updatedChat } : chat
        ),
      }));
    },

    updateContactUnreadCount: (chatId, unreadCount) => {
      set((state) => ({
        contacts: state.contacts.map((contact) =>
          contact._id === chatId ? { ...contact, unreadCount } : contact
        ),
      }));
    },

    updateMessageStatuses: (messageIds, status) => {
      set((state) => ({
        messagesRelatedToChat: state.messagesRelatedToChat.map((msg) =>
          messageIds.includes(msg._id) ? { ...msg, status } : msg
        ),
      }));
    },

    removeMemberFromGroup: async (chatId, memberId) => {
      const [data, error] = await apiRequest(
        axios.patch(
          `${server}/api/v1/chats/removemember`,
          { chatId, memberId },
          { withCredentials: true }
        )
      );

      return error ? false : true;
    },

    addMemberInGroup: async (chatId, username) => {
      const [data, error] = await apiRequest(
        axios.patch(
          `${server}/api/v1/chats/addmember`,
          { chatId, username },
          { withCredentials: true }
        )
      );
      // console.log(error)
      return error ? false : true;
    },

    sendMessage: async (formData, currentSelectedChatId) => {
      const [data, error] = await apiRequest(
        axios.post(
          `${server}/api/v1/chats/sendMessage/${currentSelectedChatId}`,
          formData,
          { withCredentials: true }
        )
      );
      return error ? false : true;
    },

    createGroup: async (formData) => {
      const [data, error] = await apiRequest(
        axios.post(`${server}/api/v1/chats`, formData, {
          withCredentials: true,
        })
      );
      return error ? false : data;
    },

    handleInvite: async (userId) => {
      const [data, error] = await apiRequest(
        axios.post(
          `${server}/api/v1/users/sendfriendrequest?q=${userId}`,
          {},
          { withCredentials: true }
        )
      );
      console.log(data, error);
      return error ? false : true;
    },

    fetchUsersEligibleForInvitation: async (searchQuery) => {
      const controller = new AbortController();

      const [data, error] = await apiRequest(
        axios.get(`${server}/api/v1/chats/findUser`, {
          params: { q: searchQuery.trim() },
          withCredentials: true,
          signal: controller.signal,
        })
      );

      return error ? [] : data;
    },

    fetchNotifications: async () => {
      const [data, error] = await apiRequest(
        axios.get(`${server}/api/v1/users/notifications`, {
          withCredentials: true,
        })
      );
      return error ? [] : data.data;
    },

    handleFriendRequest: async (requestId, accept) => {
      const [data, error] = await apiRequest(
        axios.post(
          `${server}/api/v1/users/respondfriendrequest`,
          { requestId, accept },
          { withCredentials: true }
        )
      );

console.log("handleFriendRequest:: ", data, error)

      return error ? false : true;
    },

    leaveGroup: async (chatId, newCreatorId = null) => {
      const [data, error] = await apiRequest(
        axios.patch(
          `${server}/api/v1/chats/leavegroup`,
          { chatId, newCreatorId },
          { withCredentials: true }
        )
      );

      console.log("leaveGroup::", data, error);
      return error ? false : true;
    },
  }))
);
