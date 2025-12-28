import { useEffect, useState, createContext, useMemo } from "react";
import useApi from "../hooks/api";
import { storage } from "../utils/utils";

export const AuthContext = createContext({
  user: null,
  login: () => {},
  logout: () => {},
});

export default function AuthContextProvider({ children }) {
  const lastuser = storage.getUser();
  const [userData, setUserData] = useState(lastuser ?? null);

  const { execute } = useApi();

  const login = (user) => {
    storage.setUser(user);
    setUserData({ ...user });
    return user.role;
  };

  const logout = () => {
    setUserData(null);
  };

  const contextValue = useMemo(
    () => ({
      user: userData,
      login,
      logout,
    }),
    [userData]
  );

  // useEffect(() => {
  //   const checkAuth = async () => {
  //     const user = await execute(USER.ME);
  //     if (user) {
  //       login(user);
  //     } else {
  //       setUserData(null);
  //     }
  //   };

  //   checkAuth();
  // }, []);

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
}
