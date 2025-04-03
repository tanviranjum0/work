const adminInitialLoad = async () => {
  const user = await JSON.parse(localStorage.getItem("user"));
  const elements = document.getElementsByClassName("avatar-img");
  elements.forEach((image) => {
    image.setAttribute("src", user.avatar);
  });
};
adminInitialLoad();
