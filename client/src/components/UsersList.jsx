import {Search} from 'lucide-react'
import Groupprof from './layout/Groupprof'

import { useEffect } from 'react'
import { useState } from 'react'
import { useAuthStore } from '../store/authStore.js'
import { useApiStore } from '../store/apiStore.js';
import axios from 'axios';
import { server } from '../constants/config.js';
import toast from 'react-hot-toast';
import Tab from './minicomponents/Tab.jsx'
import MobileHeader from './layout/MobileHeader.jsx'



function UsersList({ onlineUsers }) {

  const [search, setSearch] = useState('')
  const [selectedType, setSelectedType] = useState('all')
  const unreadCounts = useApiStore((state) => state.unreadCounts);
  const setUnreadCounts = useApiStore((state) => state.setUnreadCounts);
  const contacts = useApiStore((state) => state.contacts)
  const fetchContact = useApiStore((state) => state.fetchContact)
  const user = useAuthStore(state => state.user)



  useEffect(() => {
    (
      async function () {
        const success = await fetchContact();
        if (!success) toast.error("error fetching contact")
      }
    )()
  }, [])

  useEffect(() => {
    const fetchUnreadCounts = async () => {
      try {
        const { data } = await axios.get(
          `${server}/api/v1/chats/unread-counts`,
          { withCredentials: true }
        );

        if (data.success) {
          setUnreadCounts(data.unreadCounts, data.totalUnread);
        }
      } catch (error) {
        console.error("Error fetching unread counts:", error);
      }
    };

    fetchUnreadCounts();
  }, [setUnreadCounts]);


  function handleSearch(string) {
    setSearch(string);
  }

  const filteredContacts = contacts.filter((el) => {
    if (search.trim() === '') return true;
    if (el.groupChat) {
      return el.name?.toLowerCase().includes(search.toLowerCase());
    } else {
      const otherMember = el.members.find((member) => member._id !== user._id);
      return otherMember?.fullName?.toLowerCase().includes(search.toLowerCase());
    }
  });


  const tabs = [
    { label: "All", value: "all" },
    { label: "Group", value: "group" },
    { label: "Friends", value: "friends" },
  ]

  return (
    <aside className="flex flex-col bg-base dark:bg-base-dark h-screen w-full pt-6">

      <MobileHeader user={user} />

      <div className="flex justify-center">
        <div className="w-[70%] flex bg-searchbar dark:bg-searchbar-dark rounded-full pl-4 pr-2 py-[4px] items-center">
          <input
            value={search}
            onChange={(e) => handleSearch(e.target.value)}
            type="text"
            placeholder="search contact"
            className="w-full bg-transparent outline-none text-sm pb-[2px] text-secondary dark:text-secondary-dark  placeholder:text-placeholder-txt"
          />
          <span className="flex justify-center items-center cursor-pointer p-1 rounded-full hover:bg-[#4b4b4b]">
            <Search size={16} strokeWidth={2.2} className='text-placeholder-txt' />
          </span>
        </div>
      </div>

      <div className={` flex justify-evenly pt-6 `}>
        {tabs.map((tab) => <Tab key={tab.label} selectedType={selectedType} label={tab.label} value={tab.value} setSelectedType={setSelectedType} />)}
      </div>
      {contacts && (
        <div className="flex-1 overflow-y-auto px-[2%] my-3 flex flex-col gap-1 scrollbar-thin scrollbar-track-transparent scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-800">
          {selectedType === "group"
            ? filteredContacts.map(
              (chat) => chat.groupChat && <Groupprof key={chat._id} data={chat} unreadCount={unreadCounts[chat._id] || 0} />
            )
            : selectedType === "friends"
              ? filteredContacts.map(
                (chat) => !chat.groupChat && <Groupprof key={chat._id} data={chat} onlineUsers={onlineUsers} unreadCount={unreadCounts[chat._id] || 0} />
              ) :
              filteredContacts.map((chat) => (
                <Groupprof key={chat._id} data={chat} onlineUsers={onlineUsers} unreadCount={unreadCounts[chat._id] || 0} />
              ))}
        </div>
      )}
    </aside>
  )
}

export default UsersList