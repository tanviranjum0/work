import React from "react";

export default function loading() {
  return (
    <div>
      <button type="button" className="bg-indigo-500 w-50" disabled>
        Processing...
      </button>
    </div>
  );
}
