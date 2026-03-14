import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../../GlobalProvider";
import {
  getTicketListServ,
  ticketCategoryUpdateServ,
  ticketCategoryAddServ,
  ticketCategoryDeleteServ,
} from "../../services/ticker.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../../components/NoDataScreen";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from "moment";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import {
  getTicketDetailsServ,
  sendMessageServ,
  updateTicketServ,
} from "../../services/ticker.service";
import { useParams } from "react-router-dom";
function ChatBox() {
  const { globalState } = useGlobalState();
  const params = useParams();
  const [details, setDetails] = useState();
  const [ticketDetails, setTicketDetails] = useState();
  const getTicketDetails = async () => {
    try {
      let response = await getTicketDetailsServ(params?.id);
      if (response?.data?.statusCode == "200") {
        setDetails(response?.data?.data);
        setTicketDetails(response?.data?.ticketDetails);
      }
    } catch (error) {
      console.log(error);
    }
  };
  const [closeLoader, setCloseLoader] = useState(false);
  const updateTicketStatus = async (status) => {
    setCloseLoader(true)
    try {
      let response = await updateTicketServ({_id:params?.id, status: status });
      if (response?.data?.statusCode == "200") {
        getTicketDetails();
        toast.success(response?.data?.message)
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
     setCloseLoader(false)
  };
  useEffect(() => {
    getTicketDetails();
  }, []);

  const formatDate = (date) => {
    const now = moment();
    const created = moment(date);

    const diffMinutes = now.diff(created, "minutes");
    const diffHours = now.diff(created, "hours");
    const diffDays = now.diff(created, "days");

    if (diffMinutes < 60) {
      return created.fromNow();
    } else if (diffHours < 24 && now.isSame(created, "day")) {
      return created.format("hh:mm A");
    } else if (diffDays === 1) {
      return `Yesterday ${created.format("hh:mm A")}`;
    } else if (diffDays < 7) {
      return created.format("dddd hh:mm A");
    } else {
      return created.format("DD-MM-YYYY hh:mm A");
    }
  };
  const [formData, setFormData] = useState({
    message: "",
    userType: "Admin",
    ticketId: params?.id,
    userId: globalState?.user?._id,
    image: "",
    imgPrev: "",
  });
  const [showFileUploadPopup, setShowFileUploadPopup] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const sendMessageFunc = async () => {
    setIsSending(true);
    try {
      const finalPayload = new FormData();
      finalPayload.append("message", formData?.message);
      finalPayload.append("userType", formData?.userType);
      finalPayload.append("ticketId", formData?.ticketId);
      finalPayload.append("userId", formData?.userId);
      finalPayload.append("image", formData?.image);
      let response = await sendMessageServ(finalPayload);
      if (response?.data?.statusCode == "200") {
        setFormData({
          message: "",
          userType: "Admin",
          ticketId: params?.id,
          userId: globalState?.user?._id,
          image: "",
          imgPrev: "",
        });
        toast.success(response?.data?.message);
        getTicketDetails();
        setShowFileUploadPopup(false);
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setIsSending(false);
  };

  return (
    <div className="container-fluid user-table py-3">
      <div className="p-2 border rounded bg-secondary">
        <div className="row">
          <div className="col-4">
            <div className="shadow-sm rounded p-3 bg-white d-flex justify-content-between align-items-center">
              <p className="mb-0">First Name</p>
              <h5 className="mb-0">{ticketDetails?.userId?.firstName}</h5>
            </div>
          </div>
          <div className="col-4">
            <div className="shadow-sm rounded p-3 bg-white d-flex justify-content-between align-items-center">
              <p className="mb-0">Last Name</p>
              <h5 className="mb-0">{ticketDetails?.userId?.lastName}</h5>
            </div>
          </div>
          <div className="col-4">
            <div className="shadow-sm rounded p-3 bg-white d-flex justify-content-between align-items-center">
              <p className="mb-0">Ticket ID</p>
              <h5 className="mb-0">{ticketDetails?.code}</h5>
            </div>
          </div>
          <div className="col-12 row p-0 mx-0 mt-3">
            <div className="col-8">
              <div className="shadow-sm rounded p-3 bg-white">
                <p className="mb-0">Subject</p>
                <textarea
                  className="form-control mt-2"
                  value={ticketDetails?.subject}
                ></textarea>
              </div>
            </div>
            <div className="col-4 my-auto">
              <div className="shadow-sm rounded p-3 bg-white d-flex justify-content-between align-items-center">
                <p className="mb-0">Category</p>
                <h5 className="mb-0">
                  {ticketDetails?.ticketCategoryId?.name}
                </h5>
              </div>
              {
                closeLoader ? 
                <button
                className="btn btn-success py-2 mt-3 w-100 "
                style={{opacity:"0.5"}}
              >
                Updating ...
              </button>:<>{
              ticketDetails?.status=="closed" ? <button
                className="btn btn-success py-2 mt-3 w-100 "
                onClick={() => updateTicketStatus("open")}
              >
                Open Ticket
              </button>:<button
                className="btn btn-warning py-2 mt-3 w-100 "
                onClick={() => updateTicketStatus("closed")}
              >
                Mark as closed
              </button>}</>}
              
            </div>
          </div>
        </div>
      </div>
      <div className="mt-3 border p-3 bg-white chatBox">
        {details?.map((v, i) => {
          return (
            <div
              className={
                "d-flex mb-3 " +
                (v.userType == "User"
                  ? " justify-content-start"
                  : " justify-content-end")
              }
            >
              <div
                className={
                  "w-50 d-flex  " +
                  (v.userType == "User"
                    ? " justify-content-start"
                    : " justify-content-end")
                }
              >
                <div
                  className={
                    " rounded p-2  d-flex align-items-end  " +
                    (v.userType == "User"
                      ? " border text-dark"
                      : "  bg-dark text-light")
                  }
                >
                  <div>
                    {v?.image && (
                      <img src={v?.image} className="border img-fluid" />
                    )}
                    <p className="mb-0">{v?.message}</p>
                  </div>

                  <div
                    className="d-flex justify-content-end ms-3"
                    style={{ fontSize: "12px" }}
                  >
                    <small>{formatDate(v?.createdAt)}</small>
                    {v.userType != "User" && v?.isRead && (
                      <i class="bi bi-check2-all text-success ms-2"></i>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {ticketDetails?.status=="open" && <div className="d-flex border p-2">
        <input
          className="form-control"
          placeholder="Add message"
          onChange={(e) =>
            setFormData({ ...formData, message: e?.target?.value })
          }
          value={formData?.message}
        />
        <img
          src="https://cdn-icons-png.flaticon.com/128/6499/6499530.png"
          style={{ height: "40px" }}
          className="mx-2"
          onClick={() => setShowFileUploadPopup(true)}
        />
        {formData?.message || formData?.image ? (
          <button className="btn bgThemePrimary" onClick={sendMessageFunc}>
            Send
          </button>
        ) : (
          <button className="btn bgThemePrimary" style={{ opacity: "0.5" }}>
            Send
          </button>
        )}
      </div>}
      
      {showFileUploadPopup && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "8px",

                width: "390px",
              }}
            >
              <div className="modal-body">
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100"
                >
                  <div className="w-100 px-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="">Upload File</h5>
                      <img
                        onClick={() => {
                          setShowFileUploadPopup(false);
                          setFormData({
                            message: "",
                            userType: "Admin",
                            ticketId: params?.id,
                            userId: globalState?.user?._id,
                            image: "",
                            imgPrev: "",
                          });
                        }}
                        src="https://cdn-icons-png.flaticon.com/128/2734/2734822.png"
                        style={{ height: "20px", cursor: "pointer" }}
                      />
                    </div>
                    <div className="col-md-12 my-auto">
                      <input
                        type="file"
                        id="image"
                        accept="image/*"
                        style={{ display: "none" }}
                        onChange={(e) => {
                          setFormData({
                            ...formData,
                            image: e.target.files[0],
                            imgPrev: URL.createObjectURL(e.target.files[0]),
                          });
                        }}
                      />
                      <label htmlFor="image" className="cursor-pointer">
                        <img
                          src={
                            formData.imgPrev
                              ? formData?.imgPrev
                              : "https://cdn-icons-png.flaticon.com/128/9261/9261196.png"
                          }
                          alt="image"
                          style={{
                            width: "120px",
                            height: "120px",
                            // borderRadius: "50%",
                            objectFit: "cover",
                          }}
                        />
                      </label>

                      <textarea
                        className="form-control my-3"
                        placeholder="Enter message"
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            message: e?.target?.value,
                          })
                        }
                      />
                      {formData?.message || formData?.image ? (
                        <button
                          className="btn bgThemePrimary w-100"
                          onClick={!isSending && sendMessageFunc}
                        >
                          {isSending ? "Sending ..." : "Send"}
                        </button>
                      ) : (
                        <button
                          className="btn bgThemePrimary w-100"
                          style={{ opacity: "0.5" }}
                        >
                          Send
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {showFileUploadPopup && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default ChatBox;
