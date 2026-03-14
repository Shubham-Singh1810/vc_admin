import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getNotifyServ,
  deleteNotifynServ,
} from "../../services/notification.service";
import {notificationEventListServ} from "../../services/notificationConfigration.services"
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../../components/NoDataScreen";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import moment from "moment";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { useGlobalState } from "../../GlobalProvider";
function SystemNotification() {
  const { globalState } = useGlobalState();
  const permissions = globalState?.user?.role?.permissions || [];
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [showSkelton, setShowSkelton] = useState(false);
  const [payload, setPayload] = useState({
    searchKey: "",
    pageNo: 1,
    pageCount: 20,
    isScheduled: true,
    isDelivered: "",
  });
  const [documentCount, setDocumentCount] = useState();
  const getListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await notificationEventListServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
        setDocumentCount(response?.data?.documentCount);
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };

  useEffect(() => {
    getListFunc();
  }, [payload]);

  const renderProfile = (isDelivered) => {
    if (isDelivered) {
      return (
        <span className="status-badge bg-success-subtle text-success">
          Active
        </span>
      );
    } else {
      return (
        <span className="status-badge bg-warning-subtle text-warning">
          Inactive
        </span>
      );
    }
  };
  const staticsData = [
    {
      label: "Total Events",
      icon: "bi bi-bell",
      count: documentCount?.totalCount,

      iconColor: "#010a2d",
    },
    {
      label: "Active",
      icon: "bi bi-bell",
      count: documentCount?.activeCount,

      iconColor: "green",
    },
    {
      label: "Inactive",
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
        <h4 className="mb-0">System Notifications</h4>
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
              {payload?.status === true
                ? "Active"
                : payload?.status === false
                ? "Inactive"
                : "Select Status"}
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, status: "" })}
                >
                  Select Status
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, status: "true" })}
                >
                  Active
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, status: "false" })}
                >
                  Inactive
                </button>
              </li>
            </ul>
          </div>
          {/* {permissions?.includes("Branches-Create") && (
            <button
              className="btn  bgThemePrimary shadow-sm"
              onClick={() => navigate("/notify")}
            >
              + Notification
            </button>
          )} */}
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
                  <th>Event</th>
                  <th>Title</th>
                  <th>Message</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Reciver</th>
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
                            <h6
                              className="mb-0"
                              style={{ fontSize: "14px", width: "200px" }}
                            >
                              {v?.event}
                            </h6>{" "}
                          </td>
                          <td>
                            <h6
                              className="mb-0"
                              style={{ fontSize: "14px", width: "200px" }}
                            >
                              {v?.title}
                            </h6>{" "}
                          </td>
                          <td style={{ width: "300px" }}>{v?.subTitle}</td>
                          <td className="text-center">
                            {renderProfile(v?.status)}
                          </td>
                          <td className="text-center">{v?.reciver}</td>
                          {/* <td className="text-center">{moment(v?.lastLogin).format("DD MMM, YYYY")}</td> */}
                          <td style={{ textAlign: "center" }}>
                            <a
                              
                                className="text-primary text-decoration-underline "
                              >
                                <i class="bi bi-pencil fs-6"></i>
                              </a>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
            {list?.length == 0 && !showSkelton && <NoDataScreen />}
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

export default SystemNotification;
