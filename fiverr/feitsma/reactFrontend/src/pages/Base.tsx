import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Base = () => {
  const router = useNavigate();

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (!cachedUser) {
      router("/login");
    } else {
      router("/home");
    }
  }, [router]);

  return (
    <div className="h-screen w-creen flex justify-center items-center">
      <div className="text-2xl">Loading...</div>
    </div>
  );
};

export default Base;
