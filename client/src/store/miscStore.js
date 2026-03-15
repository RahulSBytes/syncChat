import { create } from "zustand";

export const useMiscStore = create((set) => ({
  isNewGroup: false,
  isAddMember: false,
  isNotification: false,
  isMobile: false,
  isSearch: false,
  isFileMenu: false,
  isDeleteMenu: false,
  uploadingLoader: false,
  selectedDeleteChat: {
    chatId: "",
    groupChat: false,
  },

  setIsNewGroup: (val) => set({ isNewGroup: val }),
  setIsAddMember: (val) => set({ isAddMember: val }),
  setIsNotification: (val) => set({ isNotification: val }),
  setIsMobile: (val) => set({ isMobile: val }),
  setIsSearch: (val) => set({ isSearch: val }),
  setIsFileMenu: (val) => set({ isFileMenu: val }),
  setIsDeleteMenu: (val) => set({ isDeleteMenu: val }),
  setUploadingLoader: (val) => set({ uploadingLoader: val }),
  setSelectedDeleteChat: (chat) => set({ selectedDeleteChat: chat }),
}));
