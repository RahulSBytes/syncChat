import UsersList from "../UsersList.jsx";
import Profile from './Profile.jsx'
import Navbar from "./Navbar.jsx";
import { useUIStore } from "../../store/store.js";
import CreateGroupForm from "../CreateGroupForm.jsx";
import FindDialog from "../FindDialog.jsx";
import Notification from "../Notification.jsx";
import { Outlet, useLocation } from "react-router-dom";
import { useChatStore } from "../../store/chatStore.js";
import { useEffect, useState } from "react";
import useSocketEvents from "../../hooks/useSocketEvents.js";
import { getSocket } from "../../context/SocketContext.jsx";
import { ONLINE_USERS } from "../../constants/events.js";
import { useAuthStore } from "../../store/authStore.js";
import usePreferencesStore from "../../store/usePreferencesStore.js";
// import { set } from "mongoose";

export default function AppLayout() {

  const user = useAuthStore((state) => state.user)
  const { isNewGroupClicked, isSearchPeopleClicked, isNotificationClicked } = useUIStore();
  const preferences = usePreferencesStore(state => state.preferences)
  const currentSelectedChatId = useChatStore((state) => state.currentSelectedChatId)
  const socket = getSocket()

  const location = useLocation()

  const isHomePage = location.pathname === '/';
  const [onlineUsers, setOnlineUsers] = useState([]);

  // App.jsx
  useEffect(() => {
    if (preferences?.accentColor) {
      document.documentElement.style.setProperty('--accent-color', preferences.accentColor);
    }
  }, [preferences?.accentColor]);

  useSocketEvents(socket, {
    [ONLINE_USERS]: (userIds) => {
      setOnlineUsers(userIds)
    }
  })



  return (<div>

    <div className="h-screen flex overflow-hidden">
      {
        isNewGroupClicked && <CreateGroupForm />
      }
      {
        isSearchPeopleClicked && <FindDialog />
      }
      {
        isNotificationClicked && <Notification />
      }



      <Navbar />
      {/* User List */}
      <div className="hidden md:flex w-[300px] bg-[#353535] h-full">
        <UsersList onlineUsers={onlineUsers} />
      </div>

      {/* Chat Section */}
      <div className="flex-1 min-w-0 bg-[#212121] h-full">
        <Outlet context={{ onlineUsers }} />
      </div>

      {/* Profile Details */}
      {currentSelectedChatId && !isHomePage && <div className="hidden lg:flex flex-[0_0_250px] max-w-[300px] h-full">
        <Profile />
      </div>}
    </div>
  </div>
  );
};