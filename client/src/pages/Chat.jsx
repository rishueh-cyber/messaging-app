import { useState, useEffect, useRef } from 'react';
import { io } from 'socket.io-client';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';

const SOCKET_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:5000';

const Chat = ({ user, onLogout }) => {
  const [activeChat, setActiveChat] = useState(null);
  const [messages, setMessages] = useState({}); // { roomId: [msgs] }
  const [socket, setSocket] = useState(null);
  const [typingUsers, setTypingUsers] = useState({}); // { roomId: [users] }


  useEffect(() => {
    const newSocket = io(SOCKET_URL);
    setSocket(newSocket);

    newSocket.on('connect', () => {
      console.log('Connected to server');
    });

    newSocket.on('receive_message', (data) => {
      setMessages(prev => {
        const roomMsgs = prev[data.roomId] || [];
        return {
          ...prev,
          [data.roomId]: [...roomMsgs, data]
        };
      });
    });

    newSocket.on('user_typing', (data) => {
      setTypingUsers(prev => {
        const roomTyping = prev[data.roomId] || [];
        if (roomTyping.find(u => u.senderId === data.senderId)) return prev;
        return { ...prev, [data.roomId]: [...roomTyping, data] };
      });
      
      // Remove after 3 seconds
      setTimeout(() => {
        setTypingUsers(prev => {
          const roomTyping = (prev[data.roomId] || []).filter(u => u.senderId !== data.senderId);
          return { ...prev, [data.roomId]: roomTyping };
        });
      }, 3000);
    });

    return () => newSocket.disconnect();
  }, []);

  const handleSendMessage = (text, type = 'text') => {
    if (!socket || !activeChat || !text.trim()) return;

    const messageData = {
      roomId: activeChat.id,
      senderId: user.id,
      senderName: user.name,
      text,
      type,
      timestamp: new Date().toISOString(),
    };

    socket.emit('send_message', messageData);
    
    // Clear typing when sending
    setTypingUsers(prev => ({ ...prev, [activeChat.id]: [] }));

    // Optimistic update for sender
    setMessages(prev => {
      const roomMsgs = prev[activeChat.id] || [];
      return {
        ...prev,
        [activeChat.id]: [...roomMsgs, messageData]
      };
    });
  };

  const handleSelectChat = (chat) => {
    setActiveChat(chat);
    if (socket) {
      socket.emit('join_room', chat.id);
    }
  };

  const handleTyping = () => {
    if (!socket || !activeChat) return;
    socket.emit('typing', {
      roomId: activeChat.id,
      senderId: user.id,
      senderName: user.name,
    });
  };

  return (
    <div className="flex h-screen w-full bg-dark">
      <Sidebar 
        user={user} 
        onLogout={onLogout} 
        onSelectChat={handleSelectChat}
        activeChatId={activeChat?.id}
      />
      <ChatWindow 
        user={user}
        activeChat={activeChat} 
        messages={messages[activeChat?.id] || []}
        onSendMessage={handleSendMessage}
        onTyping={handleTyping}
        typingUsers={typingUsers[activeChat?.id] || []}
      />
    </div>
  );
};

export default Chat;
