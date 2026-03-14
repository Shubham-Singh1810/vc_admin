import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotifyServ,
  deleteNotifynServ,
  updateNotifyServ,
} from "../../services/notification.service";
import { getUserListServ } from "../../services/user.service";
import { MultiSelect } from "react-multi-select-component";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../../components/NoDataScreen";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import moment from "moment";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { useGlobalState } from "../../GlobalProvider";
function ScheduleRemainders() {
  const { globalState } = useGlobalState();
  const permissions = globalState?.user?.role?.permissions || [];
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [showSkelton, setShowSkelton] = useState(false);
  const [editFormData, setEditFormData] = useState({
    _id: "",
    title: "",
    subTitle: "",
    date: "",
    time: "",
    notifyUserIds: [],
    mode: [],
    icon: "",
  });
  const [payload, setPayload] = useState({
    searchKey: "",
    pageNo: 1,
    pageCount: 20,
    isDelivered: "",
    isScheduled:true
  });
  const [documentCount, setDocumentCount] = useState();
  const getListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getNotifyServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
        setDocumentCount(response?.data?.documentCount);
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };
  const [userList, setUserList] = useState([]);
  const getUserListFunc = async () => {
    try {
      let response = await getUserListServ({
        pageCount: 100,
        isUserApproved: true,
      });
      if (response?.data?.statusCode == "200") {
        setUserList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getUserListFunc();
  }, []);
  useEffect(() => {
    getListFunc();
  }, [payload]);

  const renderProfile = (isDelivered) => {
    if (isDelivered) {
      return (
        <span className="status-badge bg-success-subtle text-success">
          Delivered
        </span>
      );
    } else {
      return (
        <span className="status-badge bg-warning-subtle text-warning">
          Scheduled
        </span>
      );
    }
  };
  const staticsData = [
    {
      label: "Total Notification",
      icon: "bi bi-bell",
      count: documentCount?.totalCount,

      iconColor: "#010a2d",
    },
    {
      label: "Scheduled",
      icon: "bi bi-bell",
      count: documentCount?.activeCount,

      iconColor: "green",
    },
    {
      label: "Delivered",
      icon: "bi bi-bell",
      count: documentCount?.inactiveCount,
      iconColor: "red",
    },
  ];
  const handleDeleteFunc = async (id) => {
    try {
      let response = await deleteNotifynServ(deleteId);
      if (response?.data?.statusCode == "200") {
        getListFunc();
        toast.success(response?.data?.message);
        setShowConfirm(false);
        setDeleteId("");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const [editLoader, setEditLoader] = useState(false);
  const handleUpdateFunc = async () => {
    setEditLoader(true);
    try {
      let response = await updateNotifyServ(editFormData);
      if (response?.data?.statusCode == "200") {
        setEditFormData({
          _id: "",
          title: "",
          subTitle: "",
          date: "",
          time: "",
          notifyUserIds: [],
          mode: [],
          icon: "",
        });
        getListFunc()
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setEditLoader(false);
  };
  return (
    <div className="container-fluid user-table py-3">
      {/* KPIs */}
      <div className="row g-3">
        {/* Loan Applications */}
        {showSkelton
          ? [1, 2, 3]?.map((v, i) => {
              return (
                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="card-soft p-2 kpi">
                    <div className="d-flex justify-content-between align-items-center">
                      <Skeleton height={50} width={50} />
                      <div className="card-soft-content">
                        <div className="text-uppercase small">
                          <Skeleton height={20} width={100} />
                        </div>
                        <div className="value">
                          <Skeleton height={30} width={150} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : staticsData?.map((v, i) => {
              return (
                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="card-soft p-3 kpi">
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className="icon"
                        style={{ background: "#f4f6ff", color: v?.iconColor }}
                      >
                        <i className={v?.icon} />
                      </span>
                      <div className="card-soft-content">
                        <div className="text-uppercase small">{v.label}</div>
                        <div className="value">{v?.count}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center my-4">
        <h4 className="mb-0">Scheduled Notifications</h4>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center px-2 user-search">
            <form className="input-group search ms-2 d-none d-md-flex">
              <span className="input-group-text input-span">
                <i className="bi bi-search" />
              </span>
              <input
                type="search"
                className="form-control search-input"
                placeholder="Title, Message..."
                value={payload?.searchKey}
                onChange={(e) =>
                  setPayload({ ...payload, searchKey: e?.target?.value })
                }
              />
            </form>
          </div>
          <div className="dropdown me-2">
            <button
              className="btn btn-light dropdown-toggle border height37"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                width: "150px",
                fontSize: "14px",
              }}
            >
              {payload?.isDelivered === ""
                ? "Select Status"
                : payload?.isDelivered === true
                ? "Delivered"
                : "Scheduled"}
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, isDelivered: "" })}
                >
                  Select Status
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => {
                    setPayload({ ...payload, isDelivered: false });
                  }}
                >
                  Scheduled
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, isDelivered: true })}
                >
                  Delivered
                </button>
              </li>
            </ul>
          </div>
          {permissions?.includes("Branches-Create") && (
            <button
              className="btn  bgThemePrimary shadow-sm"
              onClick={() => navigate("/notify")}
            >
              + Notification
            </button>
          )}
        </div>
      </div>
      {/* Table Card */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table
              id="usersTable"
              className="table table-hover align-middle mb-0"
            >
              <thead className="table-light">
                <tr>
                  <th className="text-center">Sr No.</th>
                  <th>Icon</th>
                  <th>Title</th>
                  <th>Message</th>
                  <th className="text-center">Date & Time</th>
                  <th className="text-center">Mode</th>
                  <th className="text-center">Status</th>
                  
                  {(permissions?.includes("Branches-Edit") ||
                    permissions?.includes("Branches-Delete")) && (
                    <th style={{ textAlign: "center" }}>Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {showSkelton
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td className="text-center">
                            <Skeleton width={100} />
                          </td>
                          <td>
                            <Skeleton width={100} />
                          </td>
                          <td>
                            <Skeleton width={100} />
                          </td>

                          <td>
                            <Skeleton width={100} />
                          </td>
                          <td className="text-center">
                            <Skeleton width={100} />
                          </td>
                          
                          <td className="text-center">
                            <Skeleton width={100} />
                          </td>
                          <td className="text-center">
                            <Skeleton width={100} />
                          </td>
                          {(permissions?.includes("Branches-Edit") ||
                            permissions?.includes("Branches-Delete")) && (
                            <td className="text-center">
                              <Skeleton width={100} />
                            </td>
                          )}
                        </tr>
                      );
                    })
                  : list?.map((v, i) => {
                      return (
                        <tr>
                          <td className="text-center">
                            {i + 1 + (payload?.pageNo - 1) * payload?.pageCount}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  v?.icon ||
                                  "https://cdn-icons-png.flaticon.com/128/2645/2645890.png"
                                }
                                alt="User"
                                className="rounded-circle me-2"
                                width={40}
                                height={40}
                              />
                            </div>
                          </td>
                          <td>
                            <h6
                              className="mb-0"
                              style={{ fontSize: "14px", width: "150px" }}
                            >
                              {v?.title}
                            </h6>{" "}
                          </td>
                          <td style={{ width: "200px" }}>{v?.subTitle}</td>
                          <td className="text-center">
                            {moment(v?.date).format("DD MMM, YYYY")} ||{" "}
                            {v?.time}
                          </td>
                          <td className="text-center">
                            {v?.mode?.map((item, i) => (
                              <span key={i} className="me-1">
                                {item.toUpperCase()}
                                {i !== v.mode.length - 1 && ", "}
                              </span>
                            ))}
                          </td>

                          <td className="text-center">
                            {renderProfile(v?.isDelivered)}
                          </td>
                          

                          {/* <td className="text-center">{moment(v?.lastLogin).format("DD MMM, YYYY")}</td> */}
                          <td style={{ textAlign: "center" }}>
                            {v?.isDelivered && "--"}
                            {permissions?.includes("Branches-Edit") &&
                              !v?.isDelivered && (
                                <a
                                  onClick={() =>
                                    setEditFormData({
                                      _id: v?._id,
                                      title: v?.title,
                                      subTitle: v?.subTitle,
                                      date: v?.date,
                                      time: v?.time,
                                      notifyUserIds: v?.notifyUserIds,
                                      mode: v?.mode,
                                      icon: v?.icon,
                                    })
                                  }
                                  className="text-primary text-decoration-underline me-2"
                                >
                                  <i class="bi bi-pencil fs-6"></i>
                                </a>
                              )}
                            {permissions?.includes("Branches-Delete") &&
                              !v?.isDelivered && (
                                <a
                                  onClick={() => {
                                    setDeleteId(v?._id);
                                    setShowConfirm(true);
                                  }}
                                  className="text-danger text-decoration-underline"
                                >
                                  <i class="bi bi-trash fs-6"></i>
                                </a>
                              )}
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
            {list?.length == 0 && !showSkelton && <NoDataScreen />}
            {editFormData?._id && (
              <div
                className="modal fade show d-flex align-items-center justify-content-center"
                tabIndex="-1"
              >
                <div className="modal-dialog">
                  <div
                    className="modal-content"
                    style={{
                      borderRadius: "8px",

                      width: "700px",
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
                            <h5 className="">Update Notification</h5>
                            <img
                              onClick={() =>
                                setEditFormData({
                                  show: false,
                                  name: "",
                                  phone: "",
                                  contactPerson: "",
                                  status: "",
                                  address: "",
                                  city: "",
                                  state: "",
                                  pincode: "",
                                  description: "",
                                })
                              }
                              src="https://cdn-icons-png.flaticon.com/128/2734/2734822.png"
                              style={{ height: "20px", cursor: "pointer" }}
                            />
                          </div>
                          <div className="row">
                            <div className="col-3 my-auto ">
                              <input
                                type="file"
                                id="icon"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    icon: e.target.files[0],
                                  })
                                }
                              />
                              <label htmlFor="icon" className="cursor-pointer">
                                <img
                                  src={
                                    editFormData.icon
                                      ? typeof editFormData.icon === "string"
                                        ? editFormData.icon
                                        : URL.createObjectURL(editFormData.icon)
                                      : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                                  }
                                  alt="icon"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                />
                              </label>
                              <div>
                                <small>Upload Icon</small>
                              </div>
                            </div>
                            <div className="col-9">
                              <div className="mb-3">
                                <label>
                                  Title <span className="text-danger">*</span>
                                </label>
                                <input
                                  className="form-control"
                                  value={editFormData?.title}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      title: e?.target?.value,
                                    })
                                  }
                                />
                              </div>
                              <div className="mb-3">
                                <label>
                                  Message <span className="text-danger">*</span>
                                </label>
                                <textarea
                                  className="form-control"
                                  value={editFormData?.subTitle}
                                  onChange={(e) =>
                                    setEditFormData({
                                      ...editFormData,
                                      subTitle: e?.target?.value,
                                    })
                                  }
                                />
                              </div>
                            </div>
                          </div>

                          <div className="row mb-3">
                            <div className="col-6">
                              <label>
                                Date <span className="text-danger">*</span>
                              </label>
                              <input
                                type="date"
                                className="form-control"
                                value={editFormData?.date}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    date: e?.target?.value,
                                  })
                                }
                              />
                            </div>
                            <div className="col-6">
                              <label>
                                Time <span className="text-danger">*</span>
                              </label>
                              <input
                                type="time"
                                className="form-control"
                                value={editFormData?.time}
                                onChange={(e) =>
                                  setEditFormData({
                                    ...editFormData,
                                    time: e?.target?.value,
                                  })
                                }
                              />
                            </div>
                          </div>
                          <div className="mb-3">
                            <label>
                              Select Users{" "}
                              <span className="text-danger">*</span>
                            </label>
                            <MultiSelect
                              options={userList.map((v) => ({
                                value: v?._id,
                                label: v?.firstName,
                              }))}
                              value={
                                userList
                                  ?.filter((v) => {
                                    // ✅ Handle both: when branch is array of objects or array of IDs
                                    const userIds =
                                      editFormData?.notifyUserIds?.map((b) =>
                                        typeof b === "object" ? b._id : b
                                      );
                                    return userIds?.includes(v._id);
                                  })
                                  ?.map((v) => ({
                                    value: v._id,
                                    label: v.firstName,
                                  })) || []
                              }
                              // onChange={(selected) =>
                              //   setFieldValue(
                              //     "branch",
                              //     selected.map((s) => s.value)
                              //   )
                              // }
                              onChange={(selected) =>
                                setEditFormData({
                                  ...editFormData,
                                  notifyUserIds: selected.map((s) => s.value),
                                })
                              }
                              labelledBy="Select User"
                            />
                          </div>
                          <div className="mb-3">
                            <label>
                              Select Mode <span className="text-danger">*</span>
                            </label>

                            <div className="border p-3 rounded">
                              {[
                                { id: "allMode", label: "All", value: "all" },
                                {
                                  id: "emailMode",
                                  label: "Email",
                                  value: "email",
                                },
                                {
                                  id: "textMode",
                                  label: "Text / SMS",
                                  value: "text",
                                },
                                {
                                  id: "pushMode",
                                  label: "Push Notification",
                                  value: "push",
                                },
                                {
                                  id: "inAppMode",
                                  label: "In-App Notification",
                                  value: "in_app",
                                },
                              ].map(({ id, label, value }) => (
                                <div className="form-check mb-2" key={id}>
                                  <input
                                    className="form-check-input"
                                    type="checkbox"
                                    id={id}
                                    value={value}
                                    checked={
                                      value === "all"
                                        ? editFormData.mode.length === 4 // 4 actual modes selected
                                        : editFormData.mode.includes(value)
                                    }
                                    onChange={(e) => {
                                      let newModes = [...editFormData.mode];

                                      if (value === "all") {
                                        // Select all or unselect all
                                        if (newModes.length === 4) {
                                          newModes = [];
                                        } else {
                                          newModes = [
                                            "email",
                                            "text",
                                            "push",
                                            "in_app",
                                          ];
                                        }
                                      } else {
                                        // Toggle individual mode
                                        if (newModes.includes(value)) {
                                          newModes = newModes.filter(
                                            (m) => m !== value
                                          );
                                        } else {
                                          newModes.push(value);
                                        }
                                      }

                                      setEditFormData({
                                        ...editFormData,
                                        mode: newModes,
                                      });
                                    }}
                                  />
                                  <label
                                    className="form-check-label"
                                    htmlFor={id}
                                  >
                                    {label}
                                  </label>
                                </div>
                              ))}
                            </div>
                          </div>
                          {editFormData?.title &&
                          editFormData?.subTitle &&
                          editFormData?.date &&
                          editFormData?.time &&
                          editFormData?.notifyUserIds?.length > 0 &&
                          editFormData?.mode?.length > 0 ? (
                            editLoader ? (
                              <button
                                className="btn bgThemePrimary w-100"
                                style={{ opacity: "0.5" }}
                              >
                                Updating ...
                              </button>
                            ) : (
                              <button
                                className="btn bgThemePrimary w-100"
                                onClick={() => handleUpdateFunc()}
                              >
                                Update
                              </button>
                            )
                          ) : (
                            <button
                              className="btn bgThemePrimary w-100"
                              style={{ opacity: "0.5" }}
                            >
                              Update
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
            {editFormData?._id && (
              <div className="modal-backdrop fade show"></div>
            )}
            <Pagination
              payload={payload}
              setPayload={setPayload}
              totalCount={documentCount?.totalCount || 0}
            />
          </div>
        </div>
      </div>

      <ConfirmDeleteModal
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteFunc}
        title="Notification Delete"
        body="Do you really want to delete this notification?"
      />
    </div>
  );
}

export default ScheduleRemainders;
