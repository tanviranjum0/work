function valid(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}
async function handleFormSubmit(event) {
  event.preventDefault();
  const loader = document.getElementById("loader-signup");
  const loaderButton = document.getElementById("loader-button-signup");
  loader.classList.remove("visually-hidden");
  loaderButton.classList.add("visually-hidden");
  const messageBox = document.getElementById("error-box");
  messageBox.textContent = "";
  const fullname = await document.getElementById("fullname-signup").value;
  const username = await document.getElementById("username-signup").value;
  const email = await document.getElementById("email-signup").value;
  const password = await document.getElementById("password-signup").value;
  const image = await document.getElementById("avatar-signup").files[0];
  if (fullname.length < 1) {
    messageBox.textContent = "Fullname is required";
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    return;
  }
  if (username.length < 1) {
    messageBox.textContent = "Password provide a desired username";
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    return;
  }

  if (!valid(email)) {
    messageBox.textContent = "Invalid email address.";
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    return;
  }
  if (password.length < 6) {
    messageBox.textContent = "Password should be at least 6 characters long.";
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    return;
  }
  if (image == undefined) {
    messageBox.textContent = "Please choose an image.";
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    return;
  }
  const res = await fetch(`http://localhost:3000/api/user/get-one`, {
    method: "post",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, username }),
  });
  const isEmailExist = await res.json();
  if (isEmailExist) {
    messageBox.textContent = "Email or username already exists";
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    return;
  }

  let form = new FormData();
  form.append("file", image);
  form.append("upload_preset", "xubbr2hv");
  form.append("cloud_name", "tanviranjum");
  const imageUpload = await fetch(
    `https://api.cloudinary.com/v1_1/tanviranjum/image/upload`,
    {
      method: "post",
      body: form,
    }
  );
  const imageUploadData = await imageUpload.json();
  if (imageUploadData) {
    avatar = imageUploadData.secure_url;
    const serverRes = await fetch("http://localhost:3000/api/user/create", {
      body: JSON.stringify({ fullname, username, password, email, avatar }),
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
    });
    const data = await serverRes.json();

    if (data.token) {
      loader.classList.add("visually-hidden");
      loaderButton.classList.remove("visually-hidden");
      localStorage.setItem("token", data.token);
      window.location.href = "index.html";
    }
  }
}

const fileInput = document.getElementById("avatar-signup");
fileInput.addEventListener("change", (event) => {
  const displayAvatar = document.getElementById("display-avatar");
  if (event.target.files && event.target.files[0]) {
    const reader = new FileReader();
    const file = event.target.files[0];
    reader.onloadend = () => {
      displayAvatar.src = reader.result;
    };
    reader.readAsDataURL(file);
  }
});

async function test() {
  const image = document.getElementById("avatar-signup").files[0];

  let form = new FormData();
  form.append("file", image);
  form.append("folder", "images/test");
  form.append("upload_preset", "xubbr2hv");
  form.append("cloud_name", "tanviranjum");
  const res = await fetch(
    `https://api.cloudinary.com/v1_1/tanviranjum/image/upload`,
    {
      method: "POST",
      body: form,
    }
  );
  const data = await res.json();
}
