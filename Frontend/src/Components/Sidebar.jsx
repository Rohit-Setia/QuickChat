import { useState, useEffect } from "react";
import api from "@/lib/axios";
export default function Sidebar({
  user,
  users,
  onlineUsers,
  unreadCounts,
  selectedUser,
  setSelectedUser,
  fetchMessages,
  markAsSeen,
  logout,
  isSidebarOpen,
  setIsSidebarOpen,
}) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  
  useEffect(() => {
    const searchUsers = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      const res = await api.get(`/auth/search?username=${query}`);
      setResults(res.data);
    };
    searchUsers();
  }, [query]);
  
    return (
      <aside className= {`fixed sm:relative inset-y-0 left-0 z-40 w-full sm:w-80 flex-shrink-0 flex flex-col border-r border-border bg-[#202023] transform transition-transform duration-300
        ${isSidebarOpen ? "translate-x-0" : "-translate-x-full sm:translate-x-0"}`}>
  
        {/* Header */}
        <div className="h-16 px-6 flex items-center justify-between border-b border-border">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-white font-medium text-sm">
              {user.username[0].toUpperCase()}
            </div>
            <span className="font-semibold">{user.username}</span>
          </div>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-primary transition-colors"
          >
            Logout
          </button>
        </div>
  
        <div className="p-3 border-b border-border">
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search or add user..."
            className="w-full px-3 py-2 rounded-lg bg-zinc-800 text-sm outline-none focus:ring-2 focus:ring-primary/50"
          />
        </div>
        {query && results.length > 0 && (
  <div className="px-3 py-2 space-y-1">
    {results.map((u) => (
      <button
        key={u._id}
        onClick={() => {
          setSelectedUser(u);
          fetchMessages(u._id);
          setQuery("");   
          setResults([]);
        }}
        className="w-full text-left px-2 py-2 rounded hover:bg-zinc-700 text-sm"
      >
        {u.username}
      </button>
    ))}
  </div>
)}


        {/* User list */}
        <div className="flex-1 overflow-y-auto p-3 space-y-1 scrollbar-thin">
          {users.map((u) => {
            const isOnline = onlineUsers.includes(u._id);
            const unread = unreadCounts[u._id] || 0;
  
            return (
              <button
                key={u._id}
                onClick={() => {
                  setSelectedUser(u);
                  fetchMessages(u._id);
                  markAsSeen(u._id);
                  setIsSidebarOpen(false);
                }}
                className={`w-full px-3 py-3 rounded-lg flex items-center gap-3 transition-all
                  ${
                    selectedUser?._id === u._id
                      ? "bg-primary/30 border border-border"
                      : "hover:bg-white/5"
                  }`}
              >
                {/* Avatar */}
                <div className="relative">
                  <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-gray-700 flex items-center justify-center font-medium">
                    {u.username[0].toUpperCase()}
                  </div>
                  {isOnline && (
                    <span className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-[#202023] rounded-full" />
                  )}
                </div>
  
                {/* Name + preview */}
                <div className="flex flex-col items-start flex-1 overflow-hidden">
                  <span className="font-medium text-sm">{u.username}</span>
                </div>
  
                {/* Unread */}
                {unread > 0 && (
                  <span className="bg-primary text-white text-xs px-2 py-0.5 rounded-full">
                    {unread}
                  </span>
                )}
              </button>
            );
          })}
        </div>
        <div className="mt-auto p-4 text-xs text-gray-500 border-t border-border">
          <p>QuickChat © 2026</p>
          <p>Made by Rohit Setia</p>
        </div>

      </aside>
    );
  }
  