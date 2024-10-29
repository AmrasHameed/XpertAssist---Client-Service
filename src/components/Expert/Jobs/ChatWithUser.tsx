import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Socket } from 'socket.io-client';
import './ChatWIthUser.css'
import { RootState } from '../../../service/redux/store';
import { addMessage } from '../../../service/redux/slices/messageSlice';

interface Message {
  sender: 'user' | 'expert';
  content: string;
}

interface ChatWithUserProps {
  socket: Socket;
}

const ChatWithUser: React.FC<ChatWithUserProps> = ({ socket }) => {
  const messages = useSelector((state: RootState) => state.messages.messages);
  const [input, setInput] = useState('');
  const jobId = localStorage.getItem('currentJob-expert');
  const dispatch = useDispatch()

  useEffect(() => {
    if (socket) {
      socket.on('newTokens', (data) => {
        const { token, refreshToken } = data;
        localStorage.setItem('userToken', token);
        localStorage.setItem('refreshToken', refreshToken);
      });
      socket.emit('join_chat', jobId);
      socket.on('receive-expert-message', (data) => {
        dispatch(addMessage(data.message));
      });
    }

    return () => {
      socket?.off('newTokens');
      socket?.off('recieve-user-message');
    };
  }, [dispatch, jobId, socket]);

  const handleSendMessage = () => {
    if (!input.trim()) return;
    const expertMessage: Message = {
      sender: 'expert',
      content: input,
    };
    dispatch(addMessage(expertMessage));
    socket?.emit('expert_send_message', {
      roomName: jobId,
      message: expertMessage,
    });
    setInput('');
  };

  return (
    <div className="p-4 bg-indigo-100 rounded-lg h-96 flex flex-col">
      <h3 className="text-xl font-semibold mb-4">Chat with User</h3>
      <div className="flex-1 overflow-y-auto p-2 bg-white rounded-lg shadow-inner">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`relative mb-2 p-2 rounded-lg w-1/2 ${
              message.sender === 'user'
              ? 'bg-green-100 text-left pr-4 self-start other-message'
                : 'bg-blue-100 text-right pl-4 ml-auto user-message'
            }`}
          >
            <p>{message.content}</p>
          </div>
        ))}
      </div>
      <div className="mt-4 flex flex-row space-x-1">
        <input
          type="text"
          className="flex-1 border border-gray-300 rounded-full  p-2"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === 'Enter' && handleSendMessage()}
        />
        <button
          className="bg-green-500 flex items-center justify-cente w-10 h-10 rounded-full hover:bg-green-600"
          onClick={handleSendMessage}
        >
          <span className='material-symbols-outlined text-black text-3xl'>send</span>
        </button>
      </div>
    </div>
  );
};

export default ChatWithUser;
