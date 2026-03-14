import React from "react";
import { useNavigate } from "react-router-dom";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div>
        <div className="d-flex justify-content-center">
          <img
            src="https://cdn-icons-png.flaticon.com/128/755/755014.png"
            alt="404 Not Found"
          />
        </div>
        <h2 className="text-center">Page Not Found</h2>
        <p className="text-center">
          Oops! The page you are looking for does not exist or has been moved.
        </p>
        <div className="d-flex justify-content-center">
          <button
            className="bgThemePrimary btn"
            onClick={() => navigate("/")}
          >
            Go Home
          </button>
        </div>
      </div>
    </div>
  );
}

export default NotFound;
