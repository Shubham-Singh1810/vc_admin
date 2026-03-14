import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import {
  paydayLoanApplicationListServ,
  paydayLoanStatsServ,
  paydayDeleteLoanApplicationServ,
  updatePaydayLoanApplicationServ,
} from "../../services/loanApplication.services";
import { getUserListServ } from "../../services/user.service";
import { getBranchListServ } from "../../services/branch.service";
import { getAdminListServ } from "../../services/commandCenter.services";
import { getLoanPurposeServ } from "../../services/loanPurpose.service";
import Skeleton from "react-loading-skeleton";
import * as XLSX from "xlsx";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../../components/NoDataScreen";
import { toast } from "react-toastify";
import TableNavItems from "../../components/TableNavItems";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import Pagination from "../../components/Pagination";
import { useNavigate, useParams } from "react-router-dom";
function PaydayLoanApplicationList() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [list, setList] = useState([]);
  const [showSkelton, setShowSkelton] = useState(false);
  const [showStatsSkelton, setShowStatsSkelton] = useState(false);
  const [payload, setPayload] = useState({
    pageNo: 1,
    pageCount: 20,
    status: "",
  });
  const [documentCount, setDocumentCount] = useState();
  const getListFunc = async () => {
    setFilterPayload({ ...filterPayload, show: false });
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await paydayLoanApplicationListServ(payload);
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
     if (status == "closed") {
      return (
        <span className="status-badge bg-secondary-subtle text-secondary">
         Closed
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
      let response = await paydayLoanStatsServ();
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
      let response = await paydayDeleteLoanApplicationServ(deleteId);
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
  const [filterPayload, setFilterPayload] = useState({
    show: false,
    status: "",
    branchId: "",
    userId: "",
    loanPurposeId: "",
    assignedAdminId: "",
    processingStatus: "",
  });
  const [loanPurposeList, setLoanPurposeList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  useEffect(() => {
    getLoanPurposeFunc();
    getBranchListFunc();
    getUserListFunc();
    getAdminListFunc();
  }, []);
  const getLoanPurposeFunc = async () => {
    try {
      const response = await getLoanPurposeServ({
        pageCount: 100,
        status: true,
      });
      if (response?.data?.statusCode == "200") {
        setLoanPurposeList(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getBranchListFunc = async () => {
    try {
      const response = await getBranchListServ({
        pageCount: 100,
        status: true,
      });
      if (response?.data?.statusCode == "200") {
        setBranchList(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getUserListFunc = async () => {
    try {
      const response = await getUserListServ({
        pageCount: 100,
        isUserApproved: true,
      });
      if (response?.data?.statusCode == "200") {
        setUserList(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const getAdminListFunc = async () => {
    try {
      const response = await getAdminListServ({ pageCount: 100, status: true });
      if (response?.data?.statusCode == "200") {
        setAdminList(response?.data?.data);
      }
    } catch (error) {
      console.error(error);
    }
  };
  const [btnLoader, setBtnLoader] = useState("");
  const updateStatusFunc = async (payload) => {
    if (payload?.status == "rejected") {
      setBtnLoader(true);
    } else {
      setBtnLoader(payload._id);
    }
    try {
      let response = await updatePaydayLoanApplicationServ(payload);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getListFunc();
        setRejectPopup({
          _id: "",
          rejectReason: "",
          status: "rejected",
        });
      }
    } catch (error) {
      console.log(error);
    }
    setBtnLoader(false);
  };

  const [rejectPopup, setRejectPopup] = useState({
    _id: "",
    rejectReason: "",
    status: "rejected",
  });
  const exportToCSV = () => {
    if (!list || list.length === 0) {
      toast.error("No data to export");
      return;
    }

    const headers = [
      "Loan ID",
      "Loan Purpose",
      "Branch",
      "Customer Name",
      "Mobile",
      "Loan Amount",
      "Tenure (Days)",
      "Interest Rate",
      "Payable Amount",
      "Status",
      "Assigned Admin",
    ];

    const rows = list.map((v) => [
      v?.code || "",
      v?.loanPurposeId?.name || "",
      v?.branchId?.name || "",
      v?.fullName || "",
      v?.userId?.phone || "",
      v?.loanAmount || "",
      v?.tenure || "",
      v?.interestRate || "",
      v?.payable || "",
      v?.status || "",
      v?.assignedAdminId
        ? `${v?.assignedAdminId?.firstName} ${v?.assignedAdminId?.lastName}`
        : "",
    ]);

    let csvContent =
      headers.join(",") +
      "\n" +
      rows.map((row) => row.map((v) => `"${v}"`).join(",")).join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `payday-loan-applications-${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToExcel = () => {
    if (!list || list.length === 0) {
      toast.error("No data to export");
      return;
    }

    const excelData = list.map((v) => ({
      "Loan ID": v?.code || "",
      "Loan Purpose": v?.loanPurposeId?.name || "",
      Branch: v?.branchId?.name || "",
      "Customer Name": v?.fullName || "",
      Mobile: v?.userId?.phone || "",
      "Loan Amount": v?.loanAmount || "",
      "Tenure (Days)": v?.tenure || "",
      "Interest Rate": v?.interestRate || "",
      "Payable Amount": v?.payable || "",
      Status: v?.status || "",
      "Assigned Admin": v?.assignedAdminId
        ? `${v?.assignedAdminId?.firstName} ${v?.assignedAdminId?.lastName}`
        : "",
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Payday Loans");

    XLSX.writeFile(workbook, `payday-loan-applications-${Date.now()}.xlsx`);
  };

  return (
    <div className="container-fluid py-3">
      {/* User Header */}
      <div className="row g-3">
        {/* Loan Applications */}
        {showStatsSkelton
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
          <div className="dropdown me-3">
            <button
              className="btn btn-secondary dropdown-toggle shadow-sm"
              type="button"
              data-bs-toggle="dropdown"
              style={{ width: "170px" }}
            >
              Export
            </button>

            <ul className="dropdown-menu">
              <li>
                <button className="dropdown-item" onClick={exportToCSV}>
                  📄 Export as CSV
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={exportToExcel}>
                  📊 Export as Excel
                </button>
              </li>
            </ul>
          </div>

          {filterPayload.status ||
          filterPayload.userId ||
          filterPayload.branchId ||
          filterPayload.loanPurposeId ||
          filterPayload.assignedAdminId ||
          filterPayload.processingStatus ? (
            <div className="d-flex flex-wrap gap-2 my-3">
              {/* Status */}
              {filterPayload.status && (
                <span className="badge bg-primary d-flex align-items-center">
                  Status: {filterPayload.status}
                  <i
                    className="bi bi-x ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setFilterPayload({ ...filterPayload, status: "" });
                      setPayload({ ...payload, status: "" });
                    }}
                  />
                </span>
              )}

              {/* Customer */}
              {filterPayload.userId && (
                <span className="badge bg-success d-flex align-items-center">
                  Customer:{" "}
                  {
                    userList.find((u) => u._id === filterPayload.userId)
                      ?.firstName
                  }
                  <i
                    className="bi bi-x ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setFilterPayload({ ...filterPayload, userId: "" });
                      setPayload({ ...payload, userId: "" });
                    }}
                  />
                </span>
              )}

              {/* Branch */}
              {filterPayload.branchId && (
                <span className="badge bg-info d-flex align-items-center">
                  Branch:{" "}
                  {
                    branchList.find((b) => b._id === filterPayload.branchId)
                      ?.name
                  }
                  <i
                    className="bi bi-x ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setFilterPayload({ ...filterPayload, branchId: "" });
                      setPayload({ ...payload, branchId: "" });
                    }}
                  />
                </span>
              )}

              {/* Loan Purpose */}
              {filterPayload.loanPurposeId && (
                <span className="badge bg-warning d-flex align-items-center">
                  Loan Purpose:{" "}
                  {
                    loanPurposeList.find(
                      (l) => l._id === filterPayload.loanPurposeId
                    )?.name
                  }
                  <i
                    className="bi bi-x ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setFilterPayload({ ...filterPayload, loanPurposeId: "" });
                      setPayload({ ...payload, loanPurposeId: "" });
                    }}
                  />
                </span>
              )}

              {/* Assigned Admin */}
              {filterPayload.assignedAdminId && (
                <span className="badge bg-secondary d-flex align-items-center">
                  Assigned:{" "}
                  {
                    adminList.find(
                      (a) => a._id === filterPayload.assignedAdminId
                    )?.firstName
                  }
                  <i
                    className="bi bi-x ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setFilterPayload({
                        ...filterPayload,
                        assignedAdminId: "",
                      });
                      setPayload({ ...payload, assignedAdminId: "" });
                    }}
                  />
                </span>
              )}

              {/* Processing Status */}
              {filterPayload.processingStatus && (
                <span className="badge bg-danger d-flex align-items-center">
                  Processing: {filterPayload.processingStatus}
                  <i
                    className="bi bi-x ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setFilterPayload({
                        ...filterPayload,
                        processingStatus: "",
                      });
                      setPayload({ ...payload, processingStatus: "" });
                    }}
                  />
                </span>
              )}
              <button
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={() => {
                  const reset = {
                    show: false,
                    status: "",
                    branchId: "",
                    userId: "",
                    loanPurposeId: "",
                    assignedAdminId: "",
                    processingStatus: "",
                  };
                  setFilterPayload(reset);
                  setPayload({ ...payload, ...reset });
                }}
              >
                Clear All
              </button>
            </div>
          ) : (
            <button
              className="btn btn-light shadow-sm  px-3"
              onClick={() => setFilterPayload({ ...filterPayload, show: true })}
            >
              Filter <i className="bi bi-filter ms-2" />
            </button>
          )}
          <button
            className="btn bgThemePrimary shadow-sm ms-3"
            onClick={() => navigate("/create-payday-loan")}
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
                  <th>Loan Purpose</th>
                  <th>Branch</th>
                  <th>Customer</th>
                  <th>Amount</th>
                  <th>Tenure</th>
                  <th>Interest</th>
                  <th>Payable</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Assigned To</th>
                  {/* <th style={{ textAlign: "center" }}>Action</th> */}
                  <th style={{ textAlign: "center" }}>View/Edit</th>
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
                          <td>
                            <Skeleton width={100} />
                          </td>
                          <td>
                            <Skeleton width={100} />
                          </td>
                          {/* <td className="text-center">
                            <Skeleton width={100} />
                          </td> */}
                          <td className="text-center">
                            <Skeleton width={100} />
                          </td>
                        </tr>
                      );
                    })
                  : list?.map((v, i) => {
                      return (
                        <tr>
                          <td>
                          {/* {v?.selfieApprovalStatus == "uploaded" && <img style={{height:"10px", width:"10px"}} src="https://cdn-icons-png.flaticon.com/128/16311/16311323.png"/>} */}
                            {i + 1 + (payload?.pageNo - 1) * payload?.pageCount}
                          </td>
                          <td>{v?.code || "-"}</td>
                          <td>{v?.loanPurposeId?.name || "-"}</td>
                          <td>{v?.branchId?.name || "-"}</td>
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
                                  {v?.fullName || "-"}
                                </h6>{" "}
                                <p className="mb-0">
                                  {v?.userId?.phone || "-"}
                                </p>
                              </div>
                            </div>
                          </td>

                          <td>{v?.loanAmount || "-"}</td>
                          <td>{v?.tenure ? v?.tenure + " days" : "-"}</td>
                          <td>
                            {v?.interestRate ? v?.interestRate + "%" : "-"}
                          </td>
                          <td>{v?.payable || "-"}</td>
                          <td className="text-center">
                            {renderProfile(v?.status)}
                          </td>
                          <td className="text-center">
                            {v?.assignedAdminId
                              ? v?.assignedAdminId?.firstName +
                                " " +
                                v?.assignedAdminId?.lastName
                              : "-"}
                          </td>
                          {/* <td>
                            {(v?.status=="pending" || v?.status=="rejected") &&<div>
                              {" "}
                              {btnLoader == v?._id ? (
                                <button
                                  className="btn btn-sm btn-success "
                                  style={{ width: "90px", opacity: 0.5 }}
                                >
                                  Saving ...
                                </button>
                              ) : (
                                <button
                                  onClick={() =>
                                    updateStatusFunc({
                                      _id: v?._id,
                                      status: "approved",
                                    })
                                  }
                                  className="btn btn-sm btn-success  "
                                  style={{ width: "90px" }}
                                >
                                  Approve
                                </button>
                              )}
                            </div> }
                            {(v?.status=="pending" || v?.status=="approved") &&  <div>
                              <button
                                className="btn btn-sm btn-danger  mt-1"
                                onClick={() =>
                                  setRejectPopup({
                                    _id: v?._id,
                                    rejectReason: "",
                                    status: "rejected",
                                  })
                                }
                                style={{ width: "90px" }}
                              >
                                Reject
                              </button>
                            </div>}
                           
                          </td> */}
                          <td style={{ textAlign: "center" }}>
                            <a
                              onClick={() =>
                                navigate("/payday-loan-details/" + v?._id)
                              }
                              className="text-primary text-decoration-underline me-2"
                            >
                              <i class="bi bi-eye fs-6"></i>
                            </a>
                            <a
                              onClick={() =>
                                navigate("/update-payday-loan/" + v?._id)
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
      {filterPayload?.show && (
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
                      <h5 className="">Filter</h5>
                      <img
                        onClick={() =>
                          setFilterPayload({ ...filterPayload, show: false })
                        }
                        src="https://cdn-icons-png.flaticon.com/128/2734/2734822.png"
                        style={{ height: "20px", cursor: "pointer" }}
                      />
                    </div>
                    <div className="row">
                      <div className="col-6 mb-2">
                        <label>Status</label>
                        <select
                          className="form-control"
                          onChange={(e) =>
                            setFilterPayload({
                              ...filterPayload,
                              status: e?.target?.value,
                            })
                          }
                        >
                          <option value="">Select</option>
                          <option value="pending">New Request</option>
                          <option value="approved">Approved</option>
                          <option value="disbursed">Disbursed</option>
                          <option value="rejected">Rejected</option>
                          <option value="overdue">overdue</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>
                      <div className="col-6 mb-2">
                        <label>Customer</label>
                        <select
                          className="form-control"
                          onChange={(e) =>
                            setFilterPayload({
                              ...filterPayload,
                              userId: e?.target?.value,
                            })
                          }
                        >
                          <option value="">Select</option>
                          {userList?.map((v, i) => {
                            return (
                              <option value={v?._id}>
                                {v?.firstName + " " + v?.lastName}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="col-6 mb-2">
                        <label>Branch</label>
                        <select
                          className="form-control"
                          onChange={(e) =>
                            setFilterPayload({
                              ...filterPayload,
                              branchId: e?.target?.value,
                            })
                          }
                        >
                          <option value="">Select</option>

                          {branchList?.map((v, i) => {
                            return <option value={v?._id}>{v?.name}</option>;
                          })}
                        </select>
                      </div>
                      <div className="col-6 mb-2">
                        <label>Loan Purpose</label>
                        <select
                          className="form-control"
                          onChange={(e) =>
                            setFilterPayload({
                              ...filterPayload,
                              loanPurposeId: e?.target?.value,
                            })
                          }
                        >
                          <option value="">Select</option>
                          {loanPurposeList?.map((v, i) => {
                            return <option value={v?._id}>{v?.name}</option>;
                          })}
                        </select>
                      </div>
                      <div className="col-6 mb-2">
                        <label>Assigned To</label>
                        <select
                          className="form-control"
                          onChange={(e) =>
                            setFilterPayload({
                              ...filterPayload,
                              assignedAdminId: e?.target?.value,
                            })
                          }
                        >
                          <option value="">Select</option>
                          {adminList?.map((v, i) => {
                            return (
                              <option value={v?._id}>
                                {v?.firstName + " " + v?.lastName}
                              </option>
                            );
                          })}
                        </select>
                      </div>
                      <div className="col-6 mb-3">
                        <label>Processing Status</label>
                        <select
                          className="form-control"
                          onChange={(e) =>
                            setFilterPayload({
                              ...filterPayload,
                              processingStatus: e?.target?.value,
                            })
                          }
                        >
                          <option value="">Select</option>
                          <option value="checkEligibility">New Request</option>
                          <option value="ekyc">E-kyc</option>
                          <option value="selfie">Selfie</option>
                          <option value="bankStatement">Bank Statement</option>
                          <option value="loanOffer">Loan Offer</option>
                          <option value="residenceProof">
                            Residence Proof
                          </option>
                          <option value="reference">Reference</option>
                          <option value="bankDetails">Bank Details</option>
                          <option value="eSign">E-Sign</option>
                        </select>
                      </div>
                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-danger me-2"
                          onClick={() =>
                            setFilterPayload({
                              show: false,
                              status: "",
                              branchId: "",
                              userId: "",
                              loanPurposeId: "",
                              assignedAdminId: "",
                              processingStatus: "",
                            })
                          }
                        >
                          Cancel
                        </button>
                        <button
                          className="btn bgThemePrimary px-3"
                          onClick={() =>
                            setPayload({ ...payload, ...filterPayload })
                          }
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {filterPayload.show && <div className="modal-backdrop fade show"></div>}
      {rejectPopup?._id && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "8px",

                width: "350px",
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
                      <h5 className="">Reject Confirm</h5>
                      <img
                        onClick={() =>
                          setRejectPopup({
                            _id: "",
                            rejectReason: "",
                            status: "rejected",
                          })
                        }
                        src="https://cdn-icons-png.flaticon.com/128/2734/2734822.png"
                        style={{ height: "20px", cursor: "pointer" }}
                      />
                    </div>
                    <div className="row">
                      <div className="col-12 mb-2">
                        <label>Reason*</label>
                        <textarea
                          className="form-control"
                          rows={3}
                          onChange={(e) =>
                            setRejectPopup({
                              ...rejectPopup,
                              rejectReason: e?.target?.value,
                            })
                          }
                        />
                      </div>

                      <div className="d-flex justify-content-end">
                        {rejectPopup?.rejectReason ? (
                          btnLoader ? (
                            <button
                              className="btn bgThemePrimary w-100 mt-2"
                              style={{ opacity: "0.5" }}
                            >
                              Confirm...
                            </button>
                          ) : (
                            <button
                              className="btn bgThemePrimary w-100 mt-2"
                              onClick={() => updateStatusFunc(rejectPopup)}
                            >
                              Confirm
                            </button>
                          )
                        ) : (
                          <button
                            className="btn bgThemePrimary w-100 mt-2"
                            style={{ opacity: "0.5" }}
                          >
                            Confirm
                          </button>
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {rejectPopup._id && <div className="modal-backdrop fade show"></div>}
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

export default PaydayLoanApplicationList;
