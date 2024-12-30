import { BrowserRouter, Route, Routes } from "react-router";
import Login from "./components/login";
import Register from "./components/register";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}
