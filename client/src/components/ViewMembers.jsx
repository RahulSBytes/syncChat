import axios from 'axios'
import { Trash, Trash2, X } from 'lucide-react'
import React, { useState } from 'react'
import { server } from '../constants/config'
import { getSocket } from '../context/SocketContext'
import useSocketEvents from '../hooks/useSocketEvents'
import { useApiStore } from '../store/apiStore'
import toast from 'react-hot-toast'
import moment from 'moment'


function ViewMembers({ selectedChatInfo, setIsViewMembersClicked }) {

    const [addMember, setAddMember] = useState('')
    const removeMemberFromGroup = useApiStore(state => state.removeMemberFromGroup)
    const addMemberInGroup = useApiStore(state => state.addMemberInGroup)

    async function removeMemberHandler(memberId) {
        const success = await removeMemberFromGroup(selectedChatInfo._id, memberId)
        success ? toast.success("member removed successfully") : toast.error("error removing member");
    }

    async function handleSubmit() {
        setAddMember('')
        const success = await addMemberInGroup(selectedChatInfo._id, addMember);
        success ? toast.success("member successfully added") : toast.error("error adding member");
    }


    return (
        <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50">
            <div className="bg-surface dark:bg-surface-dark w-full max-w-md rounded-lg shadow-lg px-12 py-8 pb-5 relative">

                <X onClick={() => setIsViewMembersClicked(prev => !prev)} className="absolute top-6 right-6 text-gray-500 hover:text-gray-700" size={20} strokeWidth={3} color="#c1c1c1" />
                <h2 className="text-xl font-semibold mb-4 text-center text-primary dark:text-primary-dark">Members</h2>
                {selectedChatInfo.members?.length > 0 ?
                    <div className="flex flex-col pl-2 h-60 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]">
                        <div>

                            {
                                selectedChatInfo.members.map(({ _id, username, fullName, avatar }) =>
                                    <div key={_id} className="  items-center flex justify-between px-4 py-2 bg-surface dark:bg-surface-dark hover:bg-zinc-200 dark:hover:bg-[#292929]">
                                        <div className="flex gap-2 items-center min-w-0 flex-1">
                                            <img src={avatar.url || '/image.png'}
                                                className="h-8 w-8 rounded-full border-[2px] border-accent flex-shrink-0" />
                                            <div>

                                                <span className="line-clamp-1 font-semibold text-secondary dark:text-secondary-dark  text-[14px]  truncate">{fullName}</span>
                                                <span className="line-clamp-1 font-semibold text-[10px] text-muted dark:text-muted-dark">{username}</span>
                                            </div>
                                        </div>
                                        <span className='cursor-pointer'>{selectedChatInfo.creator._id !== _id ? <Trash2 size={21} onClick={() => removeMemberHandler(_id)} /> : <span className='text-accent'>Creator</span>}</span>
                                    </div>
                                )
                            }
                        </div>
                        {selectedChatInfo.removedMembers?.length > 0 &&
                            <div className='mt-4'>
                                <h5 className='ml-3 text-secondary dark:text-secondary-dark' >Past Members</h5>
                                {selectedChatInfo.removedMembers?.map(({ userId, removedAt }) =>
                                    <div key={userId._id} className=" items-center flex justify-between px-4 py-2 hover:bg-zinc-200 dark:hover:bg-[#292929]">
                                        <div className="flex gap-2 items-center min-w-0 flex-1">
                                            <img src={userId?.avatar?.url || '/image.png'}
                                                className="h-8 w-8 rounded-full border-[2px] border-accent flex-shrink-0" />
                                            <div>

                                                <span className="line-clamp-1 font-semibold text-secondary dark:text-secondary-dark  text-[14px]  truncate">{userId.fullName}</span>
                                                <span className="line-clamp-1 font-semibold text-[10px] text-muted dark:text-muted-dark">{userId.username}</span>
                                            </div>
                                        </div>
                                        <span className='text-sm text-muted dark:text-muted-dark'>{moment(removedAt).fromNow()}</span>
                                    </div>
                                )}
                            </div>
                        }
                    </div>
                    :
                    <div className='text-center text-zinc-300'> no members</div>
                }
                <form onSubmit={(e) => e.preventDefault()}>
                    <input
                        value={addMember}
                        onChange={(e) => setAddMember(e.target.value)}
                        type="text"
                        placeholder="Enter username to add"
                        className="w-full rounded text-secondary dark:text-secondary-dark bg-searchbar dark:bg-searchbar-dark px-3 py-1 mt-2 outline-none"
                    />
                    <button onClick={handleSubmit} type="submit" className="btn btn-block mt-4 h-8 px-4 rounded-md text-sm bg-accent text-white font-medium hover:bg-[#1f744e] transition">Add Member</button>
                </form>

            </div>
        </div>
    )
}

export default ViewMembers