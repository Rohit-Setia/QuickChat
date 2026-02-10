import { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";

const Login = () => {
  const { login } = useContext(AuthContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submitHandler = async (e) => {
    try{e.preventDefault();
    const res = await axios.post("http://localhost:5000/api/auth/login", {
      email,
      password,
    });
    login(res.data.user, res.data.token);
  }catch (err) {
    console.error("LOGIN ERROR:", err.response?.data || err.message);
    alert(err.response?.data?.message || "Login failed");
  }
  };
  return (
    <form onSubmit={submitHandler}>
      <h2>Login</h2>
      <input placeholder="Email" onChange={(e) => setEmail(e.target.value)} />
      <input
        placeholder="Password"
        type="password"
        onChange={(e) => setPassword(e.target.value)}
      />
      <button>Login</button>
    </form>
  );
};

export default Login;
