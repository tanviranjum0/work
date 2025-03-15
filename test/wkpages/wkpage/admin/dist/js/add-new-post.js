const handleCreatePost = async (event) => {
  event.preventDefault();
  const loader = document.getElementById("loader-add-post");
  const loaderButton = document.getElementById("add-post-publish-button");
  loader.classList.remove("visually-hidden");
  loaderButton.classList.add("visually-hidden");
  const messageBox = document.getElementById("error-box-add-post");
  messageBox.textContent = "";
  const title = await document.getElementById("add-post-title").value;
  const visibility = await document.getElementById("add-post-visibility").value;
  const tagSelector = document.getElementById("input_tags");
  var tags = Array.from(tagSelector.options)
    .filter(function (option) {
      return option.selected;
    })
    .map(function (option) {
      return option.value;
    });
  const image = await document.getElementById("add-post-image-input").files[0];
  const category = await document.getElementById("add-post-category").value;
  const content = await window.parent.tinymce.get("classic").getContent();
  // console.log(content);
  if (title.length < 1) {
    messageBox.textContent = "Title is required";
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    return;
  }
  if (content < 1) {
    messageBox.textContent = "Content text is required";
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    return;
  }

  if (category == "Select a category") {
    messageBox.textContent = "Please select a category.";
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    return;
  }
  if (tags.length == 0) {
    messageBox.textContent = "Please input a tag.";
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    return;
  }
  if (category == "Select a category") {
    messageBox.textContent = "Please select a category.";
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
  console.log(imageUploadData);
  if (imageUploadData) {
    const res = await fetch("http://localhost:3000/api/blog/create", {
      headers: {
        "Content-Type": "application/json",
        authorization: `${localStorage.getItem("token")}`,
      },
      body: JSON.stringify({
        title,
        visibility,
        poster: imageUploadData.secure_url,
        category,
        content,
        tags,
      }),
      method: "post",
    });
    const data = await res.json();
    console.log(data);
    // data.blog.owner_id = data.owner;
    if (data.message == "Successful") {
      localStorage.setItem("blog-details", JSON.stringify(data.blogDetail));
      console.log(JSON.parse(localStorage.getItem("blog-details")));
      loader.classList.add("visually-hidden");
      loaderButton.classList.remove("visually-hidden");
      window.location.href = "./../inner_pages/blog-details.html";
    } else {
      messageBox.textContent = data.message;
      loader.classList.add("visually-hidden");
      loaderButton.classList.remove("visually-hidden");
    }
    return;
  }
};

const handleGetOneBlog = async () => {
  const blog = await fetch(`http://localhost:3000/api/blog/${blogId}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `${localStorage.getItem("token")}`,
    },
    method: "get",
  });
};

const handleUpdateOneBlog = async () => {
  const blog = await fetch(`http://localhost:3000/api/blog/${blogId}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `${localStorage.getItem("token")}`,
    },
    body: JSON.stringify({ title: "new title" }),
    method: "put",
  });
};
const handleDeleteOneBlog = async () => {
  const blog = await fetch(`http://localhost:3000/api/blog/${blogId}`, {
    headers: {
      "Content-Type": "application/json",
      authorization: `${localStorage.getItem("token")}`,
    },
    method: "delete",
  });
};

const test = () => {
  // const content = await window.parent.tinymce.get("classic").getContent();
  // console.log(window.location.hostname);
  // window.location.href = "./../inner_pages/blog-details.html";

  const content = document.getElementById("input_tags");
  var selected = Array.from(content.options)
    .filter(function (option) {
      return option.selected;
    })
    .map(function (option) {
      return option.value;
    });
  console.log(selected.length);
};
