import React from "react";
// import IconifyIcon from "@iconify/react";

function LogoutConfirmationModal({title, body, show, handleClose, handleConfirm }) {
  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
    >
      <div className="modal-dialog modal-dialog-centered">
        <div className="modal-content">
          {/* Header */}
          <div className="modal-header">
            <h5 className="modal-title">{title || "Confirm Delete"}</h5>
            <button
              type="button"
              className="btn-close"
              onClick={handleClose}
            ></button>
          </div>

          {/* Body */}
          <div className="modal-body">
            <p className="mb-0">{body || "Do you really want to delete this branch?"}</p>
            {/* <p className="text-muted mb-0">This action cannot be undone.</p> */}
          </div>

          {/* Footer */}
          <div className="modal-footer">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
            >
              No
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirm}
            >
              Yes
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  
}

export default LogoutConfirmationModal;
