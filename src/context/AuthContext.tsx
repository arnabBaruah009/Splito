import { createContext, ReactNode, useState } from "react";
import { UserInfo } from "../types";

type AuthContextType = {
  user: UserInfo | null;
  setUser: (user: UserInfo | null) => void;
};

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<AuthContextType | undefined | null>(
  undefined
);
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};
