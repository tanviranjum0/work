const handleCreatePost = async (event) => {
  event.preventDefault();
  const loader = await document.getElementById("loader-add-post");
  const loaderButton = await document.getElementById("add-post-publish-button");
  loader.classList.remove("visually-hidden");
  loaderButton.classList.add("visually-hidden");
  const messageBox = await document.getElementById("error-box-add-post");
  messageBox.textContent = "";
  const title = await document.getElementById("add-post-title").value;
  const visibility = await document.getElementById("add-post-visibility").value;
  const image = await document.getElementById("add-post-image-input").files[0];
  const category = await document.getElementById("add-post-category").value;
  const content = await document.getElementsByClassName("add-post-content")
    .value;
  console.log({ title });
  console.log({ content });
  console.log({ category });
  console.log({ visibility });
  console.log({ image });
  if (title.length < 1) {
    messageBox.textContent = "Title is required";
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    return;
  }
  if (content == undefined) {
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
  if (image == undefined) {
    messageBox.textContent = "Please choose an image.";
    loader.classList.add("visually-hidden");
    loaderButton.classList.remove("visually-hidden");
    return;
  }
};
