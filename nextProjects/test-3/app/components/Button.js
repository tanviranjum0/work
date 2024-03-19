"use client";
function Button() {
  return (
    <div>
      <button
        onClick={() => console.log("Hello World")}
        className="bg-green-500 rounded-sm px-4 py-1"
      >
        Click Me!
      </button>
    </div>
  );
}
export default Button;
