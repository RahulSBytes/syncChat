// store/usePreferencesStore.js
import { create } from "zustand";
import { persist } from "zustand/middleware";
import axios from "axios";
import { apiRequest } from "../helpers/helpers.js";
import { server } from "../constants/config";
import { useAuthStore } from "./authStore"; // ✅ ADD THIS IMPORT
import { useChatStore } from "./chatStore";

const usePreferencesStore = create(
  persist(
    (set, get) => ({
      preferences: null,

      // Update password
      updatePassword: async (passwordData) => {
        const [data, error] = await apiRequest(
          axios.patch(`${server}/api/v1/preferences/password`, passwordData, {
            withCredentials: true,
          })
        );

        if (error) {
          return {
            success: false,
            message:
              error?.response?.data?.message || "Failed to update password",
          };
        }

        return {
          success: true,
          message: data.message || "Password updated successfully",
        };
      },

      fetchPreferences: async () => {
        const [data, error] = await apiRequest(
          axios.get(`${server}/api/v1/preferences`, {
            withCredentials: true,
          })
        );

        if (error) return false;

        set({ preferences: data.preferences });

        // Apply settings only if they exist
        if (data?.preferences) {
          // Apply theme
          if (data.preferences.appearance?.theme) {
            document.documentElement.classList.toggle(
              "dark",
              data.preferences.appearance.theme === "dark"
            );
          }

          // Apply font size
          if (data.preferences.appearance?.fontSize) {
            document.documentElement.style.setProperty(
              "--font-size",
              data.preferences.appearance.fontSize
            );
          }

          // ✅ FIX: Use data.preferences.accentColor instead of settings
          if (data.preferences.accentColor) {
            document.documentElement.style.setProperty(
              "--accent-color",
              data.preferences.accentColor
            );
          }
        }

        return true;
      },

      // Update appearance
      updateAppearance: async (settings) => {
        const [data, error] = await apiRequest(
          axios.patch(`${server}/api/v1/preferences/appearance`, settings, {
            withCredentials: true,
          })
        );

        if (error) return false;

        set((state) => ({
          preferences: {
            ...state.preferences,
            appearance: { ...state.preferences.appearance, ...settings },
          },
        }));

        if (settings.theme) {
          // ✅ Update darkMode in chatStore
          const isDark = settings.theme === "dark";
          useChatStore.getState().setDarkMode(isDark);

          // ✅ Update DOM
          document.documentElement.classList.toggle("dark", isDark);
        }

        if (settings.fontSize) {
          document.documentElement.style.setProperty(
            "--font-size",
            settings.fontSize
          );
        }

        return true;
      },

      updateProfile: async (settings) => {
        try {
          const formData = new FormData();

          // Add text fields if they exist in settings
          if (settings.fullName) formData.append("fullName", settings.fullName);
          if (settings.username) formData.append("username", settings.username);
          if (settings.bio !== undefined) formData.append("bio", settings.bio);
          if (settings.email) formData.append("email", settings.email);

          // Add avatar file if it's a File object
          if (settings.avatar instanceof File) {
            formData.append("avatar", settings.avatar);
          }

          // Make API call
          const { data } = await axios.patch(
            `${server}/api/v1/preferences/profile`,
            formData,
            {
              withCredentials: true,
              headers: { "Content-Type": "multipart/form-data" },
            }
          );

          if (data.success) {
            // Update preferences store
            set((state) => ({
              preferences: {
                ...state.preferences,
                fullName: data.user.fullName,
                username: data.user.username,
                bio: data.user.bio,
                email: data.user.email,
                avatar: data.user.avatar,
              },
            }));

            // ✅ Use the new updateUser method
            useAuthStore.getState().updateUser(data.user);

            return true;
          }

          return false;
        } catch (error) {
          console.error("Update profile error:", error);
          return false;
        }
      },

      // Update privacy
      updatePrivacy: async (settings) => {
        const [data, error] = await apiRequest(
          axios.patch(`${server}/api/v1/preferences/privacy`, settings, {
            withCredentials: true,
          })
        );

        if (error) return false;

        set((state) => ({
          preferences: {
            ...state.preferences,
            privacy: { ...state.preferences.privacy, ...settings },
          },
        }));

        return true;
      },

      // Update general settings
      updateGeneralSettings: async (settings) => {
        const [data, error] = await apiRequest(
          axios.patch(`${server}/api/v1/preferences/general`, settings, {
            withCredentials: true,
          })
        );

        if (error) return false;

        set((state) => ({
          preferences: {
            ...state.preferences,
            ...settings,
          },
        }));

        // Apply accent color if changed
        if (settings.accentColor) {
          document.documentElement.style.setProperty(
            "--accent-color",
            settings.accentColor
          );
        }

        return true;
      },

      // Toggle single setting
      toggleSetting: async (key, value) => {
        const [data, error] = await apiRequest(
          axios.patch(
            `${server}/api/v1/preferences/toggle`,
            { [key]: value },
            {
              withCredentials: true,
            }
          )
        );

        if (error) return false;

        set((state) => ({
          preferences: {
            ...state.preferences,
            [key]: value,
          },
        }));

        return true;
      },

      // Reset to defaults
      resetPreferences: async () => {
        const [data, error] = await apiRequest(
          axios.post(`${server}/api/v1/preferences/reset`, null, {
            withCredentials: true,
          })
        );

        if (error) return false;

        set({ preferences: data.preferences });

        // Reapply defaults
        document.documentElement.classList.toggle(
          "dark",
          data.preferences.appearance.theme === "dark"
        );
        document.documentElement.style.setProperty("--font-size", "medium");
        document.documentElement.style.setProperty("--accent-color", "#0084ff");
        document.documentElement.style.setProperty("--chat-wallpaper", "none");

        return true;
      },

      // ===== HELPER METHODS =====

      getPreference: (key) => {
        const prefs = get().preferences;
        if (!prefs) return null;

        // Handle nested keys like 'appearance.theme'
        const keys = key.split(".");
        let value = prefs;
        for (const k of keys) {
          value = value?.[k];
        }
        return value;
      },

      isFeatureEnabled: (feature) => {
        return get().preferences?.[feature] === true;
      },
    }),
    {
      name: "user-preferences",
      partialize: (state) => ({
        preferences: state.preferences,
      }),
    }
  )
);

export default usePreferencesStore;
