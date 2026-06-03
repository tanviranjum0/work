"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

const Page = () => {
  const router = useRouter();
  const isAlreadyLoggedIn: boolean = false;

  useEffect(() => {
    if (!isAlreadyLoggedIn) {
      router.push("/login");
    }
  }, [isAlreadyLoggedIn, router]);

  return <div>page</div>;
};

export default Page;
