import { Bell, LogOut, Moon, Plus, Settings, Sun, UserRoundSearch, Users } from 'lucide-react'
import { useUIStore } from '../../store/store.js'
import '../../index.css'
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore.js';
import toast from 'react-hot-toast';
import { useApiStore } from '../../store/apiStore.js';
import { useChatStore } from '../../store/chatStore.js';


function Navbar() {

  const logout = useAuthStore((state) => state.logout)
  const navigate = useNavigate()

  const darkMode = useChatStore((state) => state.darkMode);
  const toggleDarkMode = useChatStore((state) => state.toggleDarkMode);

  const user = useAuthStore(state => state.user)

  async function logoutHandler() {
    const success = await logout();
    if (!success) return toast.error("failed logging out")
    toast.success("logged out successfully")
    navigate('/auth/login')
  }

  const { setIsNewGroupClicked, setIsSearchPeopleClicked, setIsNotificationClicked } = useUIStore();
  const totalUnread = useApiStore((state) => state.totalUnread);

  return (
    <nav className="hidden md:flex flex-col items-center justify-end  bg-surface dark:bg-surface-dark w-16 pb-6 ">
      <div className='flex items-center flex-col flex-1 justify-start gap-[6vh] mt-8'>
        <img src={user.avatar.url} className='h-10 w-10 rounded-full border  border-muted dark:border-muted-dark ' />

        <span onClick={setIsSearchPeopleClicked} data-tip="find user" className='tooltip-sm tooltip tooltip-right  text-muted dark:text-muted-dark hover:text-accent dark:hover:text-accent cursor-pointer'><UserRoundSearch size={22} strokeWidth={2.5} /></span>

        <span onClick={setIsNewGroupClicked} data-tip="new group" className='tooltip-sm tooltip tooltip-right text-muted dark:text-muted-dark dark:hover:text-accent   hover:text-accent cursor-pointer'><Plus size={22} strokeWidth={2.5} /></span>
        <span data-tip="change theme" onClick={toggleDarkMode} className='tooltip-sm tooltip tooltip-right text-muted dark:text-muted-dark dark:hover:text-accent   hover:text-accent cursor-pointer'>{darkMode ? <Sun size={22} strokeWidth={2.5} /> : <Moon size={22} strokeWidth={2.5} />}</span>
        <div onClick={setIsNotificationClicked} data-tip="notifications" className="tooltip-sm tooltip tooltip-right text-muted dark:text-muted-dark indicator relative hover:text-accent  dark:hover:text-accent  cursor-pointer">
          <Bell size={22} strokeWidth={2.5} className='  text-muted dark:text-muted-dark hover:text-accent dark:hover:text-accent ' />
          {totalUnread > 0 && <span className="badge badge-xs badge-primary bg-[#248F60] indicator-item  absolute top-1 right-1">
            {totalUnread > 99 ? "99+" : totalUnread}
          </span>}
        </div>

        <span onClick={logoutHandler} data-tip="logout" className='tooltip-sm tooltip tooltip-right  text-muted dark:text-muted-dark hover:text-accent dark:hover:text-accent cursor-pointer'><LogOut size={22} strokeWidth={2.5} /></span>
      </div>

      <Settings onClick={() => navigate('/settings')} strokeWidth={2} size={30} className='text-muted dark:text-muted-dark hover:text-accent dark:hover:text-accent  hover:animate-pulse' />
    </nav>
  )
}

export default Navbar