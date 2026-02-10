import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "./context/AuthContext";
import Chat from "./pages/Chat";
import CredentialPage from "./pages/CredentialPage";
import { Toaster } from "@/components/ui/toaster";

function App() {
  const { user } = useContext(AuthContext);

  return (
    <>
    <BrowserRouter>
      <Routes>
      <Route path="/auth" element={!user ? <CredentialPage /> : <Navigate to="/" />} />
        <Route path="/" element={user ? <Chat /> : <Navigate to="/auth" />} />
        <Route path="*" element={<Navigate to={user ? "/" : "/auth"} />}
        />
      </Routes>
    </BrowserRouter>
    <Toaster />
    </>
  );
}

export default App;
