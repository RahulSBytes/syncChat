import { Bell, LogOut, Menu,X } from 'lucide-react'
import { useChatStore } from '../../store/chatStore.js'
import { useUIStore } from '../../store/store.js'
import { useAuthStore } from '../../store/authStore.js'
import { useApiStore } from '../../store/apiStore.js';

import { useNavigate } from 'react-router-dom'

function MobileHeader({ user }) {

    const { setIsNewGroupClicked, setIsSearchPeopleClicked, setIsNotificationClicked } = useUIStore();
    const logout = useAuthStore((state) => state.logout)
    const totalUnread = useApiStore((state) => state.totalUnread);
    const toggleDarkMode = useChatStore(state => state.toggleDarkMode)
    const navigate = useNavigate()


    async function logoutHandler() {
        const success = await logout();
        if (!success) return toast.error("failed logging out")
        toast.success("logged out successfully")
        navigate('/auth/login')
    }


    const navigations = [
        { label: "Change Theme", onClickHandler: toggleDarkMode },
        { label: "Find People", onClickHandler: setIsSearchPeopleClicked },
        { label: "Create New Group", onClickHandler: setIsNewGroupClicked },
        { label: "Settings", onClickHandler: (e) => { e.stopPropagation(); navigate('/settings') } },
        { label: "Switch To Admin", onClickHandler: () => { return } },
    ]


    return (
        <div className="cursor-pointer flex mb-6 gap-1">
            <div className="flex justify-between w-full ml-5">

                <label htmlFor="my-drawer-4" className="drawer-button md:hidden text-secondary dark:text-secondary-dark">
                    <Menu className='hover:text-accent dark:hover:text-accent' />
                </label>
                <div onClick={setIsNotificationClicked} className="md:hidden  indicator relative hover:text-accent  dark:hover:text-accent  cursor-pointer">
                    <Bell size={22} strokeWidth={2.5} className='  text-secondary dark:text-secondary-dark hover:text-accent dark:hover:text-accent ' />
                    {totalUnread > 0 && <span className="badge badge-xs badge-primary bg-[#248F60] indicator-item  absolute top-1 right-1">
                        {totalUnread > 99 ? "99+" : totalUnread}
                    </span>}
                </div>
            </div>

            {/* Mobile drawer content */}
            <div className="drawer-content ml-auto md:hidden">
                <div className="drawer drawer-end flex justify-end w-6">
                    <input id="my-drawer-4" type="checkbox" className="drawer-toggle" />
                    <div className="drawer-side">
                        <label htmlFor="my-drawer-4" aria-label="close sidebar" className="drawer-overlay"></label>
                        <div className="menu bg-[#faf8f0] dark:bg-surface-dark text-base-content min-h-full w-80 p-4 px-8 max-w-full">
                            <div className="flex flex-col">
                                <label htmlFor="my-drawer-4" className="drawer-button self-end mb-6 p-2">
                                    <X strokeWidth={2} />
                                </label>
                                <div className="mb-8 flex flex-col items-center gap-1">
                                    <img src="/image.png" className="h-16 w-16 rounded-full border-[1px] border-muted dark:border-muted-dark" />
                                    <h4 className="font-semibold text-lg text-primary dark:text-primary-dark">{user.fullName}</h4>
                                    <p className="text-center text-sm text-secondary dark:text-secondary-dark ">{user.username}</p>
                                    <p className="px-4 text-center text-xs text-muted dark:text-muted-dark">
                                        {user.bio}
                                    </p>
                                </div>
                                <ul>
                                    {navigations.map((el, idx) =>
                                        <label onClick={el.onClickHandler} key={idx} htmlFor="my-drawer-4" className="drawer-button">
                                            <li className="py-3 w-full pl-3 hover:bg-surface dark:hover:bg-searchbar-dark text-secondary dark:text-secondary-dark">{el.label}</li>
                                        </label>
                                    )}
                                    <button
                                        onClick={logoutHandler}
                                        className="absolute left-1/2 -translate-x-1/2 bottom-2 w-11/12 bg-red-600/10 hover:bg-red-600/20 text-red-500 p-3 rounded-lg transition-colors flex items-center justify-center gap-2 font-medium"
                                    >
                                        <LogOut size={20} />
                                        Logout
                                    </button>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default MobileHeader