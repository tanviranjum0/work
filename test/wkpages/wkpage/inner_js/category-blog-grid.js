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

let initialBlogs;
async function handleCategoruBlogGridInitialLoad() {
  initialBlogs = await JSON.parse(
    localStorage.getItem("specificCategoryBlogs")
  );
  initialBlogs.reverse().map((blog) => {
    const container = document.getElementById(
      "blog-container-category-blog-grid"
    );
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
                <span class="sub-color">editor</span>
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
}
handleCategoruBlogGridInitialLoad();

const handleGetBlogDetails = async (event) => {
  initialBlogs.map((b) => {
    if (b._id == event.target.id) {
      localStorage.setItem("blog-details", JSON.stringify(b));
    }
    const bl = localStorage.getItem("blog-details");

    if (JSON.parse(bl)._id == event.target.id) {
      window.location.href = "blog-details.html";
    }
  });
};
