import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getUserListServ,
  getUserStatsServ,
  deleteUserServ,
  updateUserServ,
} from "../services/user.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../components/NoDataScreen";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import moment from "moment";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useGlobalState } from "../GlobalProvider";
function BatchStudentList({profileStatus, title}) {
  const { globalState } = useGlobalState();
  const permissions = globalState?.user?.role?.permissions || [];
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [showSkelton, setShowSkelton] = useState(false);
  const [showStatsSkelton, setShowStatsSkelton] = useState(false);
  const [payload, setPayload] = useState({
    searchKey: "",
    pageNo: 1,
    pageCount: 20,
    profileStatus
  });
  const [documentCount, setDocumentCount] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const getListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getUserListServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
        setTotalCount(response?.data?.documentCount?.totalCount);
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };
  const getUserStatsFunc = async () => {
    setShowStatsSkelton(true);
    try {
      let response = await getUserStatsServ();
      if (response?.data?.statusCode == 200) {
        setDocumentCount(response?.data?.stats);
      }
    } catch (error) {
      console.log(error);
    }
    setShowStatsSkelton(false);
  };
  useEffect(() => {
    getUserStatsFunc();
  }, []);
  useEffect(() => {
    getListFunc();
  }, [payload]);
  const renderProfile = (status) => {
    if (status == "registered") {
      return (
        <span className="status-badge bg-info-subtle text-info">
          Registered
        </span>
      );
    }
    if (status == "verified") {
      return (
        <span className="status-badge bg-warning-subtle text-warning">
          Verified
        </span>
      );
    }
     if (status == "profileUpdated") {
      return (
        <span className="status-badge bg-info-subtle text-success">
          Profile Updated
        </span>
      );
    }
    if (status == "active") {
      return (
        <span className="status-badge bg-success-subtle text-success">
          Active
        </span>
      );
    }
    if (status == "inActive") {
      return (
        <span className="status-badge bg-danger-subtle text-danger">
          Inactive
        </span>
      );
    }
    if (status == "blocked") {
      return (
        <span className="status-badge bg-danger-subtle text-danger">
          Blocked
        </span>
      );
    }
  };
  const updateStatusFunc = async (id, status) => {
    try {
      let response = await updateUserServ({ id: id, isUserApproved: status });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getListFunc();
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  const staticsData = [
    {
      label: "Total Users",
      icon: "bi bi-people",
      count: documentCount?.totalCount,
      percent: documentCount?.trends?.totalTrend?.percent,
      isTrendPositive: documentCount?.trends?.totalTrend?.isTrendPositive,
      iconColor: "#010a2d",
    },
    {
      label: "Active Users",
      icon: "bi bi-people",
      count: documentCount?.activeCount,
      percent: documentCount?.trends?.activeTrend?.percent,
      isTrendPositive: documentCount?.trends?.activeTrend?.isTrendPositive,
      iconColor: "green",
    },
    {
      label: "Registered Users",
      icon: "bi bi-people",
      count: documentCount?.registeredCount,
      percent: documentCount?.trends?.registeredTrend?.percent,
      isTrendPositive: documentCount?.trends?.registeredTrend?.isTrendPositive,
      iconColor: "blue",
    },
    {
      label: "Blocked Users",
      icon: "bi bi-people",
      count: documentCount?.blockedCount,
      percent: documentCount?.trends?.blockedTrend?.percent,
      isTrendPositive: documentCount?.trends?.blockedTrend?.isTrendPositive,
      iconColor: "red",
    },
  ];
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const handleDeleteFunc = async (id) => {
    try {
      let response = await deleteUserServ(deleteId);
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
                  <th>User</th>
                  <th>Email / Mobile</th>
                  <th>Joined At</th>

                  <th className="text-center">Profile Status</th>
                  <th className="text-center">Created By</th>
                  {permissions?.includes("Users-Approve") && (
                    <th style={{ textAlign: "center" }}>Manage</th>
                  )}

                  {(permissions?.includes("Users-Edit") ||
                    permissions?.includes("Users-Delete")) && (
                    <th style={{ textAlign: "center" }}>Action</th>
                  )}
                </tr>
              </thead>
              <tbody>
                {showSkelton
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <Skeleton width={50} />
                          </td>
                          <td>
                            <Skeleton width={50} />
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

                          {permissions?.includes("Users-Approve") && (
                            <td className="text-center">
                              <Skeleton width={100} />
                            </td>
                          )}
                          {(permissions?.includes("Users-Edit") ||
                            permissions?.includes("Users-Delete")) && (
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
                            {/* {i+1} */}
                            {i + 1 + (payload?.pageNo - 1) * payload?.pageCount}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  v?.profilePic ||
                                  "https://cdn-icons-png.flaticon.com/128/149/149071.png"
                                }
                                alt="User"
                                className="rounded-circle me-2"
                                width={40}
                                height={40}
                              />
                              <div>
                                <h6
                                  className="mb-0"
                                  style={{ fontSize: "14px" }}
                                >
                                  {v?.firstName ?  v?.firstName+""+v?.lastName :"- -"}
                                </h6>
                                <small className="text-muted">
                                  ID: {v?.code || "N/A"}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div>{v?.email || "-"}</div>
                              <small className="text-muted">
                                {v?.countryCode} {v?.phone}
                              </small>
                            </div>
                          </td>
                          <td>{moment(v?.createdAt).format("DD MMM, YYYY")}</td>

                          <td className="text-center">
                            {renderProfile(v?.profileStatus)}
                          </td>

                          <td className="text-center">
                            {v?.createdBy ? (
                              <span className="bg-secondary badge">
                                {v?.createdBy?.firstName || "-" +
                                  " " +
                                  v?.createdBy?.lastName || "-"}
                              </span>
                            ) : (
                              <span className="text-secondary badge bg-light">
                                Self
                              </span>
                            )}
                          </td>
                          {permissions?.includes("Users-Approve") && (
                            <td className="text-center">
                            {v?.isUserApproved ? (
                              <button
                                className="status-toggle approved"
                                onClick={() => updateStatusFunc(v?._id, false)}
                              >
                                <span style={{ fontSize: "10px" }}>
                                  Approved
                                </span>
                                <div className="circle"></div>
                              </button>
                            ) : (
                              <button
                                className="status-toggle pending bg-secondary"
                                onClick={() => updateStatusFunc(v?._id, true)}
                              >
                                <span style={{ fontSize: "10px" }}>
                                  Inactive
                                </span>
                                <div className="circle "></div>
                              </button>
                            )}
                          </td>
                          )}
                          
                          {/* <td style={{ textAlign: "center" }}>
                            
                            
                            
                          </td> */}
                          <td style={{ textAlign: "center" }}>
                            <a
                              onClick={() =>
                                navigate("/user-details/" + v?._id)
                              }
                              className="text-primary text-decoration-underline"
                            >
                              <i class="bi bi-eye fs-6"></i>
                            </a>
                            {permissions?.includes("Users-Edit") && (
                              <a
                              onClick={() => navigate("/update-user/" + v?._id)}
                              className="text-primary text-decoration-underline mx-2"
                            >
                              <i class="bi bi-pencil fs-6"></i>
                            </a>
                            )}
                            {permissions?.includes("Users-Delete") && (
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
            <Pagination
              payload={payload}
              setPayload={setPayload}
              totalCount={totalCount || 0}
            />
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteFunc}
        title="User Delete"
        body="Do you really want to delete this User?"
      />
    </div>
  );
}

export default BatchStudentList;
