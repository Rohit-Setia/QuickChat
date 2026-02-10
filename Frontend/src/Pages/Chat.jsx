import { useContext, useEffect, useState, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import socket from "../socket";
import Sidebar from "../Components/Sidebar";
import ChatSection from "../Components/ChatSection";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const Chat = () => {
  const { user, token, logout } = useContext(AuthContext);
  const [users, setUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [text, setText] = useState("");
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const selectedUserRef = useRef(null);
  const [unreadCounts, setUnreadCounts] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  
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
      socket.off("onlineUsers", handleOnlineUsers);
      socket.off("receiveMessage", handleReceiveMessage);
      socket.off("typing", handleTyping);
    };
  }, [user.id]);

  useEffect(() => {
    const fetchUsers = async () => {
      const res = await axios.get(`${BACKEND_URL}/auth/users`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      const fetchUnreadCounts = async (usersList) => {
        const counts = {};
        for (let u of usersList) {
          const res = await axios.get(
            `${BACKEND_URL}/messages/unread/${u._id}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            },
          );
          counts[u._id] = res.data.count;
        }
        setUnreadCounts(counts);
      };
      setUsers(res.data);
      fetchUnreadCounts(res.data);
    };
    fetchUsers();
  }, [token]);

  const fetchMessages = async (userId) => {
    const res = await axios.get(
      `${BACKEND_URL}/messages/${userId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    setMessages(res.data);
  };

  const sendMessage = async () => {
    if (!text) return;
    const res = await axios.post(
      `${BACKEND_URL}/messages`,
      {
        receiverId: selectedUser._id,
        text,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
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
    await axios.put(
      `${BACKEND_URL}/messages/seen/${userId}`,
      {},
      {
        headers: { Authorization: `Bearer ${token}` },
      },
    );

    setUnreadCounts((prev) => ({
      ...prev,
      [userId]: 0,
    }));
  };

  return (
    <div className="flex h-screen bg-bg">
      {/* Sidebar */}
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

      {/* Chat */}
     
      <ChatSection user={user} messages={messages} selectedUser={selectedUser} typingUser={typingUser} text={text} setText={setText} sendMessage={sendMessage} isOnline={selectedUser && onlineUsers.includes(selectedUser._id)} setIsSidebarOpen={setIsSidebarOpen} />
      </div>
  );
};

export default Chat;
