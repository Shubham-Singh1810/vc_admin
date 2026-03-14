import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import {
  loanApplicationListServ,
  deleteLoanApplicationServ,
  getLoanStatsServ
} from "../../services/loanApplication.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../../components/NoDataScreen";
import { toast } from "react-toastify";
import TableNavItems from "../../components/TableNavItems";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import Pagination from "../../components/Pagination";
import { useNavigate, useParams } from "react-router-dom";
function AllApplicationList() {
  const navigate = useNavigate();
  const params = useParams();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [list, setList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const [showStatsSkelton, setShowStatsSkelton] = useState(false);
  const [payload, setPayload] = useState({
    searchKey: "",
    pageNo: 1,
    pageCount: 20,
    status: "",
    loanId: "",
  });
  const [documentCount, setDocumentCount] = useState();
  const getListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await loanApplicationListServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };

  useEffect(() => {
    getListFunc();
  }, [payload]);

  const renderProfile = (status) => {
    if (status == "pending") {
      return (
        <span className="status-badge bg-primary-subtle text-primary">
          New Request
        </span>
      );
    }
    if (status == "approved") {
      return (
        <span className="status-badge bg-warning-subtle text-warning">
          Approved
        </span>
      );
    }
    if (status == "rejected") {
      return (
        <span className="status-badge bg-danger-subtle text-danger">
          Rejected
        </span>
      );
    }
    if (status == "disbursed") {
      return (
        <span className="status-badge bg-info-subtle text-info">Disbursed</span>
      );
    }
    if (status == "completed") {
      return (
        <span className="status-badge bg-success-subtle text-success">
          Completed
        </span>
      );
    }
  };
   const getLoanStatsFunc = async () => {
      setShowStatsSkelton(true);
      try {
        let response = await getLoanStatsServ();
        if (response?.data?.statusCode == 200) {
          setDocumentCount(response?.data?.stats);
        }
      } catch (error) {
        console.log(error);
      }
      setShowStatsSkelton(false);
    };
    useEffect(() => {
      getLoanStatsFunc();
    }, []);
  const staticsData = [
    {
      label: "Total Application",
      icon: "bi bi-diagram-3",
      count: documentCount?.totalCount,
      iconColor: "#010a2d",
      percent: documentCount?.trends?.totalTrend?.percent,
      isTrendPositive: documentCount?.trends?.totalTrend?.isTrendPositive,
    },
    {
      label: "New Requests",
      icon: "bi bi-diagram-3",
      count: documentCount?.pendingCount,
      iconColor: "skyblue",
      percent: documentCount?.trends?.pendingTrend?.percent,
      isTrendPositive: documentCount?.trends?.pendingTrend?.isTrendPositive,
    },
    {
      label: "Approved Loans",
      icon: "bi bi-diagram-3",
      count: documentCount?.approvedCount,
      iconColor: "blue",
      percent: documentCount?.trends?.approvedTrend?.percent,
      isTrendPositive: documentCount?.trends?.approvedTrend?.isTrendPositive,
    },
    {
      label: "Disbursed Loans",
      icon: "bi bi-diagram-3",
      count: documentCount?.disbursedCount,
      iconColor: "gray",
      percent: documentCount?.trends?.disbursedTrend?.percent,
      isTrendPositive: documentCount?.trends?.disbursedTrend?.isTrendPositive,
    },
    {
      label: "Rejected Loans",
      icon: "bi bi-diagram-3",
      count: documentCount?.rejectedCount,
      iconColor: "red",
      percent: documentCount?.trends?.rejectedTrend?.percent,
      isTrendPositive: documentCount?.trends?.rejectedTrend?.isTrendPositive,
    },
    {
      label: "Completed Loans",
      icon: "bi bi-diagram-3",
      count: documentCount?.completedCount,
      iconColor: "green",
      percent: documentCount?.trends?.completedTrend?.percent,
      isTrendPositive: documentCount?.trends?.completedTrend?.isTrendPositive,
    },
  ];
  const handleDeleteFunc = async (id) => {
    try {
      let response = await deleteLoanApplicationServ(deleteId);
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

  const statusLabels = {
    "": "Select Status",
    pending: "New Request",
    approved: "Approved",
    rejected: "Rejected",
    disbursed: "Disbursed",
    completed: "Completed",
    true: "Active",
    false: "Inactive",
  };

  return (
    <div className="container-fluid py-3">
      {/* User Header */}
      <div className="row g-3">
        {/* Loan Applications */}
        {showSkelton
          ? [1, 2, 3, 4, 5, 6]?.map((v, i) => {
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
      <div className="d-flex justify-content-between align-items-center my-4">
        <h4 className="mb-0">All Applications</h4>
        <div className="d-flex align-items-center">
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
              {statusLabels[payload?.status] ?? "Select Status"}
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
                  onClick={() => setPayload({ ...payload, status: "pending" })}
                >
                  New Request
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, status: "approved" })}
                >
                  Approved
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, status: "rejected" })}
                >
                  Rejected
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() =>
                    setPayload({ ...payload, status: "disbursed" })
                  }
                >
                  Disbursed
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() =>
                    setPayload({ ...payload, status: "completed" })
                  }
                >
                  Completed
                </button>
              </li>
            </ul>
          </div>
          {/* <div className="dropdown me-2">
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
                : "Select Loan Type"}
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, status: "" })}
                >
                  Select Loan Type
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
          </div> */}

          <button
            className="btn bgThemePrimary shadow-sm"
            onClick={() => navigate("/create-application")}
          >
            + Add Loan
          </button>
        </div>
      </div>

      <div className="card shadow-sm border-0 ">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table
              id="usersTable"
              className="table table-hover align-middle mb-0"
            >
              <thead className="table-light">
                <tr>
                  <th>Sr No.</th>
                  <th>ID</th>
                  <th>Loan Type</th>
                  <th>Branch</th>
                  <th>Customer</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Amount</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Assigned To</th>

                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {showSkelton
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td>
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
                          <td>
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
                          {/* <td>
                            <Skeleton width={100} />
                          </td> */}

                          <td>
                            <Skeleton width={100} />
                          </td>
                          <td className="text-center">
                            <Skeleton width={100} />
                          </td>
                          <td className="text-center">
                            <Skeleton width={100} />
                          </td>
                        </tr>
                      );
                    })
                  : list?.map((v, i) => {
                      return (
                        <tr>
                          <td>{i + 1 + (payload?.pageNo - 1) * payload?.pageCount}</td>
                          <td>{v?.code}</td>
                          <td>{v?.loanId?.name}</td>
                          <td>{v?.branchId?.name}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  v?.userId?.profilePic
                                    ? v?.userId?.profilePic
                                    : "https://cdn-icons-png.flaticon.com/128/149/149071.png"
                                }
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  borderRadius: "50%",
                                }}
                              />
                              <div className="ms-2">
                                <h6
                                  style={{ fontSize: "12px" }}
                                  className="mb-0"
                                >
                                  {v?.userId?.firstName +
                                    " " +
                                    v?.userId?.lastName}
                                </h6>{" "}
                                <p className="mb-0">{v?.userId?.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td>{v?.startDate}</td>
                          <td>{v?.endDate}</td>
                          <td>{v?.loanAmount}</td>
                          <td className="text-center">
                            {renderProfile(v?.status)}
                          </td>
                          <td className="text-center">
                            {v?.assignedAdminId?.firstName +
                              " " +
                              v?.assignedAdminId?.lastName}
                          </td>

                          {/* <td className="text-center">{moment(v?.lastLogin).format("DD MMM, YYYY")}</td> */}
                          <td style={{ textAlign: "center" }}>
                            
                            <a
                              onClick={() =>
                                navigate("/loan-application-details/" + v?._id)
                              }
                              className="text-primary text-decoration-underline me-2"
                            >
                              <i class="bi bi-eye fs-6"></i>
                            </a>
                            <a
                              onClick={() =>
                                navigate("/update-loan-application/" + v?._id)
                              }
                              className="text-primary text-decoration-underline me-2"
                            >
                              <i class="bi bi-pencil fs-6"></i>
                            </a>
                            <a
                              onClick={() => {
                                setDeleteId(v?._id);
                                setShowConfirm(true);
                              }}
                              className="text-danger text-decoration-underline"
                            >
                              <i class="bi bi-trash fs-6"></i>
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
        title="Loan Application Delete"
        body="Do you really want to delete this Loan Application?"
      />
    </div>
  );
}

export default AllApplicationList;
