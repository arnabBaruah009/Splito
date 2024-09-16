import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Cookies from "universal-cookie";
import { useUser } from "../hooks/useUser";

const PersistentUser = () => {
  const { user, setUserID } = useUser();
  const navigate = useNavigate();
  const cookies = new Cookies();
  useEffect(() => {
    const getUser = () => {
      const userID = cookies.get("splito-500K-bSnjthd6R34VKoZS2B3");
      if (!userID) {
        return navigate("/login");
      }
      setUserID(userID);
      navigate("/user/dashboard");
    };
    !user && getUser();
  }, []);
  return <Outlet />;
};

export default PersistentUser;
