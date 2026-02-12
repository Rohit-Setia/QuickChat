import { useState} from "react";
import { MessageCircle } from 'lucide-react'
import LoginForm from "../Components/Login";
import RegisterForm from "../Components/Register";

const CredentialPage = () => {
  const [mode, setMode] = useState("login");
  return (
    <div className="min-h-screen flex items-center justify-center px-4 bg-bg text-gray-100 relative">

      {/* purple glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[300px] sm:w-[500px] md:w-[700px] h-[200px] sm:h-[300px] md:h-[400px] bg-primary/10 blur-[120px]" />

      <div className="w-full max-w-sm sm:max-w-md px-4 sm:px-6 md:px-0 z-10">
        <div className="flex flex-col items-center mb-8">
          <div className="w-32 h-32 bg-surface-soft rounded-2xl flex items-center justify-center mb-4 ring-1 ring-white/5">
            <span className="text-3xl text-primary">
            <img src="/public/quickchat.png" alt="QuickChat Logo" className="w-32 h-32" />
          </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold">QuickChat</h1>
          <p className="text-gray-400 text-sm">
            Connect with anyone, anywhere
          </p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-6 sm:p-8 shadow-2xl backdrop-blur-md">
          <div className="bg-surface-soft p-1 rounded-xl flex mb-8 border border-border">
          <button
            onClick={() => setMode("login")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition
              ${
                mode === "login"
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white"
              }`}
          >
            Login
          </button>
          <button
            onClick={() => setMode("register")}
            className={`flex-1 py-2.5 text-sm font-medium rounded-lg transition
              ${
                mode === "register"
                  ? "bg-primary text-white"
                  : "text-gray-400 hover:text-white"
              }`}
          >
            Register
          </button>
        </div>

        {mode === "login" ? (
          <LoginForm />
        ) : (
          <RegisterForm onSuccess={() => setMode("login")} />
        )}
      </div>
    </div>
  </div>
  );
};

export default CredentialPage;
