import React from "react";

const Loading = () => {
  return (
    <div className="flex items-center justify-center mt-2">
      <div className="spinner-border text-blue-500" role="status">
        <span className="visually-hidden">Loading...</span>
      </div>
    </div>
  );
};

export default Loading;
