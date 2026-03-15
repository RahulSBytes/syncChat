import { useEffect, useRef, useState } from 'react'
import EmojiPicker from 'emoji-picker-react';
import { ArrowLeft, Bubbles, Check, Clapperboard, Dot, DotIcon, Ellipsis, FileAudio, FileAudio2, FilePlay, FileText, Image, Paperclip, Send, SmilePlus, X } from 'lucide-react'
import { useChatStore } from '../store/chatStore.js';
import moment from 'moment'
import { useAuthStore } from '../store/authStore.js';
import AttachmentGrid from './minicomponents/AttachmentGrid.jsx';
import toast from 'react-hot-toast';
import TypingIndicator from './minicomponents/TypingIndicator.jsx'
import { useApiStore } from '../store/apiStore.js';
import { getSocket } from '../context/SocketContext.jsx';
import { CHAT_CLEARED, MESSAGE_DELETED, MESSAGE_DELIVERED, MESSAGE_READ, NEW_CONTACT_ADDED, NEW_MESSAGE, REFETCH_CHATS, START_TYPING, STOP_TYPING, UNREAD_COUNT_UPDATED, UPDATE_CHAT, UPDATE_LAST_MESSAGE } from '../constants/events.js';
import useSocketEvents from '../hooks/useSocketEvents.js';
import { useNavigate, useOutletContext } from 'react-router-dom';
import { useTypingIndicator } from '../hooks/useTypingIndicator.js';
import Profile from "./layout/Profile.jsx"
import axios from 'axios';
import { server } from '../constants/config.js';
import MessageStatus from './minicomponents/MessageStatus.jsx';
import { useAutoMarkRead } from '../hooks/useAutoMarkRead.js';
import { useAutoMarkDelivered } from '../hooks/useAutoMarkDelivered.js';
import usePreferencesStore from '../store/usePreferencesStore.js';

function Chats() {
  const { onlineUsers } = useOutletContext();

  // ✅ All state/hooks at the top (always called)
  const [sending, setSending] = useState(false);
  const [isEmojiOpen, setIsEmojiOpen] = useState(false);
  const [isAttachmentOpen, setIsAttachmentOpen] = useState(false);
  const [msg, setMsg] = useState('');
  const [selectedFiles, setSelectedFiles] = useState([]);
  const emojiButtonRef = useRef(null);
  const [contextMenu, setContextMenu] = useState({
    visible: false,
    messageId: null,
    x: 0,
    y: 0,
    data: null
  });
  const [typingUsers, setTypingUsers] = useState(new Map());

  const emojiRef = useRef(null);
  const attachmentRef = useRef(null);
  const messagesEndRef = useRef(null);
  const chatContainerRef = useRef(null);

  const user = useAuthStore((state) => state.user);
  const {
    cancelUpload,
    isSendingMessage,
    progress,
    contacts,
    updateChat,
    resetUnreadCount,
    updateContactUnreadCount,
    updateMessageStatuses,
    fetchMessages,
    addMessageFromSocket,
    sendMessage,
    messagesRelatedToChat,
    updateMessageDeletionFromSocket,
    updateContactsList,
    fetchContact
  } = useApiStore();
  const preferences = usePreferencesStore(state => state.preferences)
  const currentSelectedChatId = useChatStore((state) => state.currentSelectedChatId);
  const darkMode = useChatStore((state) => state.darkMode);
  // ✅ Auto-mark delivered when messages load
  // useAutoMarkDelivered(currentSelectedChatId);

  // ✅ Auto-mark read when chat is visible
  useAutoMarkRead(currentSelectedChatId, true);
  const navigate = useNavigate();
  const socket = getSocket();

  const chatInfo = contacts?.find((el) => el._id == currentSelectedChatId);

  // ✅ Call hook unconditionally with safe fallbacks
  const { startTyping, stopTyping } = useTypingIndicator(
    chatInfo?._id || null,
    chatInfo?.members || []
  );

  // ✅ All useEffect hooks (always called)
  useEffect(() => {
    function handleClickOutside(e) {
      // ✅ Exclude button from "outside" check
      if (
        isEmojiOpen &&
        emojiRef.current &&
        !emojiRef.current.contains(e.target) &&
        emojiButtonRef.current &&
        !emojiButtonRef.current.contains(e.target) // ✅ Key fix
      ) {
        setIsEmojiOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isEmojiOpen, isAttachmentOpen]);

  useEffect(() => {
    if (!currentSelectedChatId) return;
    (async function () {
      const success = await fetchMessages(currentSelectedChatId);
      if (!success) toast.error("failed fetching messages");
    })();
  }, [currentSelectedChatId]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, [messagesRelatedToChat]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (contextMenu.visible) {
        setContextMenu({ visible: false, messageId: null, x: 0, y: 0, data: null });
      }
    };
    const el = chatContainerRef.current;
    if (el) el.addEventListener("scroll", handleScroll);
    return () => el && el.removeEventListener("scroll", handleScroll);
  }, [contextMenu.visible]);

  useEffect(() => {
    const closeMenu = () => setContextMenu({ visible: false, messageId: null, x: 0, y: 0, data: null });
    document.addEventListener("click", closeMenu);
    return () => document.removeEventListener("click", closeMenu);
  }, []);



  useEffect(() => {
    if (currentSelectedChatId) {
      resetUnreadCount(currentSelectedChatId);
    }
  }, [currentSelectedChatId, resetUnreadCount]);


  useSocketEvents(socket, {
    [NEW_MESSAGE]: async (data) => {

      console.log("new message data :: ", data)

      const isMyMessage = data.sender._id === user._id;
      const isCurrentChat = data.chat === currentSelectedChatId;


      // ✅ 1. Mark as delivered (if not sent by me)
      if (!isMyMessage) {
        try {
          const res = await axios.put(
            `${server}/api/v1/chats/delivered/${data.chat}`,
            {},
            { withCredentials: true }
          );
        } catch (err) {
          console.error("Mark delivered error:", err);
        }
      }

      try {
        if (isCurrentChat) {
          // Add message to current chat
          addMessageFromSocket(data);

          // Mark as read after short delay (if not my message)
          if (!isMyMessage) {
            setTimeout(() => {
              axios.put(
                `${server}/api/v1/chats/read/${data.chat}`,
                {},
                { withCredentials: true }
              ).catch(err => console.error("Mark read error:", err));
            }, 1000);
          }
        }
      } catch (error) {
        console.log("error socket handler ", error)
      }

    },

    [MESSAGE_DELIVERED]: ({ chatId, messageIds, deliveredBy }) => {
      updateMessageStatuses(messageIds, "delivered");
    },

    [MESSAGE_READ]: ({ chatId, messageIds, readBy }) => {
      updateMessageStatuses(messageIds, "read");
    },

    [UNREAD_COUNT_UPDATED]: ({ chatId, unreadCount }) => {
      updateContactUnreadCount(chatId, unreadCount);
    },
    [REFETCH_CHATS]: () => {
      console.log("refreshing chat")

      fetchContact();
    },
    [MESSAGE_DELETED]: (data) => {
      updateMessageDeletionFromSocket(data[0]);
    },
    [UPDATE_LAST_MESSAGE]: (data) => updateContactsList(data),
    [START_TYPING]: ({ chatId: typingChatId, userId, username }) => {
      if (typingChatId === currentSelectedChatId && userId !== user._id) {
        setTypingUsers(prev => new Map(prev).set(userId, username));
      }
    },
    [CHAT_CLEARED]: async ({ chatId }) => {
      if (chatId == currentSelectedChatId) {
        await fetchMessages(chatId); // learnnnnnnnnning *_*
      }
    },
    [STOP_TYPING]: ({ chatId: typingChatId, userId }) => {
      if (typingChatId === currentSelectedChatId) {
        setTypingUsers(prev => {
          const m = new Map(prev);
          m.delete(userId);
          return m;
        });
      }
    },

  });




  // ✅ Render loading state in JSX, not early return
  if (!chatInfo || !user) {
    return <div>Loading...</div>;
  }

  // ✅ Now safe to destructure (chatInfo is guaranteed to exist)
  let { _id: otherUserId, fullName, avatar } = chatInfo.members.find((el) => el._id != user._id) || {};
  if (chatInfo.groupChat) fullName = chatInfo.name;


  let isDeleteForEveryone = false;
  async function handleDeleteMessage(messageId, messageInfo, isDeleteForEveryone) {
    const endpoint = isDeleteForEveryone
      ? `${server}/api/v1/chats/${messageId}/delete-for-everyone`
      : `${server}/api/v1/chats/${messageId}/delete-for-me`;
    const { data } = await axios.delete(endpoint, { data: { messageInfo, chatId: currentSelectedChatId }, withCredentials: true })
    data.success ? toast.success("message deleted successfully") : toast.error("error deleting message");
  }


  async function handleSendMsg() {
    const { text, attachment } = { text: msg, attachment: selectedFiles };
    if (!text.trim() && (!attachment || attachment.length === 0)) {
      toast.error("Something is missing");
      return;
    }
    setSending(true);
    setSelectedFiles([]);
    const formData = new FormData();
    formData.append('text', text);
    if (attachment && attachment.length > 0) {
      attachment.forEach((file) => formData.append("files", file));
    }
    const success = await sendMessage(formData, currentSelectedChatId);
    if (!success) {
      toast.error("error sending message");
      setSelectedFiles(attachment);
    } else setMsg('');
    setSending(false);
  }

  const removeSelectedFile = (index) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };
  const clearAllFiles = () => setSelectedFiles([]);

  const autoResize = (e) => {
    e.target.style.height = 'auto';
    e.target.style.height = Math.min(e.target.scrollHeight, 90) + 'px';
  };


  const handleFileSelect = (acceptedTypes) => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = acceptedTypes;
    input.multiple = true;
    input.onchange = (e) => {
      const newFiles = Array.from(e.target.files);
      if (newFiles.length > 0) {
        setSelectedFiles(currentFiles => {
          const emptySpace = 6 - currentFiles.length;
          if (emptySpace <= 0 || newFiles.length > emptySpace) {
            toast.error("only 6 files can be sent at a time.")
            return currentFiles;
          }
          const updatedFiles = [...currentFiles, ...newFiles.slice(0, emptySpace)];
          return updatedFiles;
        });
      }
    };
    input.onclick = setIsAttachmentOpen((prev) => !prev);
    input.click();
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setMsg(value);
    value.length > 0 ? startTyping() : stopTyping();
  }

  const handleContextMenu = (messageId, data, e) => {
    e.preventDefault();
    const menuWidth = 200;
    const menuHeight = 150;

    let x = e.clientX;
    let y = e.clientY;

    const { innerWidth, innerHeight } = window;
    if (x + menuWidth > innerWidth) x = innerWidth - menuWidth - 10;
    if (y + menuHeight > innerHeight) y = innerHeight - menuHeight - 10;

    setContextMenu({ visible: true, messageId, x, y, data });
  };

  function onEmojiSelect({ emoji }) {
    setMsg(prev => prev + emoji)
  }

  const haveYouBlocked = !chatInfo.isBlocked

  // const BubbleShape = preferences?.messageBubbleStyle === "rounded" ? "rounded-full" : preferences?.messageBubbleStyle === "minimal" ? "rounded-t-md rounded-br-md" : "rounded-sm"



  return (
    <div className="flex-1 min-w-0 h-full flex flex-col relative ">
      {/* HEADER */}
      <div className='sticky bg-surface dark:bg-surface-dark top-0 z-10 flex justify-between items-center p-3 border-b border-placeholder-txt/30'>
        <div className='flex items-center w-full '>
          <button onClick={() => navigate('/')} className="mr-2 text-white hover:bg-gray-700 rounded md:hidden">
            <ArrowLeft className="w-5 h-5" />
          </button>

          <img src={chatInfo.groupChat ? chatInfo.avatar.url || '../../public/image.png' : avatar.url || '../../public/unknown.jpg'} className='h-10 w-10 rounded-full mr-2 ' />
          {/* )} */}
          <div className='flex flex-col'>
            <span className='font-semibold text-lg text-primary dark:text-primary-dark'>{chatInfo.name || fullName}</span>
            {chatInfo.groupChat ? (
              <span className='text-xs font-medium text-muted dark:text-muted-dark'>
                {chatInfo.members.length} members
              </span>
            )
              :
              <span className='text-xs font-medium text-accent'>
                {!haveYouBlocked ? "Blocked" : onlineUsers.includes(otherUserId) ? "Online" : "Offline"}
              </span>
            }
          </div>
        </div>


        {/* sidebarrr */}

        <div className="drawer drawer-end lg:hidden w-min mr-10">
          <input id="my-drawer-5" type="checkbox" className="drawer-toggle" />
          <div className="drawer-content">
            <label htmlFor="my-drawer-5" className="drawer-button"><Ellipsis /></label>
          </div>
          <div className="drawer-side">
            <label htmlFor="my-drawer-5" aria-label="close sidebar" className="drawer-overlay"></label>
            <ul className="menu bg-base-200 min-h-full w-80 p-4">
              <label htmlFor="my-drawer-5" className="drawer-button"><X /></label>
              <Profile />
            </ul>
          </div>
        </div>


      </div>



      {/* MESSAGES SECTION */}
      <div ref={chatContainerRef} className='overflow-y-auto bg-surface dark:bg-surface-dark scrollbar-thin scrollbar-thumb-zinc-300 dark:scrollbar-thumb-zinc-700 scrollbar-track-transparent px-6 py-4 h-full flex flex-col'>

        {messagesRelatedToChat.length > 0 ? (
          <div className="flex flex-col gap-2">
            {messagesRelatedToChat.map((msg, index) => {
              const { _id, sender, attachments, text, textDeletedFor = [], textDeletedForEveryone = false, createdAt, status = '' } = msg;

              if (textDeletedFor.includes(user._id) && attachments.every((el) => el.deletedFor.includes(user._id))) return null;

              const msgDate = moment(createdAt).format('DD-MM-YYYY');
              const prevMsgDate = index > 0 ? moment(messagesRelatedToChat[index - 1].createdAt).format('DD-MM-YYYY') : null;
              const isDateTransition = msgDate !== prevMsgDate;

              return (
                <div key={_id} >
                  {isDateTransition && (
                    <div className="text-center text-xs my-2 text-zinc-400">
                      {moment(createdAt).calendar(null, {
                        sameDay: '[Today]',
                        lastDay: '[Yesterday]',
                        lastWeek: 'dddd, MMM D',
                        sameElse: 'MMMM D, YYYY'
                      })}
                    </div>
                  )}

                  <div className={`chat ${sender._id === user._id ? 'chat-end' : 'chat-start'}`}>

                    <div className={`w-full rounded-t-lg flex gap-1 flex-col min-w-0 ${sender._id === user._id ? 'items-end' : 'items-start'}`}>

                      {attachments.length > 0 && (
                        <label htmlFor="attachment" className="flex justify-end max-w-[60%]">
                          <AttachmentGrid attachments={attachments} handleContextMenu={handleContextMenu} userId={user._id} _id={_id} />
                          <input type="text" id="attachment" className="hidden" />
                        </label>
                      )}
                      {(text.length > 0 || textDeletedForEveryone) && (
                        <div

                        >
                          {textDeletedForEveryone ? (
                            <span className="text-xs italic text-zinc-500 bg-[#2d2d2d] py-1 px-2 rounded">this message was deleted</span>
                          ) : (
                            <span className={`whitespace-pre-wrap text-message-text  break-words max-w-[70%] py-[6px] px-3  font-sans ${sender._id === user._id
                              ? ' bg-message-sent-bg '
                              : 'bg-me bg-message-received-bg'
                              }`}
                              onContextMenu={(e) => handleContextMenu(_id, { type: 'text', text }, e)} >{text}</span>
                          )}
                        </div>
                      )}
                      <span className="text-[10px] text-zinc-400 flex items-center">
                        {moment(createdAt).format('hh:mm a')}

                        {sender._id === user._id && <> <DotIcon size={12} absoluteStrokeWidth /> <MessageStatus status={status} /> </>} </span>

                      {contextMenu.visible && contextMenu.messageId === _id && (
                        <div id="custom-context-menu" className="fixed z-50 bg-[#2a2a2a] text-white rounded-md shadow-lg"
                          style={{ top: contextMenu.y, left: contextMenu.x }}>
                          <div className="flex overflow-x-auto gap-1 p-2 border-b border-gray-700 max-w-[250px] scrollbar-thin scrollbar-thumb-[#444]">
                            {["👍", "❤️", "😂", "😮", "😢", "🔥", "👏", "🙏"].map(emoji => (
                              <span key={emoji} className="cursor-pointer text-xl hover:scale-110"
                                onClick={() => {
                                  setContextMenu({ visible: false, messageId: null, x: 0, y: 0, data: null });
                                }}>
                                {emoji}
                              </span>
                            ))}
                          </div>
                          <div className="flex flex-col text-sm">
                            <button className="px-4 py-2 hover:bg-[#689969] text-left"
                              onClick={() => {
                                handleDeleteMessage(contextMenu.messageId, contextMenu.data, isDeleteForEveryone = false);
                                setContextMenu({ visible: false, messageId: null, x: 0, y: 0, data: null });
                              }}>
                              Delete for me
                            </button>
                            {haveYouBlocked && sender._id === user._id && (
                              <button className="px-4 py-2 hover:bg-[#689969] text-left"
                                onClick={() => {
                                  handleDeleteMessage(contextMenu.messageId, contextMenu.data, isDeleteForEveryone = true);
                                  setContextMenu({ visible: false, messageId: null, x: 0, y: 0, data: null });
                                }}>
                                Delete for everyone
                              </button>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
            <div ref={messagesEndRef} />
          </div>

        ) : (
          <div className="flex items-center justify-center flex-1">
            <p className="text-gray-500">No messages yet</p>
          </div>
        )}

        {typingUsers.has(otherUserId) && (
          <div className="relative left-4 bottom-3 flex items-center w-full text-[#919191]">
            <span className='m-0 p-0'>Typing</span>
            <TypingIndicator />
          </div>
        )}
      </div>

      {/* INPUT SECTION */}
      {haveYouBlocked && <div className='sticky bottom-0 bg-surface dark:bg-surface-dark pt-2 pb-4 px-3 w-full border-t border-placeholder-txt'>
        {isEmojiOpen && (
          <div ref={emojiRef} className="absolute bottom-full left-0 w-full z-20">
            <EmojiPicker theme={darkMode ? "dark" : "light"} onEmojiClick={onEmojiSelect} height={200} width='100%' 
              previewConfig={{ showPreview: false }} searchDisabled={true} skinTonesDisabled={true} />
          </div>
        )}
        <form className='flex items-center relative'>
          <div className='p-2 rounded-full hover:bg-zinc-300 hover:dark:bg-zinc-600 cursor-pointer relative'>
            {isAttachmentOpen && (
              <div ref={attachmentRef} className="absolute flex flex-col items-start bottom-12 left-0 bg-zinc-300 dark:bg-zinc-600 p-2 gap-1 rounded-lg shadow-lg z-10 w-max">
                <span onClick={() => handleFileSelect('image/*')}
                  className='text-secondary dark:text-secondary-dark bg-zinc-200 dark:bg-zinc-500 hover:bg-zinc-400 justify-start px-3 py-2 flex text-sm  gap-2 items-center w-full rounded cursor-pointer'>
                  <Image size={14} />Images
                </span>
                <span onClick={() => handleFileSelect('video/*')}
                  className='text-secondary dark:text-secondary-dark bg-zinc-200 dark:bg-zinc-500 hover:bg-zinc-400 justify-start px-3 py-2 flex text-sm  gap-2 items-center w-full rounded cursor-pointer'>
                  <FilePlay size={14} />Videos
                </span>
                <span onClick={() => handleFileSelect('audio/*')}
                  className='text-secondary dark:text-secondary-dark bg-zinc-200 dark:bg-zinc-500 hover:bg-zinc-400 justify-start px-3 py-2 flex text-sm  gap-2 items-center w-full rounded cursor-pointer'>
                  <FileAudio2 size={14} />Audio
                </span>
                <span onClick={() => handleFileSelect('*/*')}
                  className='text-secondary dark:text-secondary-dark bg-zinc-200 dark:bg-zinc-500 hover:bg-zinc-400 justify-start px-3 py-2 flex text-sm  gap-2 items-center w-full rounded cursor-pointer'>
                  <FileText size={14}  />Documents
                </span>
              </div>
            )}
            <Paperclip onClick={() => setIsAttachmentOpen(prev => !prev)} size={18} className='text-muted dark:text-muted-dark' />
          </div>
          <span
            ref={emojiButtonRef}
            onClick={() => setIsEmojiOpen((prev) => !prev)}
            className="p-2 rounded-full hover:bg-zinc-300 hover:dark:bg-zinc-600 mr-2 cursor-pointer"
          >
            <SmilePlus size={18} className='text-muted dark:text-muted-dark' />
          </span>
          <div className='flex items-center flex-1 flex-col'>
            {selectedFiles.length > 0 && (
              <div className='w-full mb-2 p-2 bg-zinc-200 dark:bg-zinc-500 rounded-lg'>
                <div className='flex items-center justify-between mb-2'>
                  {selectedFiles.length < 6 && (
                    <div><span className='text-sm text-secondary dark:text-secondary-dark'>You can add {6 - selectedFiles.length} more</span></div>
                  )}
                  <button type="button" onClick={clearAllFiles}
                    className='text-xs text-red-400 hover:text-red-300 px-1 py-[2px] rounded hover:bg-[#505050]'>
                    Clear all
                  </button>
                </div>
                <div className='flex flex-col gap-1 max-h-32 overflow-y-scroll noScrollbar'>

                  {selectedFiles.map((file, index) => (
                    <div key={`${file.name}-${index}`} className='flex items-center justify-between bg-zinc-300 dark:bg-zinc-500 px-2 py-1 rounded'>
                      <div className='flex items-center flex-1 min-w-0'>
                        <span className='mr-2'>
                          {file.type.startsWith('image/') ? <Image className='text-accent' /> :
                            file.type.startsWith('video/') ? <Clapperboard className='text-accent' /> :
                              file.type.startsWith('audio/') ? <FileAudio className='text-accent' /> : <FileText className='text-accent' />}
                        </span>
                        <div className='flex flex-col flex-1 min-w-0'>
                          <span className='text-xs text-secondary dark:text-secondary-dark font-medium truncate'>{file.name}</span>
                          <span className='text-[10px] text-zinc-600'>{(file.size / 1024 / 1024).toFixed(2)} MB</span>
                        </div>
                      </div>
                      <button type="button" onClick={() => removeSelectedFile(index)}
                        className='ml-2 p-1 hover:bg-[#606060] rounded-full text-red-500'>
                        <X size={15} />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
            <div className='flex items-center w-full'>
              <textarea onInput={autoResize} value={msg} onChange={handleInputChange}
                className="w-full resize-none rounded-3xl px-4 outline-none min-h-[35px] max-h-[112px] py-2 overflow-y-auto bg-searchbar dark:bg-searchbar-dark text-primary dark:text-primary-dark"
                placeholder={selectedFiles.length > 0 ? `Send ${selectedFiles.length} file${selectedFiles.length !== 1 ? 's' : ''} with message...` : "Type a message..."} rows={1} />
              <button disabled={isSendingMessage || (!msg.trim() && selectedFiles.length === 0)} type="button" onClick={handleSendMsg}
                className='p-2 rounded-full hover:bg-zinc-300 hover:dark:bg-zinc-600 ml-1 cursor-pointer'>
                {sending ?
                  <span className="loading loading-spinner text-[#909090]"></span> :
                  <Send size={20} color={(!msg.trim() && selectedFiles.length === 0) ? '#666' : '#248f60'} />}
              </button>
            </div>
          </div>
        </form>
      </div>}
    </div>
  )
}

export default Chats