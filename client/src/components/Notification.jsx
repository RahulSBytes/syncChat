import React, { useEffect, useState } from 'react'
import { useUIStore } from '../store/store'
import { X } from 'lucide-react'
import { useApiStore } from '../store/apiStore.js'
import { toast } from 'react-hot-toast'


function Notification() {

    const fetchNotifications = useApiStore((state) => state.fetchNotifications)
    const handleFriendRequest = useApiStore((state) => state.handleFriendRequest)

    const setIsNotificationClicked = useUIStore((state) => state.setIsNotificationClicked)
    const [pendingRequests, setPendingRequests] = useState([])

    useEffect(() => {
        (async function () {
            const notifications = await fetchNotifications()
            if (!notifications) return toast.error("error fetching toast")
            setPendingRequests(notifications)
        })()
    }, [])

    async function handleRequest(requestId, accept) {
        const success = await handleFriendRequest(requestId, accept)
        if (!success) return toast.error("failed responding request")
        toast.success("friend request responded")
    }

    return (
        <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface dark:bg-surface-dark w-full max-w-md rounded-lg shadow-lg px-12 py-8 pb-10 relative">
                <X onClick={setIsNotificationClicked} className="absolute top-6 right-6 text-gray-500 hover:text-gray-700" size={20} strokeWidth={3} color="#c1c1c1" />
                <h2 className="text-xl font-semibold mb-6 text-center text-primary dark:text-primary-dark"> Notifications</h2>
                {pendingRequests.length > 0 ? <div className="flex flex-col gap-3 pl-2 h-60 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]">
                    {
                        pendingRequests.map(({ sender, _id }) =>
                            <div key={_id} className="flex justify-between items-center pr-4">
                                <div className="flex gap-2 w-full">
                                    <img src={sender.avatar.url || '/image.png'} className="h-8 w-8 rounded-full border-[2px] border-[#248F60]" />
                                    <span className="line-clamp-1 w-full font-semibold truncate pr-2">{sender.username}</span>
                                </div>
                                <button onClick={() => handleRequest(_id, true)} className=" px-3 h-6 rounded-md text-xs bg-[#248F60] text-white font-medium hover:bg-[#1f744e] transition">
                                    Accept
                                </button>
                                <button onClick={() => handleRequest(_id, false)} className="px-3 ml-2  h-6 rounded-md text-xs border border-[#248F60] text-[#248F60] font-medium hover:bg-[#248F60]/10 transition">
                                    Reject
                                </button>
                            </div>
                        )
                    }
                </div>
                    :
                    <div className='text-center text-secondary dark:text-secondary-dark'> no notification</div>
                }

            </div>
        </div>
    )
}

export default Notification