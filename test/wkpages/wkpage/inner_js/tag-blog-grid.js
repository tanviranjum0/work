let initialBlogs;
async function fetch() {
  initialBlogs = await JSON.parse(localStorage.getItem("specificTagBlogs"));
  console.log(initialBlogs);
  initialBlogs.map((blog) => {
    const container = document.getElementById("blog-container-tag-blog-grid");
    const node = `<div class="col-lg-4">
        <div class="item">
          <div class="info d-flex align-items-center">
            <div class="d-flex align-items-center">
              <div>
                <div class="author-img fit-img">
                  <img src="assets/imgs/blogs/blog1/a2.jpg" alt="" />
                </div>
              </div>
              <div class="author-info ml-10">
                <span>M Moussa</span>
                <span class="sub-color">editor</span>
              </div>
            </div>
            <div class="date ml-auto">
              <span class="sub-color">
                <i class="fa-regular fa-clock mr-15 opacity-7"></i>
                12 hours ago
              </span>
            </div>
          </div>
          <div class="img fit-img mt-30">
            <img id="${blog._id}" onclick="handleGetBlogDetails(event)" role="button" src="${blog.poster}" alt="" />
          </div>
          <div class="cont mt-30">
            <h6>
              <a href="#0">Visual Website Tips #5</a>
            </h6>
          </div>
        </div>
      </div>`;
    container.insertAdjacentHTML("afterbegin", node);
  });
}
fetch();
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
