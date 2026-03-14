import React from "react";

function NoDataScreen() {
  return (
    <div className=" d-flex bg-light d-flex justify-content-center align-items-center" style={{borderRadius:"20px", height:"60vh"}}>
        <div>
            <img src="https://cdn-icons-png.flaticon.com/256/6840/6840178.png"/>
            <h2 className="text-secondary text-center">No Data Found</h2>
        </div>
    </div>
  );
}

export default NoDataScreen;
