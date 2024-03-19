// "use client";
const page = () => {
  fetch("http://127.0.0.1:5500/localServerCheck/placeholder.json")
    .then((res) => res.json())
    .then(console.log);
  return (
    <div>
      <div
        className="btn btn-primary
    text-center"
      >
        Fetch data
      </div>
    </div>
  );
};

export default page;
