import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./components/login";
import Register from "./components/register";
import Protected from "./components/protected";
import { AuthContextProvider } from "./contexts/AuthContext";

export default function App() {
  return (
    <BrowserRouter>
      <AuthContextProvider>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/protected" element={<Protected />} />
        </Routes>
      </AuthContextProvider>
    </BrowserRouter>
  );
}
