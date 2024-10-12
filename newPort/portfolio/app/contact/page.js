"use client";
import { SnackbarProvider } from "notistack";
import Contact from "../components/Contact";
const page = () => {
  return (
    <div>
      <SnackbarProvider />
      <Contact />
    </div>
  );
};

export default page;
