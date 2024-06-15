"use client";
const Form = () => {
  return (
    <form id="contact" className="flex flex-col">
      <div className="mb-6">
        <label
          htmlFor="email"
          className="text-black dark:text-[#C4D7F6] block mb-2 text-sm font-medium"
        >
          Your Email
        </label>
        <input
          name="email"
          type="email"
          id="email"
          required
          className="bg-[#d7f7f5] border border-[#33353F] placeholder-[#9CA2A9] text-black text-sm rounded-lg block w-full p-2.5"
          placeholder="Tanvir.dev@gmail.com"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="subject"
          className="text-black block dark:text-[#C4D7F6] text-sm mb-2 font-medium"
        >
          Subject
        </label>
        <input
          name="subject"
          type="text"
          id="subject"
          required
          className="bg-[#d7f7f5] border border-[#33353F] placeholder-[#9CA2A9] text-black text-sm rounded-lg block w-full p-2.5"
          placeholder="Just saying hi"
        />
      </div>
      <div className="mb-6">
        <label
          htmlFor="message"
          className="text-black dark:text-[#C4D7F6] block text-sm mb-2 font-medium"
        >
          Message
        </label>
        <textarea
          name="message"
          id="message"
          className="bg-[#d7f7f5] border border-[#33353F] placeholder-[#9CA2A9] text-black text-sm rounded-lg block w-full p-2.5"
          placeholder="Let's talk about..."
        />
      </div>
      <button
        type="submit"
        className="hover:bg-gray-100 bg-gray-800 hover:text-black text-white border-4 border-gray-700 font-medium py-2.5 px-5 rounded-lg w-full"
      >
        Send Message
      </button>
    </form>
  );
};

export default Form;
