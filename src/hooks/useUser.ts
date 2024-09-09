import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useUser = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("User is null");
  }
  const { user, setUser } = context;
  return { user, setUser };
};
