import { useState, useRef, useEffect } from 'react';
import { Send, Phone, Video, Info, Paperclip, Smile, MoreVertical } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatWindow = ({ user, activeChat, messages, onSendMessage, onTyping, typingUsers }) => {
  const [inputText, setInputText] = useState('');
  const [uploading, setUploading] = useState(false);

  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (inputText.trim()) {
      onSendMessage(inputText);
      setInputText('');
    }
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setUploading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch(`${import.meta.env.VITE_SERVER_URL || 'http://localhost:5000'}/upload`, {
        method: 'POST',
        body: formData,
      });
      const data = await response.json();
      onSendMessage(data.url, data.type.startsWith('image') ? 'image' : 'file');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('Upload failed');
    } finally {
      setUploading(false);
    }
  };

  if (!activeChat) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center bg-dark text-center p-8">
        <div className="mb-6 rounded-full bg-white/5 p-8">
          <Send size={64} className="text-gray-600 rotate-12" />
        </div>
        <h2 className="text-2xl font-bold">Your Messages</h2>
        <p className="mt-2 text-gray-400">Select a contact to start a conversation or start a new group.</p>
        <button className="mt-6 rounded-full bg-brand-500 px-6 py-2 font-semibold text-white transition-all hover:bg-brand-600 active:scale-95">
          Send Message
        </button>
      </div>
    );
  }

  return (
    <div className="flex flex-1 flex-col bg-[url('https://user-images.githubusercontent.com/15075759/28719144-86dc0f70-73b1-11e7-911d-60d70fcded21.png')] bg-opacity-5">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-white/10 bg-dark/80 p-4 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <img 
            src={activeChat.avatar} 
            alt={activeChat.name} 
            className="h-10 w-10 rounded-full bg-white/10"
          />
          <div>
            <h3 className="font-semibold">{activeChat.name}</h3>
            <p className="text-xs text-green-500">{activeChat.online ? 'Online' : 'Offline'}</p>
          </div>
        </div>
        <div className="flex items-center gap-4 text-gray-400">
          <button className="hover:text-white transition-colors"><Video size={20} /></button>
          <button className="hover:text-white transition-colors"><Phone size={20} /></button>
          <div className="h-6 w-px bg-white/10"></div>
          <button className="hover:text-white transition-colors"><Info size={20} /></button>
          <button className="hover:text-white transition-colors"><MoreVertical size={20} /></button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-6 space-y-4 custom-scrollbar bg-dark/60">
        {messages.map((msg, index) => (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            key={index}
            className={`flex w-full ${msg.senderId === user.id ? 'justify-end' : 'justify-start'}`}
          >
            <div 
              className={`max-w-[70%] rounded-2xl px-4 py-2 shadow-lg ${
                msg.senderId === user.id 
                  ? 'bg-brand-600 text-white rounded-tr-none' 
                  : 'bg-dark-lighter border border-white/10 text-gray-100 rounded-tl-none'
              }`}
            >
              {msg.type === 'image' ? (
                <img src={msg.text} alt="Shared" className="max-w-full rounded-lg mb-1" />
              ) : (
                <p className="text-sm">{msg.text}</p>
              )}
              <span className={`mt-1 block text-[10px] ${msg.senderId === user.id ? 'text-brand-100' : 'text-gray-500'}`}>
                {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
              </span>
            </div>
          </motion.div>
        ))}
        
        {typingUsers?.length > 0 && (
          <div className="flex justify-start">
            <div className="bg-dark-lighter border border-white/10 text-gray-400 text-xs rounded-2xl rounded-tl-none px-4 py-2">
              {typingUsers[0].senderName} is typing...
            </div>
          </div>
        )}

        <div ref={scrollRef} />
      </div>

      {/* Input */}
      <div className="p-4 bg-dark/80 backdrop-blur-md">
        <form onSubmit={handleSubmit} className="flex items-center gap-3">
          <button type="button" className="text-gray-400 hover:text-white transition-colors">
            <Smile size={24} />
          </button>
          <button 
            type="button" 
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="text-gray-400 hover:text-white transition-colors disabled:opacity-50"
          >
            <Paperclip size={24} />
          </button>
          <input 
            type="file" 
            className="hidden" 
            ref={fileInputRef} 
            onChange={handleFileUpload}
            accept="image/*,video/*,.pdf,.doc,.docx"
          />
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Type a message..."
              className="w-full rounded-2xl bg-white/5 border border-white/10 py-3 pl-4 pr-12 focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
              value={inputText}
              onChange={(e) => {
                setInputText(e.target.value);
                onTyping();
              }}
            />
            <button
              type="submit"
              disabled={!inputText.trim()}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-brand-500 p-2 text-white transition-all hover:bg-brand-600 active:scale-90 disabled:bg-gray-700 disabled:opacity-50"
            >
              <Send size={18} />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatWindow;
