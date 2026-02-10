import { useState, useContext } from "react";
import api from "@/lib/axios";
import { AuthContext } from "../context/AuthContext";
import { useToast } from "@/components/ui/use-toast";

const LoginForm = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { toast } = useToast();
  
  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post(`/auth/login`,
        { email, password }
      );
      login(res.data.user, res.data.token);
      toast({
        title: "Success 🎉",
        description: "Logged in successfully",
      });
    } catch (err) {
      toast({
        title: "Login failed",
        description: err.response?.data?.message || "Invalid credentials",
        variant: "destructive",
      });
    }
  };

  return (
    <form className="space-y-5" onSubmit={submitHandler}>
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
        Sign In →
      </button>
    </form>
  );
};

export default LoginForm;
