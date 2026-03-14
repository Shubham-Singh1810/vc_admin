import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import { useNavigate, useParams } from "react-router-dom";
import { getUserDetailsServ } from "../../services/user.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../../components/NoDataScreen";
import { toast } from "react-toastify";
import TableNavItems from "../../components/TableNavItems";
import {
  loanApplicationListServ,
  deleteLoanApplicationServ,
  getLoanStatsServ,
} from "../../services/loanApplication.services";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import Pagination from "../../components/Pagination";
function UserLoanHistory() {
  const [list, setList] = useState([]);
  const [details, setDetails] = useState([]);
  const [showConfirm, setShowConfirm] = useState(false);
  const [showListSkelton, setShowListSkelton] = useState(false);
    const [deleteId, setDeleteId] = useState(null);
  const navigate = useNavigate();
  const params = useParams();
  const [showSkelton, setShowSkelton] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pincode: "",
    address: "",
    state: "",
    city: "",
    dob: "",
    gender: "",
    profilePic: "",
  });
  const getUserDetailsFunc = async (id) => {
    setShowSkelton(true);
    try {
      let response = await getUserDetailsServ(id);
      if (response?.data?.statusCode == "200") {
        setDetails(response?.data?.data);
        let userDetails = response?.data?.data;
        setFormData({
          firstName: userDetails?.firstName,
          lastName: userDetails?.lastName,
          email: userDetails?.email,
          phone: userDetails?.phone,
          pincode: userDetails?.pincode,
          address: userDetails?.address,
          state: userDetails?.state,
          city: userDetails?.city,
          dob: userDetails?.dob,
          gender: userDetails?.gender,
          profilePic: "",
          profilePrev: userDetails?.profilePrev,
        });
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };
  useEffect(() => {
    getUserDetailsFunc(params?.id);
  }, [params?.id]);
  const getListFunc = async () => {
    if (list?.length == 0) {
      setShowListSkelton(true);
    }
    try {
      let response = await loanApplicationListServ({ userId: params?.id });
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
    setShowListSkelton(false);
  };

  useEffect(() => {
    getListFunc();
  }, [params]);
  const navItems = [
    {
      name: "Personal",
      path: `/user-details/${params?.id}`,
      img: "https://cdn-icons-png.flaticon.com/128/1077/1077114.png",
    },
    {
      name: "Employement Details",
      path: `/user-employemt-details/${params?.id}`,
      img: "https://cdn-icons-png.flaticon.com/128/5078/5078214.png",
    },
    {
      name: "Documents Details",
      path: `/user-documents/${params?.id}`,
      img: "https://cdn-icons-png.flaticon.com/128/2991/2991106.png",
    },
    {
      name: "Loan History",
      path: `/user-loan-history/${params?.id}`,
      img: "https://cdn-icons-png.flaticon.com/128/6619/6619116.png",
    },
    // {
    //    name: "Scheduled EMIs",
    //   path: `/user-emis/${params?.id}`,
    //   img: "https://cdn-icons-png.flaticon.com/128/15233/15233273.png",
    // },
    {
      name: "Transaction History",
      path: `/user-transection-history/${params?.id}`,
      img: "https://cdn-icons-png.flaticon.com/128/879/879890.png",
    },
  ];
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
  const [isEditable, setIsEditable] = useState(false);
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
  
  return (
    <div className="container-fluid py-3">
      {/* User Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
            className="img-fluid rounded-circle"
            width={50}
            alt="User"
          />
          <div className="ms-3">
            <h5 className="mb-1">
              {details?.firstName ? details?.firstName + " " + details?.lastName :"- -"}
            </h5>
            <h6 className="text-secondary">ID: {details?.code}</h6>
          </div>
        </div>
        {/* <div>
          <select className="form-select">
            <option value="">Update Status</option>
            <option value="registered">Registered</option>
            <option value="verified">Verified</option>
            <option value="active">Active</option>
            <option value="blocked">Block</option>
          </select>
        </div> */}
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
                    (v?.name == "Loan History" ? " active" : " ")
                  }
                  onClick={() => navigate(v?.path)}
                  id="personal-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#personal"
                  type="button"
                  role="tab"
                >
                  <img src={v?.img} className="me-2" width={18} />
                  {v?.name}
                </button>
              </li>
            );
          })}
        </ul>
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
                  
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Amount</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Assigned To</th>

                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {showListSkelton
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
                          <td>{i + 1}</td>
                          <td>{v?.code}</td>
                          <td>{v?.loanId?.name}</td>
                          <td>{v?.branchId?.name}</td>
                          
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
            {list?.length == 0 && !showListSkelton && <NoDataScreen />}
            
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

export default UserLoanHistory;
