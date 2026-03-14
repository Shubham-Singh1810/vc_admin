import React from "react";
import { useNavigate } from "react-router-dom";
function Unauthorized() {
    const navigate = useNavigate()
  return (
    <div className="d-flex vh-100 justify-content-center align-items-center">
      <div className="">
        <div className="d-flex justify-content-center">
          <img src="https://cdn-icons-png.flaticon.com/128/18713/18713859.png" />
        </div>
        <h2 className="text-center">Unauthorized Access</h2>
      <p className="text-center">We couldn't validate your credientials. Please ask your manager to upgarde your permissions</p>
      <div className="d-flex justify-content-center">

      <button className="bgThemePrimary btn" onClick={()=>navigate("/")}>Take Me Back</button>
      </div>
      </div>
      
    </div>
  );
}

export default Unauthorized;
