$(function () {
  "use strict";

  $(function () {
    var equalWidth = $(".brand-ds .item").outerWidth();

    $(".brand-ds .item").css({
      height: equalWidth,
    });
  });

  var testim = new Swiper(".testimonials-ds .testim-swiper", {
    slidesPerView: 1,
    spaceBetween: 30,
    speed: 1500,
    autoplay: {
      delay: 5000,
    },
    loop: true,
    pagination: {
      el: ".swiper-pagination",
      clickable: true,
    },
  });

  var workswip = new Swiper(".works-ds .work-swiper", {
    slidesPerView: "auto",
    spaceBetween: 30,
    speed: 1500,
    autoplay: {
      delay: 5000,
    },
    loop: true,
    pagination: {
      el: ".works-ds .swiper-pagination",
      clickable: true,
    },

    breakpoints: {
      0: {
        slidesPerView: 1,
      },
      640: {
        slidesPerView: 1,
      },
      768: {
        slidesPerView: 1,
      },
      1024: {
        slidesPerView: "auto",
      },
    },
  });

  $("#monthly-input").on("change", function () {
    $(".monthly_price").show();
    $(".monthly_price").siblings(".yearly_price").hide();
  });
  $("#yearly-input").on("change", function () {
    $(".yearly_price").show();
    $(".yearly_price").siblings(".monthly_price").hide();
  });

  $(".accordion .accordion-item").on("click", function () {
    $(this).addClass("active").siblings().removeClass("active");
  });
});

let initialBlogs;
async function initialLoad() {
  const res = await fetch("http://localhost:3000/api/blog/all");
  initialBlogs = await res.json();
  localStorage.setItem("blogs", JSON.stringify(initialBlogs));

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

  const container = document.getElementById("main-index-blog-section");
  initialBlogs
    .reverse()
    .slice(3, 6)
    .map((blog) => {
      const node = `<div class="col-lg-4">
                  <div class="item pt-30 bord-thin-top-light md-mb50">
                    <div class="info d-flex align-items-center mb-20">
                      <a href="#0" class="tag">
                        <span>Experience</span>
                      </a>
                      <span class="dash">/</span>
                      <a href="#0" class="date">
                        <span>${
                          months[new Date(blog.createdAt).getMonth()]
                        } ${new Date(blog.createdAt).getDate()}, ${new Date(
        blog.createdAt
      ).getFullYear()}</span>
                      </a>
                    </div>
                    <div class="text mb-50">
                      <h6>
                        ${blog.title}
                      </h6>
                    </div>
                    <div class="img">
                      <img
                        src="${blog.poster}"
                        alt="wk.pages - Blog: Work Culture in Modern Offices"
                        loading="lazy"
                      />
                      <a
                        id="${blog._id}"  
                        onclick="handleGetBlogDetails(event)"
                        class="icon invert"
                      >
                        <img
                          id="${blog._id}"
                          src="./common/imgs/icons/arrow-top-right.svg"
                          alt="wk.pages - Arrow Icon"
                        />
                      </a>
                    </div>
                  </div>
                </div>`;
      container.insertAdjacentHTML("afterbegin", node);
    });
}
const handleGetBlogDetails = async (event) => {
  initialBlogs.map((b) => {
    if (b._id == event.target.id) {
      localStorage.setItem("blog-details", JSON.stringify(b));
    }
    if (
      JSON.parse(localStorage.getItem("blog-details"))._id == event.target.id
    ) {
      return (window.location.href = "inner_pages/blog-details.html");
    }
  });
};

initialLoad();
