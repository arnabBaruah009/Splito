import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

export const useUser = () => {
  const user = useContext(AuthContext);
  if (!user) {
    throw new Error("User is null");
  }
  return user;
};
