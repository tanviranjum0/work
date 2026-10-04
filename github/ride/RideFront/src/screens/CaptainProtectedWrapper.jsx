import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api, { clearSession } from "../utils/api";
import { useCaptain } from "../contexts/CaptainContext";
import VerifyEmail from "../components/VerifyEmail";
import Loading from "./Loading";

function CaptainProtectedWrapper({ children }) {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();
  const { captain, setCaptain } = useCaptain();

  const [loading, setLoading] = useState(true);
  const [isVerified, setIsVerified] = useState(null);

  useEffect(() => {
    if (!token) {
      navigate("/");
      return;
    }

    api
      .get("/captain/profile")
      .then((response) => {
        if (response.status === 200) {
          const captain = response.data.captain;
          setCaptain(captain);
          localStorage.setItem(
            "userData",
            JSON.stringify({ type: "captain", data: captain, }));
          setIsVerified(captain.emailVerified);
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
    return <VerifyEmail user={captain} role={"captain"} />;
  }

  return <>{children}</>;
}

export default CaptainProtectedWrapper;
