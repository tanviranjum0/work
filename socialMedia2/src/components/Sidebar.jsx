/* eslint-disable react/prop-types */
export default function Sidebar({ selectedTab, setSelectedTab }) {
  function handleOnClick(e) {
    setSelectedTab(e);
  }
  return (
    <div>
      <div
        className="sidebar d-flex flex-column flex-shrink-0 p-3 text-bg-dark"
        style={{ width: "280px" }}
      >
        <a
          href="/"
          className="d-flex align-items-center mb-3 mb-md-0 me-md-auto text-white text-decoration-none"
        >
          <svg className="bi pe-none me-2" width="40" height="32">
            <use xlinkHref="#bootstrap"></use>
          </svg>
          <span className="fs-4">Sidebar</span>
        </a>
        <hr />
        <ul className="nav nav-pills flex-column mb-auto">
          <li className="nav-item">
            <a
              onClick={() => handleOnClick("home")}
              href="#"
              className={`nav-link text-white ${
                selectedTab === "home" && "active"
              }`}
              aria-current="page"
            >
              <svg className="bi pe-none me-2" width="16" height="16">
                <use xlinkHref="#home"></use>
              </svg>
              Home
            </a>
          </li>
          <li>
            <a
              onClick={() => handleOnClick("createpost")}
              href="#"
              className={`nav-link text-white ${
                selectedTab === "createpost" && "active"
              }`}
            >
              <svg className="bi pe-none me-2" width="16" height="16">
                <use xlinkHref="#speedometer2"></use>
              </svg>
              Create Post
            </a>
          </li>
        </ul>
      </div>
    </div>
  );
}
