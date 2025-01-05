import { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import axios from "@/api/axios";
import useAuth from "@/hooks/useAuth";
import { useNavigate } from "react-router";
import { AxiosError } from "axios";
import { refreshSchema } from "@/api-validator/refresh";

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();
  const { authToken, setAuthToken } = useAuth();
  console.log(authToken);

  useEffect(() => {
    if (authToken) {
      navigate("/protected");
    }
  }, [navigate, authToken]);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const resp = await axios.post(
        "/user/login",
        {
          email,
          password,
        },
        {
          headers: {
            "Content-Type": "application/json",
          },
          withCredentials: true,
        }
      );

      const data = refreshSchema.parse(resp.data);

      if (!data.success) {
        throw new Error(data.message);
      }

      setEmail("");
      setPassword("");
      localStorage.setItem("accessToken", data.accessToken);
      setAuthToken(data.accessToken);
    } catch (error) {
      if (error instanceof AxiosError) {
        console.log(error.response?.data?.message);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen  max-w-3xl mx-auto ">
      <form
        className="w-full space-y-8  p-16 bg-slate-50 rounded-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-bold text-6xl">Login</h1>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="text"
            name="email"
            placeholder="email"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="password"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
        <div className="text-right">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
}
