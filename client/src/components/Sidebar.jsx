import { Search, LogOut, MoreVertical, MessageSquarePlus } from 'lucide-react';

const MOCK_CHATS = [
  { id: '1', name: 'Alex Rivera', lastMsg: 'See you tomorrow!', time: '10:45 AM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Alex', online: true },
  { id: '2', name: 'Sarah Chen', lastMsg: 'The project is ready', time: '9:30 AM', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah', online: false },
  { id: '3', name: 'Dev Team', lastMsg: 'Jordan: Fixed the bug', time: 'Yesterday', avatar: 'https://api.dicebear.com/7.x/identicon/svg?seed=Dev', isGroup: true },
  { id: '4', name: 'Maria Garcia', lastMsg: 'Sent a photo', time: 'Monday', avatar: 'https://api.dicebear.com/7.x/avataaars/svg?seed=Maria', online: true },
];

const Sidebar = ({ user, onLogout, onSelectChat, activeChatId }) => {
  return (
    <div className="flex w-80 flex-col border-r border-white/10 bg-dark-surface md:w-96">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b border-white/10">
        <div className="flex items-center gap-3">
          <div className="relative">
            <img 
              src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} 
              alt="Profile" 
              className="h-10 w-10 rounded-full bg-white/10 p-0.5"
            />
            <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-dark-surface bg-green-500"></div>
          </div>
          <div>
            <h3 className="font-semibold">{user.name}</h3>
            <p className="text-xs text-gray-400">Online</p>
          </div>
        </div>
        <div className="flex items-center gap-2 text-gray-400">
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><MessageSquarePlus size={20} /></button>
          <button className="p-2 hover:bg-white/5 rounded-full transition-colors"><MoreVertical size={20} /></button>
          <button onClick={onLogout} className="p-2 hover:bg-red-500/10 hover:text-red-500 rounded-full transition-colors">
            <LogOut size={20} />
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
          <input 
            type="text" 
            placeholder="Search chats..."
            className="w-full rounded-xl bg-white/5 border border-white/10 py-2 pl-10 pr-4 text-sm focus:border-brand-500 focus:outline-none focus:ring-1 focus:ring-brand-500 transition-all"
          />
        </div>
      </div>

      {/* Status / Stories */}
      <div className="flex gap-4 p-4 overflow-x-auto custom-scrollbar border-b border-white/10 no-scrollbar">
        <div className="flex flex-col items-center gap-1 flex-shrink-0">
          <div className="relative h-14 w-14 rounded-full border-2 border-brand-500 p-0.5">
            <img src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${user.name}`} className="rounded-full" alt="My Status" />
            <div className="absolute bottom-0 right-0 rounded-full bg-brand-500 p-0.5 text-white border-2 border-dark-surface">
              <MessageSquarePlus size={12} />
            </div>
          </div>
          <span className="text-[10px] text-gray-400">My Status</span>
        </div>
        {MOCK_CHATS.filter(c => c.id !== '3').map(chat => (
          <div key={chat.id} className="flex flex-col items-center gap-1 flex-shrink-0 cursor-pointer">
            <div className="h-14 w-14 rounded-full border-2 border-brand-500 p-0.5">
              <img src={chat.avatar} className="rounded-full" alt={chat.name} />
            </div>
            <span className="text-[10px] text-gray-400 truncate w-14 text-center">{chat.name.split(' ')[0]}</span>
          </div>
        ))}
      </div>

      {/* Chat List */}
      <div className="flex-1 overflow-y-auto custom-scrollbar">
        {MOCK_CHATS.map((chat) => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat)}
            className={`flex w-full items-center gap-4 p-4 transition-colors hover:bg-white/5 ${activeChatId === chat.id ? 'bg-white/10' : ''}`}
          >
            <div className="relative h-12 w-12 flex-shrink-0">
              <img 
                src={chat.avatar} 
                alt={chat.name} 
                className="h-full w-full rounded-full bg-white/10"
              />
              {chat.online && (
                <div className="absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-dark-surface bg-green-500"></div>
              )}
            </div>
            <div className="flex flex-1 flex-col overflow-hidden text-left">
              <div className="flex items-center justify-between">
                <span className="font-medium truncate">{chat.name}</span>
                <span className="text-[10px] text-gray-500">{chat.time}</span>
              </div>
              <span className="truncate text-sm text-gray-400">{chat.lastMsg}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};

export default Sidebar;
