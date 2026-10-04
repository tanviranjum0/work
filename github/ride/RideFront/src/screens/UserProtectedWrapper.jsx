import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { clearSession } from "../utils/api";
import { useUser } from "../contexts/UserContext";
import VerifyEmail from "../components/VerifyEmail";
import Loading from "./Loading";

function UserProtectedWrapper({ children }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { user, setUser } = useUser();

  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    setLoading(true);
    api
      .get("/user/profile")
      .then((response) => {
        if (response.status === 200) {
          const user = response.data.user;
          setUser(user);
          localStorage.setItem(
            "userData",
            JSON.stringify({ type: "user", data: user })
          );

          setIsVerified(user.emailVerified);
        }
      })
      .catch(() => {
        // A plain 401 that survived the shared client's refresh attempt means the
        // session is really gone; clearSession() may have already run, this is a backstop.
        clearSession();
        navigate("/");
      })
      .finally(() => {
        setLoading(false);
      });
  }, [token]);

  if (loading) return <Loading />;

  if (isVerified == false) {
    return <VerifyEmail user={user} role={"user"} />;
  }

  return <>{children}</>;
}


export default UserProtectedWrapper;
