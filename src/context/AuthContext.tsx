import { createContext, useContext, useState } from "react";
import { setAuthToken } from "../utils/authToken";

type AuthContextType = {
  token: string | null;
  setToken: (token: string | null) => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [token, setTokenState] = useState<string | null>(null);

  const setToken = (token: string | null) => {
    setTokenState(token);
    setAuthToken(token); // 🔑 sync with axios + socket
  };

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthToken = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuthToken must be used within AuthProvider");
  }
  return ctx;
};
