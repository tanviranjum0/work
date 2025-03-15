const blog = JSON.parse(localStorage.getItem("blog-details"));
const handleNavigatetoGrid = () => {
  window.location.href = "blog-grid.html";
};

const months = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];
const getReadyBlogPage = async () => {
  document.getElementById("blog-details-author-image").src =
    blog.owner_id.avatar;
  document.getElementById("blog-details-author-name").innerText =
    blog.owner_id.fullname;
  const cMonth = months[new Date(blog.createdAt).getMonth()];
  const cDate = new Date(blog.createdAt).getDate();
  const cYear = new Date(blog.createdAt).getFullYear();
  document.getElementById("blog-details-createdAt").innerHTML =
    cMonth + " " + cDate + "," + " " + cYear;
  blog.category.map((c) => {
    const node = document.createElement("a");
    const textnode = document.createTextNode(c);
    node.setAttribute("id", `${c}-category`);
    node.setAttribute("role", `button`);
    node.addEventListener("click", (event) => handleCategoryButton(event));
    node.appendChild(textnode);
    document.getElementById("category-container").appendChild(node);
  });
  blog.tags.map((t) => {
    const node = document.createElement("a");
    const textnode = document.createTextNode(t);
    node.setAttribute("id", `${t}-tag`);
    node.setAttribute("role", `button`);
    node.addEventListener("click", (event) => handleTagButton(event));
    node.appendChild(textnode);
    document.getElementById("tags-container").appendChild(node);
  });
  document.getElementById("blog-details-main-title").innerText = blog.title;
  document
    .getElementById("blog-details-bg-image")
    .setAttribute("data-background", blog.poster);
  document.getElementById("blog-content-container").innerHTML = blog.content;

  let isBlogAlreadyLoaded = localStorage.getItem("blogs");
  if (isBlogAlreadyLoaded) {
    initialBlogs = JSON.parse(isBlogAlreadyLoaded);
  } else {
    const res = await fetch("http://localhost:3000/api/blog/all");
    initialBlogs = await res.json();
    localStorage.setItem("blogs", JSON.stringify(initialBlogs));
  }
  const b = JSON.parse(localStorage.getItem("blog-details"));

  initialBlogs.slice(0, 3).map((blog) => {
    if (blog._id == b._id) {
      return;
    }
    const container = document.getElementById("blog-details-blog-grid");
    const node = `<div class="col-lg-4">
        <div class="item">
          <div class="info d-flex align-items-center">
            <div class="d-flex align-items-center">
              <div>
                <div class="author-img fit-img">
                  <img src="${blog.owner_id.avatar}" alt="" />
                </div>
              </div>
              <div class="author-info ml-10">
                <span>${blog.owner_id.fullname}</span>
                <span class="sub-color">${blog.owner_id.role}</span>
              </div>
            </div>
            <div class="date ml-auto">
              <span class="sub-color">
                <i class="fa-regular fa-clock mr-15 opacity-7"></i>
                ${months[new Date(blog.createdAt).getMonth()]} ${new Date(
      blog.createdAt
    ).getDate()}, ${new Date(blog.createdAt).getFullYear()}
              </span>
            </div>
          </div>
          <div class="img fit-img mt-30">
            <img id="${
              blog._id
            }" onclick="handleGetBlogDetails(event)" role="button" src="${
      blog.poster
    }" alt="" />
          </div>
          <div class="cont mt-30">
            <h6>
              <a href="#0">${blog.title}</a>
            </h6>
          </div>
        </div>
      </div>`;
    container.insertAdjacentHTML("afterbegin", node);
  });
};

getReadyBlogPage();

const handleCategoryButton = async (event) => {
  event.preventDefault();
  document.getElementById("blog-details-category-error").innerHTML = "";
  const payload = await event.target.id.split("-")[0];
  console.log(payload);
  const res = await fetch("http://localhost:3000/api/blog/all/bycategory", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
    method: "post",
  });
  const data = await res.json();
  console.log(data);
  if (data.message == "Successful") {
    localStorage.setItem("specificCategoryBlogs", JSON.stringify(data.blogs));
    return (window.location.href = "category-blog-grid.html");
  } else if (data.message == "No blogs found") {
    document.getElementById("blog-details-category-error").innerHTML =
      "There is no blog with this category";
  }
};

const handleTagButton = async (event) => {
  event.preventDefault();
  const payload = await event.target.id.split("-")[0];
  const res = await fetch("http://localhost:3000/api/blog/all/bytag", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
    method: "post",
  });
  const data = await res.json();
  console.log(data);
  if (data.message == "Successful") {
    localStorage.setItem("specificTagBlogs", JSON.stringify(data.blogs));
    window.location.href = "tag-blog-grid.html";
  } else if (data.message == "No blogs found") {
    document.getElementById("blog-details-tag-error").innerHTML =
      "There is no blog with this tag";
  }
  return;
};

const handleGetBlogDetails = async (event) => {
  initialBlogs.map((b) => {
    console.log(b._id, event.target.id);
    if (b._id == event.target.id) {
      localStorage.setItem("blog-details", JSON.stringify(b));
    }
    if (
      JSON.parse(localStorage.getItem("blog-details"))._id == event.target.id
    ) {
      return (window.location.href = "blog-details.html");
    }
  });
};

function valid(email) {
  const pattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return pattern.test(email);
}
const handleAddComment = () => {
  document.getElementById("blog-details-comment-error").innerText = "";
  const email = document.getElementById("email-comment").value;
  const message = document.getElementById("message-comment").value;
  const name = document.getElementById("fullname-comment").value;
  const blog = JSON.parse(localStorage.getItem("blog-details"));
  console.log({ email, name, message });
  if (!message || !email || !name) {
    document.getElementById("blog-details-comment-error").innerText =
      "All fields are required!";
    return;
  } else if (!valid(email)) {
    document.getElementById("blog-details-comment-error").innerText =
      "Please provide a valid email!";
    return;
  }
  fetch(`http://localhost:3000/api/comment/add/${blog._id}`, {
    headers: {
      "Content-Type": "application/json",
    },
    method: "post",
    body: JSON.stringify({
      email,
      name,
      message,
    }),
  })
    .then((res) => res.json())
    .then((data) => console.log(data));
  // console.log("hello");
};
