import { doc, onSnapshot } from "firebase/firestore";
import { createContext, ReactNode, useEffect, useState } from "react";
import { db } from "../firebase";
import { UserInfo } from "../types";

type AuthContextType = {
  user: UserInfo | null;
  setUserID: (user: string) => void;
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
  const [userID, setUserID] = useState<string>("#");
  const [user, setUser] = useState<UserInfo | null>(null);
  useEffect(() => {
    const unsub = onSnapshot(doc(db, "users", userID), (user) => {
      user.exists() && setUser(user.data() as UserInfo);
    });

    return unsub;
  }, [userID]);

  return (
    <AuthContext.Provider value={{ user, setUserID }}>
      {children}
    </AuthContext.Provider>
  );
};
