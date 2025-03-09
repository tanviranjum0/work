function valid(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}

async function handleLogin(event) {
  event.preventDefault();
  const loader = document.getElementById("loader-login");
  const loaderButton = document.getElementById("loader-button-login");
  loader.classList.remove("visually-hidden");
  loaderButton.classList.add("visually-hidden");
  const messageBox = document.getElementById("error-box-login");
  messageBox.textContent = "";
  const email = await document.getElementById("email-login").value;
  const password = await document.getElementById("password-login").value;
  if (!valid(email)) {
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    messageBox.classList.remove("text-success");
    messageBox.classList.add("text-danger");
    messageBox.textContent = "Invalid Email";
    return;
  }
  if (password == "") {
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    messageBox.classList.remove("text-success");
    messageBox.classList.add("text-danger");
    messageBox.textContent = "Password is required";
    return;
  }
  const res = await fetch(`http://localhost:3000/api/user/login`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, password }),
  });
  const data = await res.json();
  if (data.token && data.message == "Login successfully!") {
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    localStorage.setItem("token", data.token);
    messageBox.classList.remove("text-danger");
    messageBox.classList.add("text-success");
    messageBox.textContent = "Login successful!";
    window.location.href = "index.html";
  } else if (data.message == "Wrong Credentials") {
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    messageBox.classList.remove("text-success");
    messageBox.classList.add("text-danger");
    messageBox.textContent = "Wrong Credentials";
  } else if (data.message == "Login Problem") {
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    messageBox.classList.remove("text-success");
    messageBox.classList.add("text-danger");
    messageBox.textContent = "Login Problem";
  } else if (data.message == "No user found ..") {
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    messageBox.classList.remove("text-success");
    messageBox.classList.add("text-danger");
    messageBox.textContent = "No user found ..";
  }
}
