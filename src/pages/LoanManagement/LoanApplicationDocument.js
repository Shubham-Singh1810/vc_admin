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
  getEmisListServ,
  deleteLoanApplicationServ,
  loanApplicationDetailsServ,
} from "../../services/loanApplication.services";

function LoanApplicationDocument() {
  const [details, setDetails] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const [showSkelton, setShowSkelton] = useState(false);
  const [formData, setFormData] = useState({
    loanAmount: "",
    loanTenuare: "",
    loanTenuareType: "",
    intrestRate: "",
    intrestRateType: "",
    repaymentFrequency: "",
    repaymentFrequencyType: "",
    startDate: "",
    endDate: "",
  });
  const navItems = [
    {
      name: "Application",
      path: `/loan-application-details/${params?.id}`,
      img: "https://cdn-icons-png.flaticon.com/128/4797/4797927.png",
    },
    {
      name: "Documents",
      path: `/loan-application-documents/${params?.id}`,
      img: "https://cdn-icons-png.flaticon.com/128/2991/2991106.png",
    },
    {
      name: "Account Details",
      path: `/loan-application-account-details/${params?.id}`,
      img: "https://cdn-icons-png.flaticon.com/128/6020/6020484.png",
    },
    {
      name: "Scheduled EMIs",
      path: `/loan-application-emis/${params?.id}`,
      img: "https://cdn-icons-png.flaticon.com/128/15233/15233273.png",
    },
    {
      name: "Transaction History",
      path: `/loan-application-transection-history/${params?.id}`,
      img: "https://cdn-icons-png.flaticon.com/128/879/879890.png",
    },
  ];
  const getLoanDetailsFunc = async () => {
    setShowSkelton(true);
    try {
      let response = await loanApplicationDetailsServ(params?.id);
      if (response?.data?.statusCode == "200") {
        setDetails(response?.data?.data);
        let details = response?.data?.data;
        setFormData({
          loanAmount: details?.loanAmount,
          loanTenuare: details?.loanTenuare,
          loanTenuareType: details?.loanTenuareType,
          intrestRate: details?.intrestRate,
          intrestRateType: details?.intrestRateType,
          repaymentFrequency: details?.repaymentFrequency,
          repaymentFrequencyType: details?.repaymentFrequencyType,
          startDate: details?.startDate,
          endDate: details?.endDate,
        });
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };
  useEffect(() => {
    getLoanDetailsFunc();
  }, [params?.id]);
  const [isEditable, setIsEditable] = useState(false);
  const renderProfile = (status) => {
    if (status=="pending" || !status) {
      return (
        <span className="status-badge bg-warning-subtle text-warning">
          Pending
        </span>
      );
    } 
    if (status=="approved") {
      return (
        <span className="status-badge bg-success-subtle text-success">
          Approved
        </span>
      );
    } 
     if (status=="rejected") {
      return (
        <span className="status-badge bg-danger-subtle text-danger">
          Rejected
        </span>
      );
    } 
  };
  return (
    <div className="container-fluid py-3">
      {/* User Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center">
          <img
            src={
              details?.userId?.profilePic ||
              "https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
            }
            className="img-fluid rounded-circle"
            style={{ width: "50px", height: "50px" }}
            alt="User"
          />
          <div className="ms-3">
            <h5 className="mb-1">{details?.loanId?.name}</h5>
            <h6 className="text-secondary">Application ID: {details?.code}</h6>
          </div>
        </div>
        <div>
          <select className="form-select">
            <option value="">Update Status</option>
            <option value="registered">Registered</option>
            <option value="verified">Verified</option>
            <option value="active">Active</option>
            <option value="blocked">Block</option>
          </select>
        </div>
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
                    (v?.name == "Documents" ? " active" : " ")
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
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table
              id="usersTable"
              className="table table-hover align-middle mb-0"
            >
              <thead className="table-light">
                <tr>
                  <th className="">Sr No.</th>
                  <th>Name</th>
                  <th>Image</th>

                  <th className="text-center">Status</th>

                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {showSkelton
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td className="">
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
                        </tr>
                      );
                    })
                  : details?.documents?.map((v, i) => {
                      return (
                        <tr>
                          <td>{i + 1 }</td>
                          <td>
                            <h6 style={{ fontSize: "14px" }}>{v?.name}</h6>{" "}
                          </td>
                          <td>
                            <div>
                                <img style={{height:"80px", width:"80px", borderRadius:"6px"}} src={v?.image}/>
                            </div>
                          </td>

                          <td className="text-center">
                            {renderProfile(v?.status)}
                          </td>

                         
                          <td style={{ textAlign: "center" }}>
                           <button className="btn bgThemePrimary btn-sm">Update Status</button>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
            {details?.documents?.length == 0 && !showSkelton && <NoDataScreen />}
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoanApplicationDocument;
