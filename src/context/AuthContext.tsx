import { createContext, ReactNode, useEffect, useState } from "react";
import { onAuthStateChanged, User } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { auth, db } from "../firebase";
import { UserInfo } from "../types";

type AuthContextProviderProps = {
  children: ReactNode;
};

export const AuthContext = createContext<UserInfo | null>(null);
export const AuthContextProvider: React.FC<AuthContextProviderProps> = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [user, setUser] = useState<UserInfo | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      const userInfo = await getDoc(doc(db, "users", user.email));
      setUser(userInfo);
    });
    return () => {
      unsubscribe();
    };
  }, []);
  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};
