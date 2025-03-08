async function handleLogin(event) {
  event.preventDefault();
  const messageBox = document.getElementById("error-box-login");
  messageBox.textContent = "";
  const email = await document.getElementById("email-login").value;
  const password = await document.getElementById("password-login").value;
  const res = await fetch(`http://localhost:3000/api/user/login`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.token) {
    localStorage.setItem("token", data.token);
    messageBox.classList.remove("text-danger");
    messageBox.classList.add("text-success");
    messageBox.textContent = "Login successful!";
  } else if (data.status == "Wrong Credentials") {
    messageBox.classList.remove("text-success");
    messageBox.classList.add("text-danger");
    messageBox.textContent = "Wrong Credentials";
  } else if (data.status == "Login Problem") {
    messageBox.classList.remove("text-success");
    messageBox.classList.add("text-danger");
    messageBox.textContent = "Login Problem";
  } else if (data.status == "No user found ..") {
    messageBox.classList.remove("text-success");
    messageBox.classList.add("text-danger");
    messageBox.textContent = "No user found ..";
  }
  window.location.href = "index.html";
}
