import { useNavigate } from "react-router";
import { createContext, useContext, useMemo } from "react";

import { User } from "../types";
import { useLocalStorage } from "./useLocalStorage";

const AuthContext = createContext({
  user : null,
  login: () => { },
});

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useLocalStorage<User | null>("user", null);
  const navigate = useNavigate();

  const login = (data) => {
    setUser(data);
    navigate("/");
  };

  const value = useMemo(() => ({ user, login }), [user, login]);

  return (<AuthContext.Provider value={value}>{children}</AuthContext.Provider>);
};
