import { useContext } from "react";
import { AccountContext } from "../AccountContext";
import { Outlet, Navigate } from "react-router-dom";

const useAuth = () => {
  const { user } = useContext(AccountContext);
  // const user = { loggedIn: false };
  return user && user.loggedIn;
};

const PrivateRoutes = () => {
  const isAuth = useAuth();
  return isAuth ? <Outlet /> : <Navigate to={"/"} />;
};

export default PrivateRoutes;
