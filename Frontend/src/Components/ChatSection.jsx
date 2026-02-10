import { useEffect, useRef } from "react";
import socket from "../socket";
import { Menu, Send } from "lucide-react";

export default function ChatSection({
  messages,
  selectedUser,
  typingUser,
  text,
  setText,
  sendMessage,
  user,
  isOnline,
  setIsSidebarOpen,
}) {
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };
  const bottomRef = useRef(null);
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);
  
  return (
    <main className="min-h-screen sm:min-h-0 flex-1 flex flex-col bg-[#18181B] relative">
      {/* Header */}
      <header className="h-16 px-4 sm:px-6 flex items-center border-b border-border bg-[#18181B]/95 backdrop-blur">
        <button
            onClick={() => setIsSidebarOpen(true)}
            className="sm:hidden text-white mr-3">
              <Menu />
              </button>
        {selectedUser ? (
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-primary/20 flex items-center justify-center text-primary font-bold text-sm">
              {selectedUser.username[0].toUpperCase()}
            </div>
            <div>
              <h2 className="font-semibold text-sm">{selectedUser.username}</h2>
              <span className="text-xs text-gray-400">
                {typingUser ? "typing…" : isOnline ? "online" : "offline"}
              </span>
            </div>
          </div>
        ) : (
          <span className="text-gray-300 justify-center flex items-center flex-1">Select a chat</span>
        )}
      </header>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-4 sm:space-y-6 flex flex-col">
        {messages.map((msg) => {
          const isMe = msg.senderId === user.id;

          return (
            <div
              key={msg._id}
              className={`flex items-end gap-3 max-w-[85%] sm:max-w-[70%]
                ${isMe ? "self-end flex-row-reverse" : "self-start"}`}
            >
              {/* Avatar */}
              <div
                className={`w-8 h-8 rounded-full flex items-center justify-center text-xs
                  ${
                    isMe ? "bg-primary text-white" : "bg-gray-700 text-gray-300"
                  }`}
              >
                {isMe
                  ? user.username[0].toUpperCase()
                  : selectedUser?.username[0].toUpperCase()}
              </div>

              {/* Bubble */}
              <div
                className={`p-3 sm:p-4 rounded-2xl text-sm leading-relaxed shadow-sm
                    ${
                        isMe
                        ? "bg-message text-white rounded-br-none"
                        : "bg-[#27272A] text-gray-200 rounded-bl-none"
                    }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
      <div ref={bottomRef} />
      </div>

      {/* Input */}
      {selectedUser && (
        <div className="p-3 sm:p-6 pt-2 bg-[#18181B]">
          <div className="flex items-end gap-2 bg-[#27272A] border border-border rounded-xl p-2 focus-within:border-primary/50">
            <textarea
              className="flex-1 bg-transparent resize-none outline-none text-sm px-2 py-2 max-h-28 sm:max-h-32"
              placeholder="Type a message..."
              rows={1}
              value={text}
              onChange={(e) => {
                setText(e.target.value);
                socket.emit("typing", {
                  senderId: user.id,
                  receiverId: selectedUser._id,
                });
              }}
              onKeyDown={handleKeyDown}
            />
            <button
              onClick={sendMessage}
              className="h-10 px-4 rounded-lg text-primary hover:bg-primary/20 font-medium text-sm"
            >
              <Send />
            </button>
          </div>
        </div>
      )}
    </main>
  );
}
