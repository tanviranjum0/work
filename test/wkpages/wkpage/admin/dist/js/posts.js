let initialBlogs;
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
let Status = null;
async function AdminBlogInitailFetch(status) {
  document.getElementById("admin-posts-data").innerHTML = null;
  let isBlogAlreadyLoaded = localStorage.getItem("blogs");
  if (isBlogAlreadyLoaded) {
    initialBlogs = JSON.parse(isBlogAlreadyLoaded);
  } else {
    const res = await fetch("http://localhost:3000/api/blog/all");
    initialBlogs = await res.json();
    localStorage.setItem("blogs", JSON.stringify(initialBlogs));
  }
  if (status && status.length > 0) {
    Status = status;
  }
  initialBlogs.reverse().map((blog) => {
    let container = document.getElementById("admin-posts-data");
    if (Status == null) {
      const node = ` <tr>
                                <td></td>
                                <td>${blog._id.slice(17, 24)}</td>
                                <td class="mw-250p text-truncate text-high-em">
                                  <span
                                  role="button"
                                  id="${blog._id}"
                                  onclick="handleClickOnIndividualPost(event)"
                                    >${blog.title}</span
                                  >
                                </td>
                                <td>
                                  <div class="media align-items-center">
                                    <div class="media-head me-2">
                                      <div class="avatar avatar-xs">
                                        <img
                                          src="${blog.owner_id.avatar}"
                                          alt="user"
                                          class="avatar-img rounded-circle"
                                        />
                                      </div>
                                    </div>
                                    <div class="media-body">
                                      <span class="d-block"
                                        >${blog.owner_id.fullname}</span
                                      >
                                    </div>
                                  </div>
                                </td>
                                <td> ${blog.category.map((t) => {
                                  return `<span class="badge badge-soft-violet my-1 me-2">
                                       ${t}
                                     </span>`;
                                })}</td>
                                <td>
                                 ${blog.tags.map((t) => {
                                   return `<span class="badge badge-soft-violet my-1 me-2">
                                       ${t}
                                     </span>`;
                                 })}
                                </td>
                                <td>${blog.status}</td>
                                <td>${
                                  months[new Date(blog.createdAt).getMonth()]
                                } ${new Date(
        blog.createdAt
      ).getDate()}, ${new Date(blog.createdAt).getFullYear()}</td>
                                <td>
                                  <span
                                    class="badge badge-primary badge-indicator badge-indicator-xl"
                                  ></span>
                                </td>
                                <td>
                                  <div class="d-flex align-items-center">
                                    <div class="dropdown">
                                      <button
                                        class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret"
                                        aria-expanded="false"
                                        data-bs-toggle="dropdown"
                                      >
                                        <span class="icon"
                                          ><span class="feather-icon"
                                            ><i
                                              data-feather="more-vertical"
                                            ></i></span
                                        ></span>
                                      </button>
                                      <div
                                        role="menu"
                                        class="dropdown-menu dropdown-menu-end"
                                      >
                                        <a class="dropdown-item" href="#"
                                          >Action</a
                                        >
                                        <a class="dropdown-item" href="#"
                                          >Another action</a
                                        >
                                        <a class="dropdown-item" href="#"
                                          >Something else here</a
                                        >
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="#"
                                          >Separated link</a
                                        >
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>`;
      container.insertAdjacentHTML("afterbegin", node);
    } else if (blog.status == Status) {
      const container = document.getElementById("admin-posts-data");
      const node = ` <tr>
                                <td></td>
                                <td>${blog._id.slice(17, 24)}</td>
                                <td class="mw-250p text-truncate text-high-em">
                                  <span
                                    >${blog.title}</span
                                  >
                                </td>
                                <td>
                                  <div class="media align-items-center">
                                    <div class="media-head me-2">
                                      <div class="avatar avatar-xs">
                                        <img
                                          src="${blog.owner_id.avatar}"
                                          alt="user"
                                          class="avatar-img rounded-circle"
                                        />
                                      </div>
                                    </div>
                                    <div class="media-body">
                                      <span class="d-block"
                                        >${blog.owner_id.fullname}</span
                                      >
                                    </div>
                                  </div>
                                </td>
                                <td> ${blog.category.map((t) => {
                                  return `<span class="badge badge-soft-violet my-1 me-2">
                                       ${t}
                                     </span>`;
                                })}</td>
                                <td>
                                 ${blog.tags.map((t) => {
                                   return `<span class="badge badge-soft-violet my-1 me-2">
                                       ${t}
                                     </span>`;
                                 })}
                                </td>
                                <td>${blog.status}</td>
                                <td>${
                                  months[new Date(blog.createdAt).getMonth()]
                                } ${new Date(
        blog.createdAt
      ).getDate()}, ${new Date(blog.createdAt).getFullYear()}</td>
                                <td>
                                  <span
                                    class="badge badge-primary badge-indicator badge-indicator-xl"
                                  ></span>
                                </td>
                                <td>
                                  <div class="d-flex align-items-center">
                                    <div class="dropdown">
                                      <button
                                        class="btn btn-icon btn-flush-dark btn-rounded flush-soft-hover dropdown-toggle no-caret"
                                        aria-expanded="false"
                                        data-bs-toggle="dropdown"
                                      >
                                        <span class="icon"
                                          ><span class="feather-icon"
                                            ><i
                                              data-feather="more-vertical"
                                            ></i></span
                                        ></span>
                                      </button>
                                      <div
                                        role="menu"
                                        class="dropdown-menu dropdown-menu-end"
                                      >
                                        <a class="dropdown-item" href="#"
                                          >Action</a
                                        >
                                        <a class="dropdown-item" href="#"
                                          >Another action</a
                                        >
                                        <a class="dropdown-item" href="#"
                                          >Something else here</a
                                        >
                                        <div class="dropdown-divider"></div>
                                        <a class="dropdown-item" href="#"
                                          >Separated link</a
                                        >
                                      </div>
                                    </div>
                                  </div>
                                </td>
                              </tr>`;
      container.insertAdjacentHTML("afterbegin", node);
    }
  });
}
AdminBlogInitailFetch();

const ChangeStatus = (e) => {
  Status = e.target.id;
  AdminBlogInitailFetch();
};

const handleClickOnIndividualPost = (event) => {
  initialBlogs.map(async (b) => {
    if (b._id == event.target.id) {
      await localStorage.setItem("post-detail", JSON.stringify(b));
    }
    if (JSON.parse(localStorage.getItem("post-detail"))._id == event.target.id)
      window.location.href = "post-detail.html";
  });
};
