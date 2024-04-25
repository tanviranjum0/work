const LoadingSpinner = () => {
  return (
    <div>
      <div className="d-flex align-items-center mt-2 mx-5">
        <strong role="status">Loading...</strong>
        <div className="spinner-border " aria-hidden="true"></div>
      </div>
    </div>
  );
};

export default LoadingSpinner;
