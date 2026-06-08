"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();

  useEffect(() => {
    const cachedUser = localStorage.getItem("user");
    if (!cachedUser) {
      router.push("/login");
    } else {
      router.push("/home");
    }
  }, [router]);

  return <div>page</div>;
};

export default Page;
