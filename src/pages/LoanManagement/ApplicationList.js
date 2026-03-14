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
function ApplicationList() {
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
    status: "pending",
    loanId: params?.loanId,
  });
  const [totalCount, setTotalCount] = useState(0);
  const [documentCount, setDocumentCount] = useState();
  const getListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await loanApplicationListServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
        setTotalCount(response?.data?.documentCount?.totalCount);
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };

  useEffect(() => {
    getListFunc();
  }, [payload]);
  useEffect(() => {
    setPayload({
      searchKey: "",
      pageNo: 1,
      pageCount: 20,
      status: "pending",
      loanId: params?.loanId,
    });
  }, [params]);

  const renderProfile = (status) => {
    if (status) {
      return (
        <span className="status-badge bg-success-subtle text-success">
          Active
        </span>
      );
    } else {
      return (
        <span className="status-badge bg-danger-subtle text-danger">
          Inactive
        </span>
      );
    }
  };
  
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

  const navItems = [
    {
      name: "New Request",
      img: "https://cdn-icons-png.flaticon.com/128/4083/4083457.png",
      status:"pending",
    },
    {
      name: "Approved Loans",
      img: "https://cdn-icons-png.flaticon.com/128/3002/3002398.png",
      status:"approved",
    },
    {
      name: "Disbursed Loans",
      img: "https://cdn-icons-png.flaticon.com/128/5501/5501400.png",
      status:"disbursed",
    },
    {
      name: "Rejected Loans",
      img: "https://cdn-icons-png.flaticon.com/128/2822/2822531.png",
      status:"rejected",
    },
    {
      name: "Completed Loans",
      img: "https://cdn-icons-png.flaticon.com/128/16136/16136112.png",
      status:"completed"
    },
  ];
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
      {/* Tabs */}
      <div className="d-flex justify-content-between align-items-center w-100">
        <ul
          className="nav nav-tabs mb-4 bg-white  w-100 "
          id="loanTabs"
          role="tablist"
        >
          {navItems?.map((v, i) => {
            return (
              <li className="nav-item   " role="presentation">
                <button
                  className={
                    "nav-link  d-flex align-items-center" +
                    (v?.status == payload?.status ? " active" : " ")
                  }
                  id="personal-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#personal"
                  type="button"
                  role="tab"
                  onClick={()=>setPayload({...payload , status:v?.status})}
                >
                  <img src={v?.img} className="me-2" width={18} />
                  {v?.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="card shadow-sm border-0">
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
                  <th>Branch</th>
                  <th>Customer</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Amount</th>
                  <th>Created By</th>
                  <th>Assigned To</th>

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
                          <td>
                            {v?.createdBy?.firstName +
                              " " +
                              v?.createdBy?.lastName}
                          </td>
                          <td>
                            {v?.assignedAdminId?.firstName +
                              " " +
                              v?.assignedAdminId?.lastName}
                          </td>

                          {/* <td className="text-center">{moment(v?.lastLogin).format("DD MMM, YYYY")}</td> */}
                          <td style={{ textAlign: "center" }}>
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
              totalCount={totalCount || 0}
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

export default ApplicationList;
