// profile.js
import { ArrowUpRight, ChevronRight, Clapperboard,  FileMinus, Headphones, Image, PencilLine, Play } from 'lucide-react'
import { useAuthStore } from '../../store/authStore.js';
import { useChatStore } from '../../store/chatStore.js';
import { useMemo, useState } from 'react'
import ShowProfileAttachmentList from '../minicomponents/ShowProfileAttachmentList.jsx';
import { useApiStore } from '../../store/apiStore.js';
import ViewMembers from '../ViewMembers.jsx';
import { getSocket } from '../../context/SocketContext.jsx';
import { server } from '../../constants/config.js';
import axios from 'axios';
import toast from 'react-hot-toast';
import TransferGroupOwnershipWin from '../minicomponents/TransferGroupOwnershipWin.jsx';

function Details({ mobileStyle }) {

    const user = useAuthStore((state) => state.user);
    const currentSelectedChatId = useChatStore((state) => state.currentSelectedChatId)
    const contacts = useApiStore((state) => state.contacts)
    const messagesRelatedToChat = useApiStore((state) => state.messagesRelatedToChat)
    const [grpOwnerWin, setGrpOwnerWin] = useState(false)


    const categorized = useMemo(() => {
        const allAttachments = messagesRelatedToChat
            .map((message) => message.attachments)
            .flat()
            .filter(Boolean); // Filter out null/undefined attachments


        const groups = {
            raw: [],
            audio: [],
            video: [],
            image: [],
        };

        for (const att of allAttachments) {
            if (groups[att.fileType]) {
                groups[att.fileType].push(att);
            }
        }

        return groups;
    }, [messagesRelatedToChat]);

    const [isViewMembersClicked, setIsViewMembersClicked] = useState(false)

    // Use an object to track which file types are expanded
    const [expandedFileTypes, setExpandedFileTypes] = useState({});


    const filesObject = [
        {
            label: "Documents",
            count: categorized.raw.length,
            icon: FileMinus,
            files: categorized.raw,
            key: 'documents'
        },
        {
            label: "Videos",
            count: categorized.video.length,
            icon: Play,
            files: categorized.video,
            key: 'videos'
        },
        {
            label: "Audios",
            count: categorized.audio.length,
            icon: Headphones,
            files: categorized.audio,
            key: 'audios'
        },
        {
            label: "Images",
            count: categorized.image.length,
            icon: Image,
            files: categorized.image,
            key: 'images'
        },
    ]

    const socket = getSocket()
    const leaveGroup = useApiStore(state => state.leaveGroup)
    const fetchMessages = useApiStore(state => state.fetchMessages)


    if (!contacts || !currentSelectedChatId) {
        return null
    }

    const selectedChatInfo = contacts.find((el) => el._id === currentSelectedChatId)
    const info = selectedChatInfo?.members?.find((el) => el._id != user._id)


    if (!user) return <p>loading.......!</p>

    if (!selectedChatInfo) {
        return <p>Chat information not found</p>
    }

    async function handleClearMessages(chatId) {
        try {
            const res = confirm("Do you really wanna clear this that?")
            if (res) {
                const { data } = await axios.delete(`${server}/api/v1/chats/${chatId}/clear-chat`, { withCredentials: true })
                data.success ? toast.success("chat cleared successfully") : toast.error("failed clearing chat")
            }
        } catch (error) {
            console.log("erooorr::", error)
        }
    }

    async function handleBlock(chatId) {
        try {
            const { data } = await axios.post(`${server}/api/v1/chats/${chatId}/block`, {}, { withCredentials: true })
            data.success ? toast.success("user blocked successfully") : toast.error("failed blocking user")
        } catch (error) {
            console.log("erooorr block::", error)
        }
    }
    async function handleUnblock(chatId) {
        try {
            const { data } = await axios.post(`${server}/api/v1/chats/${chatId}/unblock`, {}, { withCredentials: true })
            data.success ? toast.success("user unblocked successfully") : toast.error("failed unblocking user")
        } catch (error) {
            console.log("erooorr unblock::", error)
        }
    }


    const toggleFileType = (fileKey) => {
        setExpandedFileTypes(prev => ({
            ...prev,
            [fileKey]: !prev[fileKey]
        }));
    };

    const closeAttachmentList = (fileKey) => {
        setExpandedFileTypes(prev => ({
            ...prev,
            [fileKey]: false
        }));
    };


    async function handleOwnerChange(newCreatorId = null) {
        const success = await leaveGroup(selectedChatInfo._id, newCreatorId);
        if (success) {
            toast.success("left group successfully")
            setGrpOwnerWin(false)
        } else {
            toast.error("error leaving group")
        }
    }

    const openOwnerShipTransferWindow = selectedChatInfo.groupChat && (selectedChatInfo.creator._id == user._id) && grpOwnerWin

    return (
        <aside className={`lg:flex bg-base dark:bg-base-dark flex-col px-6 py-8 min-h-0 overflow-hidden ${mobileStyle} flex-1 overflow-y-scroll scrollbar-thin scrollbar-track-transparent scrollbar-thumb-[#444]`}>
            {isViewMembersClicked && <ViewMembers selectedChatInfo={selectedChatInfo} setIsViewMembersClicked={setIsViewMembersClicked} />}
            {openOwnerShipTransferWindow && <TransferGroupOwnershipWin handleOwnerChange={handleOwnerChange} selectedChatInfo={selectedChatInfo} setGrpOwnerWin={setGrpOwnerWin} />}
            <div className="flex flex-col min-h-0 flex-1">

                {/* ---------for group chat------------ */}
                {selectedChatInfo.groupChat ? (
                    <div className=' flex gap-4 flex-col py-4'>
                        <div className='w-full flex flex-col items-center flex-shrink-0'>
                            <div className='relative'>
                            <img
                                className="h-20 w-20 rounded-full object-cover border"
                                src={selectedChatInfo.avatar?.url || '../../../public/image.png'}
                                alt="Group avatar"
                            /> 
                  <span className=' absolute right-1 bottom-0 rounded-full w-5 h-5 font-semibold text-primary flex justify-center items-center bg-[#B1B1B1]'>#</span>
                            </div>
                            <h4 className='font-semibold text-lg mt-2 text-primary dark:text-primary-dark'>{selectedChatInfo.name}</h4>
                            <p className='cursor-pointer text-center text-sm font-handwriting flex gap-1 items-center text-secondary dark:text-secondary-dark' onClick={() => setIsViewMembersClicked(prev => !prev)}>{selectedChatInfo.members.length} members <PencilLine size={14} /></p>
                            <p className='text-center text-xs font-handwriting line-clamp-2 text-muted dark:text-muted-dark'>{selectedChatInfo.description}</p>
                        </div>
                    </div>
                ) : (
                    // -------------------- direct conversation ----------------------------
                    info && (
                        <div className=' w-full flex flex-col items-center py-4 gap-1 flex-shrink-0'>
                            <img
                                src={info.avatar?.url || '../../../public/image.png'}
                                className='h-14 w-14 rounded-full object-cover border border-[#323232]'
                                alt={`${info.fullName} avatar`}
                            />
                            <h4 className='font-semibold text-lg text-primary dark:text-primary-dark'>{info.fullName}</h4>
                            <p className='text-center text-sm font-handwriting text-secondary dark:text-secondary-dark'>@{info.username}</p>
                            <p className='text-center font-handwriting text-xs text-zinc-300'>{info.bio}</p>
                        </div>
                    )
                )}

                <div className="flex flex-col mt-4 gap-6 flex-shrink-0">
                    <div>
                        <h4 className='pb-2'>Shared files</h4>
                        <div className='flex flex-col gap-1'>
                            {filesObject.map((el) => (
                                <div key={el.key}>
                                    <div
                                        onClick={() => toggleFileType(el.key)}
                                        className='flex justify-between hover:bg-surface dark:hover:bg-surface-dark cursor-pointer items-center p-1 py-2 pr-3'
                                    >
                                        <div className='flex gap-1 items-center text-sm'>
                                            <el.icon className='text-accent mr-1'/>
                                            <div className='flex flex-col'>
                                                <span className='text-sm text-primary dark:text-primary-dark'>{el.label}</span>
                                                <span className='text-[10px] font-handwriting text-muted dark:text-muted-dark'>{el.count} files</span>
                                            </div>
                                        </div>
                                        <ChevronRight size={21} className='text-accent' />
                                    </div>

                                    {expandedFileTypes[el.key] && (
                                        <ShowProfileAttachmentList
                                            files={el.files}
                                            onClose={() => closeAttachmentList(el.key)}
                                        />
                                    )}
                                </div>
                            ))}
                        </div>
                        <div className='flex flex-col gap-1 items-start mt-4'>
                            <button className='text-sm mb-1 text-secondary dark:text-secondary-dark' onClick={() => handleClearMessages(selectedChatInfo._id)}> Clear all messages </button>
                            {
                                selectedChatInfo.groupChat ? <button className='text-sm text-error hover:text-error-light' onClick={() => selectedChatInfo.creator._id == user._id ? setGrpOwnerWin(prev => !prev) : handleOwnerChange()}> Leave this group </button>
                                    : selectedChatInfo.isBlocked ? <button onClick={() => handleUnblock(selectedChatInfo._id)} className='text-sm text-green-600 hover:text-green-400'>Unblock this contact </button> : <button onClick={() => handleBlock(selectedChatInfo._id)} className='text-sm text-error hover:text-error-light'>Block this contact </button>
                            }
                        </div>
                    </div>
                </div>
            </div>
            {/* <hr /> */}

        </aside>
    )
}

export default Details