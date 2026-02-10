import { useState } from "react";
import axios from "axios";
const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

const RegisterForm = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BACKEND_URL}/auth/register`, {
        username,
        email,
        password,
      });
      onSuccess(); 
    } catch (err) {
      alert(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <form className="space-y-5" onSubmit={submitHandler}>
      <input
        placeholder="Username"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        className="w-full bg-surface-soft border border-border rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
      />
      <input
        placeholder="Email address"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        className="w-full bg-surface-soft border border-border rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
      />
      <input
        type="password"
        placeholder="Password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        className="w-full bg-surface-soft border border-border rounded-xl py-3.5 px-4 text-sm focus:ring-2 focus:ring-primary/50 outline-none"
      />
      <button className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-medium">
        Create Account →
      </button>
    </form>
  );
};

export default RegisterForm;
