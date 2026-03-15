import { createBrowserRouter, RouterProvider, Route, createRoutesFromElements } from "react-router-dom";
import { lazy, Suspense, useEffect} from "react";
import Home from "./components/Home";
import ProtectRoute from "./components/auth/protectRoute.jsx";
import Chats from "./components/Chats";
import { server } from './constants/config.js'
import { Toaster } from "react-hot-toast";
import axios from "axios";
import { useAuthStore } from "./store/authStore.js";
import AdminLayout from "./components/admin/AdminLayout.jsx";
import { SocketProvider } from "./context/SocketContext.jsx";
import ResponsiveLayout from "./components/layout/ResponsiveLayout.jsx";
import GlobalSocketHandler from "./components/minicomponents/GlobalSocketHandler.jsx";
import SocketHandler from "./components/minicomponents/SocketHandler.jsx";
import Settings from "./components/settings/Settings.jsx";

const Signup = lazy(() => import("./components/Signup.jsx"));
const Login = lazy(() => import("./components/layout/Login.jsx"));
const NotFound = lazy(() => import("./components/NotFound"));
const Dashboard = lazy(() => import("./components/admin/Dashboard"));
const UserManagement = lazy(() => import("./components/admin/UserManagement"));
const ChatManagement = lazy(() => import("./components/admin/ChatManagement"));
const MessagesManagement = lazy(() => import("./components/admin/MessagesManagement"));


const ProfileTab = lazy(() => import("./components/settings/tabs/ProfileTab"));
const AppearanceTab = lazy(() => import("./components/settings/tabs/AppearanceTab"));
const PrivacyTab = lazy(() => import("./components/settings/tabs/PrivacyTab"));
const GeneralTab = lazy(() => import("./components/settings/tabs/GeneralTab"));


const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/">
      {/* Main app routes with responsive layout */}
      <Route element={<ProtectRoute><ResponsiveLayout /></ProtectRoute>}>
        <Route index element={<Home />} />
        <Route path="chats/:id" element={<Chats />} />
      </Route>

      <Route path="/settings" element={<Settings />}>
        <Route index element={<ProfileTab />} />
        <Route path="profile" element={<ProfileTab />} />
        <Route path="appearance" element={<AppearanceTab />} />
        <Route path="privacy" element={<PrivacyTab />} />
        <Route path="general" element={<GeneralTab />} />
      </Route>

      {/* Auth routes */}
      <Route path="/auth">
        <Route path="login" element={<Login />} />
        <Route path="signup" element={<Signup />} />
      </Route>

      {/* Admin routes */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="chats" element={<ChatManagement />} />
        <Route path="messages" element={<MessagesManagement />} />
        <Route path="users" element={<UserManagement />} />
      </Route>

      <Route path="*" element={<NotFound />} />
    </Route>
  )
);



function App() {
  const { userNotExists, userExists } = useAuthStore();


  useEffect(() => {
    axios.get(`${server}/api/v1/users/getmyprofile`, { withCredentials: true })
      .then(({ data }) => userExists(data.data))
      .catch(() => userNotExists());
  }, [userExists, userNotExists]);



  return (
    <SocketProvider>
      <SocketHandler />
      <GlobalSocketHandler />  
      <RouterProvider router={router} />
      <Toaster position="bottom-center" />
    </SocketProvider>
  );
}

export default App;