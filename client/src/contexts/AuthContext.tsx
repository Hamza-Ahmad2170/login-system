import { useQueryClient } from "@tanstack/react-query";
import { createContext, useCallback, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";

type AuthContext = {
  // token: string;
  authToken: string | undefined;
  setAuthToken: (token: string | undefined) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContext | undefined>(undefined);

type Props = {
  readonly children: React.ReactNode;
};

function AuthContextProvider({ children }: Props) {
  const [authToken, setAuthToken] = useState<string | undefined>(
    () => localStorage.getItem("accessToken") || undefined
  );
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { pathname } = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (accessToken && pathname === "/") {
      setAuthToken(accessToken);
      navigate("/protected");
    }
  }, [navigate, pathname]);

  // const logout = useCallback(() => {
  //   setAuthToken(undefined);
  //   localStorage.removeItem("accessToken");
  //   queryClient.clear(); // Clear all queries on logout
  //   navigate("/");
  // }, [navigate, queryClient]);

  const logout = useCallback(() => {
    setAuthToken(undefined);
    localStorage.removeItem("accessToken");
    queryClient.clear(); // Clear all queries on logout
    navigate("/");
  }, [navigate, queryClient]);

  return (
    <AuthContext.Provider
      value={{
        authToken,
        setAuthToken,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export { AuthContextProvider, AuthContext };
