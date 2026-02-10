import { useState } from "react";
import api from "@/lib/axios";
import { useToast } from "@/components/ui/use-toast";

const RegisterForm = ({ onSuccess }) => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/auth/register`, {
        username,
        email,
        password,
      });
      toast({
        title: "Success 🎉",
        description: "Account created successfully",
      });
      onSuccess(); 
      
    } catch (err) {
      toast({
        title: "Registration failed",
        description:
          err.response?.data?.message || "Something went wrong",
        variant: "destructive",
      });
      
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
      <button type="submit" className="w-full bg-primary hover:bg-primary/90 text-white py-3.5 rounded-xl font-medium">
        Create Account →
      </button>
    </form>
  );
};

export default RegisterForm;
