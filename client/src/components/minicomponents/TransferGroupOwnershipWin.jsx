import { X } from 'lucide-react'
import React from 'react'
import { useState } from 'react'
import { useApiStore } from '../../store/apiStore.js'

export default function TransferGroupOwnershipWin({ selectedChatInfo, setGrpOwnerWin, handleOwnerChange }) {

    const filterCreator = selectedChatInfo.members.filter((el) => el._id !== selectedChatInfo.creator._id)
    const [selectedMember, setSelectedMember] = useState(null)


    return (
        <div className="fixed inset-0  bg-black/50 flex items-center justify-center z-50">
            <div className="bg-[#3B3B3B] w-full max-w-md rounded-lg shadow-lg px-12 py-8 pb-5 relative">
                <X onClick={() => setGrpOwnerWin(prev => !prev)} className="cursor-pointer absolute top-6 right-6 text-gray-500 hover:text-gray-700" size={20} strokeWidth={3} color="#c1c1c1" />

                {filterCreator?.length > 0 ?
                    <div>
                        <h5 className='mb-2'>Select one of the following to transfer the ownership to</h5>
                        <div className="flex flex-col pl-2 h-60 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]">

                            {
                                filterCreator.map(({ _id, username, fullName, avatar }) =>
                                    <div onClick={() => setSelectedMember(_id)} key={_id} className={`${selectedMember == _id && "bg-[#424242]"} cursor-pointer items-center flex justify-between px-4 py-2 `}>
                                        <div className="flex gap-2 items-center min-w-0 flex-1">
                                            <img src={avatar.url || '/image.png'}
                                                className="h-8 w-8 rounded-full border-[2px] border-[#248F60] flex-shrink-0" />
                                            <div>
                                                <span className="line-clamp-1 font-semibold text-zinc-50 text-[14px] md:text-base truncate">{fullName}</span>
                                                <span className="line-clamp-1 font-semibold text-[10px] text-zinc-300">{username}</span>
                                            </div>
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                        <div className='flex gap-2'>
                            <button onClick={() => setGrpOwnerWin(prev => !prev)} className="flex-1 border-gray-400 border p-1 hover:bg-[#454545]">Cancel</button>
                            <button onClick={()=>handleOwnerChange(selectedMember)}  className="flex-1 bg-green-800 p-1 hover:bg-green-700">Confirm</button>
                        </div>
                    </div>
                    :
                    <div className='text-center text-zinc-300'> no members</div>
                }

            </div>
        </div>
    )
}
