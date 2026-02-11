import { useContext, useEffect, useState, useRef } from "react";
import api from "@/lib/axios";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";
import Sidebar from "../Components/Sidebar";
import ChatSection from "../Components/ChatSection";

const Chat = () => {
  const { user, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const selectedUserRef = useRef(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchEndX = useRef(0);

  const handleTouchStart = (e) => {
    touchStartX.current = e.changedTouches[0].screenX;
  };
  
  const handleTouchMove = (e) => {
    touchEndX.current = e.changedTouches[0].screenX;
  };
  
  const handleTouchEnd = () => {
    const distance = touchEndX.current - touchStartX.current;
    if (distance > 75) {
      setIsSidebarOpen(true);
    }
    if (distance < -75) {
      setIsSidebarOpen(false);
    }
  };
  
  useEffect(() => {
    selectedUserRef.current = selectedUser;
  }, [selectedUser]);

  useEffect(() => {
    socket.connect();
    socket.emit("userConnected", user.id);

    const handleOnlineUsers = (users) => {
      setOnlineUsers(users);
    };

    const handleReceiveMessage = (message) => {
      const currentChatUserId = selectedUserRef.current?._id;
      if (
        message.senderId === currentChatUserId ||
        message.receiverId === currentChatUserId
      ) {
        setMessages((prev) => [...prev, message]);
      }
      if (currentChatUserId === message.senderId) {
        markAsSeen(message.senderId);
      } else {
        setUnreadCounts((prev) => ({
          ...prev,
          [message.senderId]: (prev[message.senderId] || 0) + 1,
        }));
        setUsers((prevUsers) => {
          const exists = prevUsers.some(
            (u) => u._id === message.senderId
          );
    
          if (exists) return prevUsers;
          return [
            {
              _id: message.senderId,
              username: message.senderUsername, 
            },
            ...prevUsers,
          ];
        });
      }
    };

    const handleTyping = (senderId) => {
      if (senderId === selectedUserRef.current?._id) {
        setTypingUser(senderId);
        setTimeout(() => setTypingUser(null), 1000);
      }
    };

    socket.on("onlineUsers", handleOnlineUsers);
    socket.on("receiveMessage", handleReceiveMessage);
    socket.on("typing", handleTyping);

    return () => {
      socket.emit("userDisconnected", user.id);
      socket.disconnect();
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("typing", handleTyping);
    };
  }, [user.id]);

useEffect(() => {
  const fetchChatUsers = async () => {
    try {
      const res = await api.get("/messages/chats");
      const usersList = res.data;
      setUsers(usersList);
      const counts = {};
      for (let u of usersList) {
        const unreadRes = await api.get(`/messages/unread/${u._id}`);
        counts[u._id] = unreadRes.data.count;
      }
      setUnreadCounts(counts);
    } catch (err) {
      console.error(err);
    }
  };

  fetchChatUsers();
}, []);


  const fetchMessages = async (userId) => {
    const res = await api.get(`/messages/${userId}`);
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!text.trim()) return;
    const res = await api.post(`/messages`,
      {
        receiverId: selectedUser._id,
        text,
      },
    );
    socket.emit("sendMessage", {
      senderId: user.id,
      receiverId: selectedUser._id,
      text,
    });
    setMessages([...messages, res.data]);
    setText("");
  };

  const markAsSeen = async (userId) => {
    await api.put(`/messages/seen/${userId}`);
    setUnreadCounts((prev) => ({
      ...prev,
      [userId]: 0,
    }));
  };

  return (
    <div className="flex h-screen bg-bg " onTouchStart={handleTouchStart} onTouchMove={handleTouchMove} onTouchEnd={handleTouchEnd}>

      <Sidebar
      user={user}
      users={users}
      onlineUsers={onlineUsers}
      unreadCounts={unreadCounts}
      selectedUser={selectedUser}
      logout={logout}
      setSelectedUser={setSelectedUser}
      fetchMessages={fetchMessages}
      markAsSeen={markAsSeen}
      isSidebarOpen={isSidebarOpen} 
      setIsSidebarOpen={setIsSidebarOpen} />


      <ChatSection user={user} messages={messages} selectedUser={selectedUser} typingUser={typingUser} text={text} setText={setText} sendMessage={sendMessage} isOnline={selectedUser && onlineUsers.includes(selectedUser._id)} setIsSidebarOpen={setIsSidebarOpen} />
      </div>
  );
};

export default Chat;
