import { createContext } from "react";

type AuthContext = {
  token: string;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

export default function AuthProvider() {
  const [token, setToken] = useState<string>("");

  return <div>useAuth</div>;
}
