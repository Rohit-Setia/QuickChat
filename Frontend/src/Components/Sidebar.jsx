import React from 'react'

export default function Sidebar({ 
    user, 
    users, 
    onlineUsers, 
    unreadCounts, 
    selectedUser, 
    logout, 
    setSelectedUser, 
    fetchMessages, 
    markAsSeen 
  }) {  return (
    
      <div className="w-80 bg-sidebar border-r border-border flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <span><h3 className="text-primary font-semibold justify-center items-center">{user.username}</h3></span>
          <button
            onClick={logout}
            className="text-sm text-gray-400 hover:text-white"
          >
            Logout
          </button>
        </div>
        <hr />
        <div className="flex-1 overflow-y-auto p-2 space-y-1">
        {users.map((u) => {
          const isOnline = onlineUsers.includes(u._id);
          const unread = unreadCounts[u._id];
          return (
            <div
              key={u._id}
              onClick={() => {
                setSelectedUser(u);
                fetchMessages(u._id);
                markAsSeen(u._id);
              }}
              className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer
                ${
                  selectedUser?._id === u._id
                    ? "bg-surface"
                    : "hover:bg-surfaceHover"
                }`}
            >

            <div className="w-10 h-10 rounded-full bg-primary flex items-center justify-center font-semibold">
              {u.username[0].toUpperCase()}
            </div>

              <div className="flex-1">
                <div className="flex items-center gap-2">
                <span>{u.username}</span>
                {isOnline && (
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
              {unread > 0 && (
                <span className="bg-primary text-red-500 text-xs px-2 py-0.5 rounded-full">
                  ({unread})
                </span>
              )}
            </div>
          </div>
          );
        })}
      </div>
      </div>
  )
}
