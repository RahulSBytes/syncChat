import { create } from "zustand";

export const useAuthStore = create((set) => ({ // just an object that contains variable and a coresponding function to alter its value
  user: null,
  isLoggedIn: false,
  setUser: (user) => set({ user, isLoggedIn: true }),
  logout: () => set({ user: null, isLoggedIn: false }),
}));

export const useChatsStore = create((set) => ({ 
  chats: [],
  selectedChatId: null,

  setChats: (chats) => set({ chats }),
  selectChat: (chatId) => set({ selectedChatId: chatId }),
}));


export const useMessagesStore = create((set) => ({
  messages: [],

  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({ messages: [...state.messages, message] })),
  clearMessages: () => set({ messages: [] }),
}));


export const useUIStore = create((set) => ({
  isGroupIconClicked: false,
  setIsGroupIconClicked : ()=>set((state) => ({ isGroupIconClicked: !state.isGroupIconClicked })),
  isNewGroupClicked: false,
  setIsNewGroupClicked :()=>set((state) => ({ isNewGroupClicked: !state.isNewGroupClicked })),
  isSearchPeopleClicked: false,
  setIsSearchPeopleClicked :()=>set((state) => ({ isSearchPeopleClicked: !state.isSearchPeopleClicked })),
  isNotificationClicked: false,
  setIsNotificationClicked :()=>set((state) => ({ isNotificationClicked: !state.isNotificationClicked })),
}));


/* 

useAuthStore → Keeps track of the logged‑in user and authentication status (who you are).

"hum user ka status change kerdenge yahan aa ke as per wo login hai ya nahi"

useChatsStore → Manages the list of chats (1:1 or groups) and the currently selected chat.

useMessagesStore → Holds the messages for the active chat and updates when new messages are sent/received.

useUIStore → Controls UI state like sidebar open/close, modals, or other interface toggles.

*/
