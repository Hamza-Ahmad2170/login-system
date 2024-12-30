import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";

export default function Login() {
  return (
    <div className="flex flex-col items-center justify-center h-screen  max-w-3xl mx-auto ">
      <form className="w-full space-y-8  p-16 bg-slate-50 rounded-lg">
        <h1 className="text-bold text-6xl">Login</h1>
        <div>
          <Label htmlFor="email">Email</Label>
          <Input type="text" name="email" placeholder="email" />
        </div>
        <div>
          <Label htmlFor="password">Password</Label>
          <Input type="password" name="password" placeholder="password" />
        </div>
        <div className="text-right">
          <Button type="submit">Submit</Button>
        </div>
      </form>
    </div>
  );
}
