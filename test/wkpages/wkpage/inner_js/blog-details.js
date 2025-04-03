let blog;
let initialBlogs;
let comments;
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
  blog = JSON.parse(localStorage.getItem("blog-details"));
  if (!blog) handleNavigatetoGrid();
  const comRes = await fetch(
    `http://localhost:3000/api/comment/all/${blog._id}`
  );

  comments = await comRes.json();
  const titleBog = document.getElementById("blog-details-bg-image");
  titleBog.setAttribute("data-background", blog.poster);

  titleBog.setAttribute("style", ` background-image: url('${blog.poster}');`);
  const commentLengthDisplay = document.getElementById(
    "blog-details-comment-count-display"
  );
  commentLengthDisplay.innerHTML = `${comments.comments.length} Comments`;
  if (comments.comments.length > 0) {
    comments.comments
      .reverse()
      .slice(0, 3)
      .map((c) => {
        const commentContainer = document.getElementById("comment-container");
        const node = `<div
                        style="background-color: #141413"
                        class="flex p-3 border-dark border-bottom"
                      >
                        <div class="cont valign">
                          <div class="full-width">
                            <h6 class="fw-600 mb-10">${c.name}</h6>
                            <p>
                             ${c.message}
                            </p>
                          </div>
                        </div>
                      </div>`;
        commentContainer.insertAdjacentHTML("afterbegin", node);
      });
  }
  document.getElementById("blog-details-author-image").src =
    blog.owner_id.avatar;

  document.getElementById("blog-details-author-name").innerText =
    blog.owner_id.fullname;
  const cMonth = months[new Date(blog.createdAt).getMonth()];
  const cDate = new Date(blog.createdAt).getDate();
  const cYear = new Date(blog.createdAt).getFullYear();
  document.getElementById("blog-details-createdAt").innerHTML =
    cMonth + " " + cDate + "," + " " + cYear;
  blog.category.reverse().map((c) => {
    const node = document.createElement("a");
    const textnode = document.createTextNode(c);
    node.setAttribute("id", `${c}-category`);
    node.setAttribute("role", `button`);
    node.addEventListener("click", (event) => handleCategoryButton(event));
    node.appendChild(textnode);
    document.getElementById("category-container").appendChild(node);
  });
  blog.tags.reverse().map((t) => {
    const node = document.createElement("a");
    const textnode = document.createTextNode(t);
    node.setAttribute("id", `${t}-tag`);
    node.setAttribute("role", `button`);
    node.addEventListener("click", (event) => handleTagButton(event));
    node.appendChild(textnode);
    document.getElementById("tags-container").appendChild(node);
  });
  blog.tags.reverse().map((t) => {
    const node = document.createElement("a");
    const textnode = document.createTextNode(t);
    node.setAttribute("id", `${t}-tag`);
    node.setAttribute("role", `button`);
    node.addEventListener("click", (event) => handleTagButton(event));
    node.appendChild(textnode);
    document.getElementById("tags-container-second").appendChild(node);
  });
  document.getElementById("blog-details-main-title").innerText = blog.title;
  const contentDiv = `<div>${blog.content}</div>`;
  document
    .getElementById("blog-content-container")
    .insertAdjacentHTML("afterbegin", contentDiv);

  const res = await fetch("http://localhost:3000/api/blog/all");
  initialBlogs = await res.json();
  localStorage.setItem("blogs", JSON.stringify(initialBlogs));

  let count = 0;

  initialBlogs
    .reverse()
    .slice(0, 4)
    .map((bl) => {
      console.log(bl._id);
      if (bl._id == blog._id) {
        return;
      }
      if (count == 3) return;
      count++;
      const container = document.getElementById("blog-details-blog-grid");
      const container2 = document.getElementById(
        "latest-post-show-blog-details"
      );

      const node = `<div class="col-lg-4">
        <div class="item">
          <div class="info d-flex align-items-center">
            <div class="d-flex align-items-center">
              <div>
                <div class="author-img fit-img">
                  <img src="${bl.owner_id.avatar}" alt="" />
                </div>
              </div>
              <div class="author-info ml-10">
                <span>${bl.owner_id.fullname}</span>
                <span class="sub-color">${bl.owner_id.role}</span>
              </div>
            </div>
            <div class="date ml-auto">
              <span class="sub-color">
                <i class="fa-regular fa-clock mr-15 opacity-7"></i>
                ${months[new Date(bl.createdAt).getMonth()]} ${new Date(
        bl.createdAt
      ).getDate()}, ${new Date(bl.createdAt).getFullYear()}
              </span>
            </div>
          </div>
          <div class="img fit-img mt-30">
            <img id="${
              bl._id
            }" onclick="handleGetBlogDetails(event)" role="button" src="${
        bl.poster
      }" alt="" />
          </div>
          <div class="cont mt-30">
            <h6>
              <a href="#0">${bl.title}</a>
            </h6>
          </div>
        </div>
      </div>`;

      const node2 = `<div id="${
        bl._id
      }" onclick="handleGetSpecificBlogDetails(event)" class="item d-flex align-items-center">
    <div>
      <div id="${bl._id}" class="img">
        <a>
          <img src="${bl.poster}" alt="" />
          <span id="${bl._id}" class="date">
            <span>
            ${months[new Date(bl.createdAt).getMonth()]} ${new Date(
        bl.createdAt
      ).getDate()}, ${new Date(bl.createdAt).getFullYear()}
            </span>
          </span>
        </a>
      </div>
    </div>
    <div class="cont">
      <span class="tag">
        <a>${bl.category}</a>
      </span>
      <h6 id="${bl._id}">
        <a>
    ${bl.title}
        </a>
      </h6>
    </div>
  </div>`;
      container.insertAdjacentHTML("afterbegin", node);
      container2.insertAdjacentHTML("afterbegin", node2);
    });
};

getReadyBlogPage();

const handleCategoryButton = async (event) => {
  event.preventDefault();
  document.getElementById("blog-details-category-error").innerHTML = "";
  const payload = await event.target.id.split("-")[0];
  const res = await fetch("http://localhost:3000/api/blog/all/bycategory", {
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ payload }),
    method: "post",
  });

  const data = await res.json();
  if (data.message == "Successful") {
    localStorage.setItem("specificCategoryBlogs", JSON.stringify(data.blogs));
    localStorage.setItem("specificCategory", payload);

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
  if (data.message == "Successful") {
    localStorage.setItem("specificTagBlogs", JSON.stringify(data.blogs));
    localStorage.setItem("specificTag", payload);
    window.location.href = "tag-blog-grid.html";
  } else if (data.message == "No blogs found") {
    document.getElementById("blog-details-tag-error").innerHTML =
      "There is no blog with this tag";
  }
  return;
};

const handleGetBlogDetails = async (event) => {
  initialBlogs.map((b) => {
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
    body: JSON.stringify({
      email,
      name,
      message,
    }),
    method: "post",
  })
    .then((res) => res.json())
    .then((data) => {
      if (data.message == "Successful") {
        location.reload();
      } else {
        console.log(data);
      }
    });
};

document
  .getElementById("specific-blogs-search-blog-details")
  .addEventListener("change", async () => {
    const searchTerm = document.getElementById(
      "specific-blogs-search-blog-details"
    ).value;
    const res = await fetch(
      `http://localhost:3000/api/blog/allspecific?searchTerm=${searchTerm}`
    );
    const data = await res.json();
    if (data.message == "Successful") {
      let count = 0;
      const container2 = document.getElementById(
        "latest-post-show-blog-details"
      );
      container2.innerHTML = null;
      data.blogs.reverse().map((bl) => {
        console.log(bl);
        if (bl._id == blog._id) {
          return;
        }
        if (count == 3) return;
        count++;

        const node2 = `<div
                      onclick="handleGetSpecificBlogDetails(event)"
                      id="${bl._id}"
                    >
                      <div class="item d-flex align-items-center">
                        <div>
                          <div class="img">
                            <a>
                              <img src="${bl.poster}" alt="" />
                              <span class="date">
                                <span>
                                  ${months[new Date(bl.createdAt).getMonth()]}
                                  ${new Date(
                                    bl.createdAt
                                  ).getDate()}, ${new Date(
          bl.createdAt
        ).getFullYear()}
                                </span>
                              </span>
                            </a>
                          </div>
                        </div>
                        <div class="cont">
                          <span class="tag">
                            <a>${bl.category}</a>
                          </span>
                          <h6>
                            <a> ${bl.title} </a>
                          </h6>
                        </div>
                      </div>
                    </div>
`;
        container2.insertAdjacentHTML("afterbegin", node2);
      });
    }
  });

const handleGetSpecificBlogDetails = async (event) => {
  console.log(event.target.id);
  initialBlogs.map((b) => {
    if (b._id == event.target.id) {
      localStorage.setItem("blog-details", JSON.stringify(b));
    }
    const bl = localStorage.getItem("blog-details");
    if (JSON.parse(bl)._id == event.target.id) {
      location.refresh();
    }
  });
};

const scrollToComments = () => {
  document
    .getElementById("leaveacommentcontainer")
    .scrollIntoView({ behavior: "smooth" });
};
