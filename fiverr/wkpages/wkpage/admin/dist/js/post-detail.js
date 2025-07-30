const blog = JSON.parse(localStorage.getItem("post-detail"));
const postDetailsPageInitialLoad = () => {
  document.getElementById("post-detail-title").value = blog.title;
  document.getElementById("classic").innerHTML = blog.content;
};
postDetailsPageInitialLoad();

const handleUpdateBlog = async (event) => {
  event.preventDefault();
  let title;
  let content;

  const loader = document.getElementById("loader-post-detail");
  const loaderButton = document.getElementById("post-detail-publish-button");
  loader.classList.remove("visually-hidden");
  loaderButton.classList.add("visually-hidden");
  const messageBox = document.getElementById("error-box-post-detail");
  messageBox.textContent = "";
  const ti = await document.getElementById("post-detail-title").value;
  const visibility = await document.getElementById("post-detail-visibility")
    .value;
  const tagSelector = document.getElementById("input_tags");
  var tags = Array.from(tagSelector.options)
    .filter(function (option) {
      return option.selected;
    })
    .map(function (option) {
      return option.value;
    });
  const image = await document.getElementById("post-detail-image-input")
    .files[0];
  const ca = await document.getElementById("post-detail-category").value;
  const co = await window.parent.tinymce.get("classic").getContent();
  if (ti.length > 0) {
    title = ti;
  }
  if (co.length > 1) {
    content = co;
  }

  if (tags.length == 0) {
    messageBox.textContent = "Please input a tag.";
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    return;
  }

  let imageUploadData;
  if (image == undefined) {
    const res = await fetch(
      `http://localhost:3000/api/blog/update/${blog._id}`,
      {
        headers: {
          "Content-Type": "application/json",
          authorization: `${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({
          title,
          visibility,
          category,
          content,
          tags,
        }),
        method: "put",
      }
    );
    const data = await res.json();
    if (data.message == "Successful") {
      localStorage.setItem("blog-details", JSON.stringify(data.updatedBlog));
      loader.classList.add("visually-hidden");
      loaderButton.classList.remove("visually-hidden");
      return (window.location.href = "./../inner_pages/blog-details.html");
    } else {
      messageBox.textContent = data.message;
      loader.classList.add("visually-hidden");
      loaderButton.classList.remove("visually-hidden");
    }
    return;
  } else if (image != undefined) {
    let form = new FormData();
    form.append("file", image);
    form.append("upload_preset", "wkpageImages");
    form.append("cloud_name", "wkpages");
    const imageUpload = await fetch(
      `https://api.cloudinary.com/v1_1/wkpages/image/upload`,
      {
        method: "post",
        body: form,
      }
    );
    imageUploadData = await imageUpload.json();
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
  }

  if (imageUploadData) {
    const res = await fetch(
      `http://localhost:3000/api/blog/update/${blog._id}`,
      {
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
        method: "put",
      }
    );
    const data = await res.json();
    if (data.message == "Successful") {
      localStorage.setItem("blog-details", JSON.stringify(data.updatedBlog));
      loader.classList.add("visually-hidden");
      loaderButton.classList.remove("visually-hidden");
      return (window.location.href = "./../inner_pages/blog-details.html");
    } else {
      messageBox.textContent = data.message;
      loader.classList.add("visually-hidden");
      loaderButton.classList.remove("visually-hidden");
    }
    return;
  }
};
