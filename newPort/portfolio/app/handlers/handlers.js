import { enqueueSnackbar } from "notistack";
export const SendmailTransport = async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;
  const message = document.getElementById("message").value;
  // console.log(email, message);
  if (!email || !message) {
    return enqueueSnackbar("Please enter your email and message first...");
  } else {
    enqueueSnackbar("Sending Your Message...");
  }

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
  if (data.Message == "Message Sent") {
    await enqueueSnackbar("Message sent successfully!");
    document.getElementById("email").value = "";
    document.getElementById("message").value = "";
  }
};

export const handleProjectDetailsShow = async (id) => {
  const targeted = document.getElementById(id);
  targeted.classList.toggle("hidden");
};
