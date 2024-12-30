import React, { useEffect, useState } from "react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import api from "@/api/axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const resp = await api.post("user/register", {
        email,
        password,
      });
      setEmail("");
      setPassword("");
      console.log(resp);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-screen  max-w-3xl mx-auto ">
      <form
        className="w-full space-y-8  p-16 bg-slate-50 rounded-lg"
        onSubmit={handleSubmit}
      >
        <h1 className="text-bold text-6xl">Register</h1>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input
            type="text"
            name="email"
            placeholder="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input
            type="password"
            name="password"
            placeholder="password"
            value={password}
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
