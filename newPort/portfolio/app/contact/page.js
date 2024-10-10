"use client";
// import { useRouter } from "next/navigation";
import { enqueueSnackbar, SnackbarProvider } from "notistack";
const page = () => {
  // const router = useRouter();
  const SendmailTransport = async (e) => {
    e.preventDefault();
    const email = document.getElementById("email").value;
    const message = document.getElementById("message").value;
    const result = await fetch("/api/mail", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        message,
      }),
    });
    const data = await result.json();
    console.log(data);
    if (data.Message == "Hello") {
      enqueueSnackbar("Message sent successfully!");
      document.getElementById("email").value = "";
      document.getElementById("message").value = "";
      // router.push("/");
    }
  };
  return (
    <div>
      <SnackbarProvider />
      <div className="relative w-[90vw] md:w-[calc(100%-5rem)] left-20 bg-[#111] top-24">
        <div className="mt-10 text-7xl font-bold text-center  ">
          Contact <span className="text-green-400">.</span>
        </div>
        <div className="text-xl w-[50vw] mx-auto text-center py-5 font-thin">
          Shoot me an email if you want to connect! You can also find me on
          Linkedin or Twitter if that's more your speed.
        </div>

        <form autoComplete="on" className="mx-auto w-[80vw] md:w-[50vw]">
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="email"
              name="email"
              id="email"
              className="block py-2.5 px-0 w-full  text-grey-400 bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="email"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Email address
            </label>
          </div>
          <div className="relative z-0 w-full mb-5 group">
            <input
              type="text"
              name="message"
              id="message"
              className="block py-2.5 px-0 w-full  text-grey-400  bg-transparent border-0 border-b-2 border-gray-300 appearance-none focus:outline-none focus:ring-0 focus:border-blue-600 peer"
              placeholder=" "
              required
            />
            <label
              htmlFor="message"
              className="peer-focus:font-medium absolute text-sm text-gray-500 dark:text-gray-400 duration-300 transform -translate-y-6 scale-75 top-3 -z-10 origin-[0] peer-focus:start-0 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto peer-focus:text-blue-600 peer-focus:dark:text-blue-500 peer-placeholder-shown:scale-100 peer-placeholder-shown:translate-y-0 peer-focus:scale-75 peer-focus:-translate-y-6"
            >
              Message
            </label>
          </div>
          <button
            className="rounded-2xl w-full border-2  border-green-400 bg-green-400 px-6 py-3 font-semibold uppercase text-black transition-all duration-300 hover:translate-x-[-4px] hover:translate-y-[-4px] hover:rounded-md hover:shadow-[4px_4px_0px_black] active:translate-x-[0px] active:translate-y-[0px] active:rounded-2xl active:shadow-none"
            onClick={(e) => SendmailTransport(e)}
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
};

export default page;
