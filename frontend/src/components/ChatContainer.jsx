import React, { useEffect } from 'react'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import NoChatHistoryPlaceholder from './NoChatHistoryPlaceholder'
import Message from '../../../backend/src/Models/Message'
import MessageInput from './MessageInput'
import MessageLoadingSkeleton from './MessageLoadingSkeleton'

const ChatContainer = () => {

    const { selectedUser, getMessagesByUserId, messages, isMessagesLoading } = useChatStore()
    const { authUser } = useAuthStore()
    const messageEnd = React.useRef(null)
    
    useEffect(() => {
        if (selectedUser) {
            getMessagesByUserId(selectedUser._id)
        }
    }, [selectedUser, getMessagesByUserId])

    useEffect(() => {
        if (messageEnd.current) {
            messageEnd.current.scrollIntoView({ behavior: 'smooth' })
        }
    },[messages])

  return (
      <>
          <ChatHeader />
          <div className='flex-1 px-6 overflow-y-auto py-8'>
              {
                  messages.length > 0 && !isMessagesLoading? (
                      <div className='max-w-3xl mx-auto space-y-6'>
                          {
                              messages.map((msg) => {
                                 return <div
                                      key={msg._id}
                                      className={ `chat ${msg.senderId === authUser._id ? 'chat-end' : 'chat-start'}` }
                                  >
                                      <div className={ `chat-bubble relative ${msg.senderId === authUser._id ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-200'} ` }>
                                          {
                                              msg.image && (
                                                  <img src={msg.image} alt='Shared' className='rounded-log h-48 object-cover'/>
                                              )
                                          }
                                          {
                                              msg.text && (<p className='mt-2'>{msg.text}</p>)
                                         }
                                         <p className='text-xs mt-1 opacity-75 flex items-center gap-1'>
                                             {new Date(msg.createdAt).toLocaleTimeString(undefined, {hour: '2-digit', minute: '2-digit'})}
                                         </p>
                                    </div>
                                </div>
                            })
                          }
                          {/* scroll target for auto-scroll to bottom */}
                          <div ref={messageEnd}></div>
                  </div>
                  ) : isMessagesLoading ? <MessageLoadingSkeleton/> :<NoChatHistoryPlaceholder name={selectedUser.fullName}/>
              }
          </div>

          <MessageInput/>
      </>
  )
}

export default ChatContainer
