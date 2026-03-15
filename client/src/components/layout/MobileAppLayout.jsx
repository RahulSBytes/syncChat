import UsersList from "../UsersList.jsx";
import Profile from './Profile.jsx';
import MobileNavbar from "./MobileNavbar.jsx";
import { useUIStore } from "../../store/store.js";
import CreateGroupForm from "../CreateGroupForm.jsx";
import FindDialog from "../FindDialog.jsx";
import Notification from "../Notification.jsx";
import { Outlet, useParams } from "react-router-dom";
import { useChatStore } from "../../store/chatStore.js";
import { useState } from "react";
import useSocketEvents from "../../hooks/useSocketEvents.js";
import { getSocket } from "../../context/SocketContext.jsx";
import { ONLINE_USERS } from "../../constants/events.js";
import { useAuthStore } from "../../store/authStore.js";

export default function MobileAppLayout() {
  const user = useAuthStore((state) => state.user);
  const { isNewGroupClicked, isSearchPeopleClicked, isNotificationClicked } = useUIStore();
  const currentSelectedChatId = useChatStore((state) => state.currentSelectedChatId);
  const socket = getSocket();

  const { id: chatId } = useParams();

  console.log("currently loggedin user ::", user.username, user._id);

  const [onlineUsers, setOnlineUsers] = useState([]);

  useSocketEvents(socket, {
    [ONLINE_USERS]: (userIds) => {
      setOnlineUsers(userIds);
    }
  });

  return (
    <div className="h-screen flex flex-col overflow-hidden">
      {/* Modals - same as desktop */}
      {isNewGroupClicked && <CreateGroupForm />}
      {isSearchPeopleClicked && <FindDialog />}
      {isNotificationClicked && <Notification />}

      {!chatId && (
        <div className="">
          <UsersList onlineUsers={onlineUsers}/>
        </div>
      )}
      
      {chatId && (
        <div className="flex-1 bg-[#212121] overflow-hidden">
          <Outlet context={{ onlineUsers }} />
        </div>
      )}
    </div>
  );
}