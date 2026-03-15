// chatStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";

export const useChatStore = create(
  persist(
    (set, get) => ({
      // theme related
      darkMode: true,

      toggleDarkMode: () => set((state) => ({ darkMode: !state.darkMode })),

      setDarkMode: (value) => set({ darkMode: value }),

      // theme related

      notificationCount: 0,

      // onlineUsers : [],
      // setOnlineUsersId : (IdArr)=>{
      //   set({onlineUsers :})
      // },

      currentSelectedChatId: null,
      setCurrentSelectedChatId: (chatId) =>
        set({ currentSelectedChatId: chatId }),

      newMessagesAlert: [],

      incrementNotification: () =>
        set((state) => ({
          notificationCount: state.notificationCount + 1,
        })),

      resetNotificationCount: () => set({ notificationCount: 0 }),

      setNewMessagesAlert: ({ chatId }) =>
        set((state) => {
          const index = state.newMessagesAlert.findIndex(
            (item) => item.chatId === chatId
          );

          if (index !== -1) {
            const updated = [...state.newMessagesAlert];
            updated[index].count += 1;
            return { newMessagesAlert: updated };
          } else {
            return {
              newMessagesAlert: [
                ...state.newMessagesAlert,
                { chatId, count: 1 },
              ],
            };
          }
        }),

      removeNewMessagesAlert: (chatId) =>
        set((state) => ({
          newMessagesAlert: state.newMessagesAlert.filter(
            (item) => item.chatId !== chatId
          ),
        })),
    }),
    {
      name: "chat-storage",
      partialize: (state) => ({
        darkMode: state.darkMode,
        currentSelectedChatId: state.currentSelectedChatId,
      }),
    }
  )
);
