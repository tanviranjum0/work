function LoadingSpinner() {
  return (
    <div className="spin d-flex justify-content-center">
      <div
        className="spinner-grow"
        style={{ width: "3rem", height: "3rem" }}
        role="status"
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      <h3 className="m-2">Loading...</h3>
    </div>
  );
}
export default LoadingSpinner;
