import { Field, Label } from "@headlessui/react";
import { motion, AnimatePresence } from "framer-motion";
import Footer from "../components/moleculas/Footer";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function SignUp() {
  const queryClient = useQueryClient();
  const navigate = useNavigate();
  const handleSubmit = () => {
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const name = document.getElementById("name").value;

    Mutation.mutate({ email, password, name });
  };
  const signUpHandler = (i) => {
    const res = fetch(
      "https://ticket-back-production.up.railway.app/api/users/register",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(i),
      }
    );
    return res;
  };
  const Mutation = useMutation({
    mutationFn: (d) => signUpHandler(d),
    onSuccess: (data) => {
      data.json().then((e) => {
        if (e.message == "Email already exists") {
          toast.error("Email already exists");
          document.getElementById("form").reset();
        } else {
          queryClient.invalidateQueries({ queryKey: ["user"] });
          toast.success("Registered successfully");
          navigate("/login");
        }
      });
    },

    onError: (error) => {
      toast.error(error);
    },
  });
  return (
    <div>
      {" "}
      <div className="contact-bg text-black px-6 py-12 sm:py-16 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="text-3xl font-bold tracking-tight  sm:text-4xl">
            Register
          </h2>
          <p className="mt-2 text-lg leading-8 ">
            Please create an account to RockGaan
          </p>
        </div>
        <AnimatePresence mode="sync">
          <motion.form
            id="form"
            key="signup"
            initial={{
              opacity: 0,
            }}
            whileInView={{ opacity: 1, scale: 1 }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: 0.3,
              ease: "easeIn",
              delay: 0.5,
            }}
            className="mx-auto py-5 mt-16 max-w-xl sm:mt-20"
          >
            <div className="flex flex-col">
              <div>
                <label
                  htmlFor="name"
                  className="block text-sm font-semibold leading-6 "
                >
                  Enter Your Name :
                </label>
                <div className="mt-2.5">
                  <input
                    type="text"
                    name="name"
                    id="name"
                    autoComplete="given-name"
                    className="block w-full rounded-md border-0 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black text-black focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="">
                <label
                  htmlFor="email"
                  className="block text-sm font-semibold leading-6 "
                >
                  Email :
                </label>
                <div className="mt-2.5">
                  <input
                    type="email"
                    name="email"
                    id="email"
                    autoComplete="email"
                    className="block w-full rounded-md border-0 px-3.5 py-2  shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black text-black focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <div className="">
                <label
                  htmlFor="password"
                  className="block text-sm font-semibold leading-6 "
                >
                  Password :
                </label>
                <div className="relative mt-2.5">
                  <input
                    type="password"
                    name="password"
                    id="password"
                    autoComplete="new-password"
                    className="block w-full text-black rounded-md border-0 px-1 py-2 pl-5 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-black focus:ring-1 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
                  />
                </div>
              </div>

              <Field as="div" className="flex gap-x-4 ">
                <Label className="text-sm leading-6 text-gray-300">
                  By continuing this, you agree to our{" "}
                  <a href="#" className="font-semibold text-indigo-600">
                    privacy&nbsp;policy
                  </a>
                </Label>
              </Field>
            </div>
            <div className="mt-10">
              <motion.button
                onClick={(e) => {
                  e.preventDefault();
                  handleSubmit();
                }}
                key="signupbutton"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95, rotate: "1.5deg" }}
                className="block text-white w-full rounded-md bg-red-400 px-3.5 py-2.5 text-center text-sm   shadow-sm hover:bg-red-800 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              >
                Sign Up
              </motion.button>
            </div>
          </motion.form>
          <div className="pt-5 border-t-4 text-white">
            {" "}
            <Footer />
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
}
