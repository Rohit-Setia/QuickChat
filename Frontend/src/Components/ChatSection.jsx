export default function ChatSection({
    messages,
    selectedUser,
    typingUser,
    text,
    setText,
    sendMessage,
    user,
    isOnline,
  }) {
    return (
      <div className="flex-1 flex flex-col bg-bg">
  
        {/* HEADER */}
        <div className="h-16 px-6 flex items-center border-b border-border">
          {selectedUser ? (
            <div>
              <div className="flex items-center gap-2">
                <p className="font-semibold">{selectedUser.username}</p>
                {isOnline && (
                  <span className="w-2 h-2 bg-green-500 rounded-full" />
                )}
              </div>
              <p className="text-sm text-textMuted">
                {typingUser ? "typing…" : isOnline ? "online" : "offline"}
              </p>
            </div>
          ) : (
            <p className="text-textMuted">Select a chat</p>
          )}
        </div>
  
        {/* MESSAGES */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
          {messages.map((msg) => (
            <div
              key={msg._id}
              className={`max-w-[65%] px-4 py-3 rounded-2xl
                ${
                  msg.senderId === user.id
                    ? "bg-primary text-white ml-auto"
                    : "bg-surface"
                }`}
            >
              {msg.text}
            </div>
          ))}
        </div>
  
        {/* INPUT */}
        {selectedUser && (
          <div className="p-4 border-t border-border">
            <div className="flex items-center gap-3 bg-surface rounded-2xl px-4 py-3 border border-border">
              <input
                className="flex-1 bg-transparent outline-none"
                value={text}
                onChange={(e) => {
                  setText(e.target.value);
                  socket.emit("typing", {
                    senderId: user.id,
                    receiverId: selectedUser._id,
                  });
                }}
                placeholder="Type a message…"
              />
              <button
                onClick={sendMessage}
                className="bg-primary hover:bg-primarySoft px-4 py-2 rounded-xl"
              >
                Send
              </button>
            </div>
          </div>
        )}
      </div>
    );
  }
  