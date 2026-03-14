import React from "react";
// import IconifyIcon from "@iconify/react";

function ConfirmDeleteModal({title, body, show, handleClose, handleConfirm }) {
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
              Cancel
            </button>
            <button
              type="button"
              className="btn btn-danger"
              onClick={handleConfirm}
            >
              Delete
            </button>
          </div>
        </div>
      </div>
    </div>
  );
  return (
    <div
      className={`modal fade ${show ? "show d-block" : ""}`}
      tabIndex="-1"
      style={{ backgroundColor: "rgba(0,0,0,0.3)" }}
    >
      <div className="modal-dialog modal-sm modal-dialog-top">
        <div className="modal-content modal-filled rounded-2 bg-light">
          <div className="modal-body" >
            <div className="text-center">
              {/* <IconifyIcon
                icon="mdi:alert-circle-outline"
                className="display-6 mt-0 text-white"
              /> */}
              <i className="bi bi-trash fs-3 textThemeColor"></i>
              <h4 className="mt-3 textThemeColor">{title}</h4>
              <p className="mt-3 textThemeColor">
                {body} <br />
                This action cannot be undone.
              </p>
              <div className="d-flex justify-content-center gap-2 mt-3">
                <button
                  type="button"
                  className="btn btn-light w-50 "
                  style={{border:"1px solid #010a2d"}}
                  onClick={handleClose}
                >
                  Cancel
                </button> 
                <button
                  type="button"
                  className="btn bgThemePrimary w-50"
                  onClick={handleConfirm}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConfirmDeleteModal;
