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

function LoanApplicationDetails() {
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
                    (v?.name == "Application" ? " active" : " ")
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
      {showSkelton ? (
        <div className="tab-content user-detail-page bg-light">
          {/* Personal Tab */}
          <div
            className="tab-pane fade show active"
            id="personal"
            role="tabpanel"
            aria-labelledby="personal-tab"
          >
            <div className="card  border-0 p-2 mb-4 bg-white">
              <div className="row g-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]?.map(
                  (v, i) => {
                    return (
                      <div className="col-md-6">
                        <Skeleton height={20} width={100} />
                        <div className="my-1">
                          <Skeleton height={30} />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        <div className="tab-content user-detail-page bg-light">
          {/* Personal Tab */}
          <div
            className="tab-pane fade show active"
            id="personal"
            role="tabpanel"
            aria-labelledby="personal-tab"
          >
            <div className="card  border-0 p-2 mb-4 bg-white">
              <div className="row g-3">
                <div className="col-md-7">
                  <label className="form-label">Loan Amount</label>
                  <input
                    type="text"
                    className="form-control"
                    readOnly={!isEditable}
                    value={formData?.loanAmount}
                    style={{ background: !isEditable ? "whitesmoke" : "white" }}
                    onChange={(e) =>
                      setFormData({ ...formData, loanAmount: e?.target?.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Tenure</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData?.loanTenuare}
                    readOnly={!isEditable}
                    style={{ background: !isEditable ? "whitesmoke" : "white" }}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        loanTenuare: e?.target?.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Tenure Type</label>
                  
                    <select
                      className="form-control"
                      value={formData?.loanTenuareType}
                      readOnly={!isEditable}
                      style={{
                        background: !isEditable ? "whitesmoke" : "white",
                      }}
                    >
                      {" "}
                      <option value="">Select</option>
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </select>
                  
                </div>
                <div className="col-md-6">
                  <label className="form-label">Interest Rate</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData?.intrestRate}
                    readOnly={!isEditable}
                    style={{ background: !isEditable ? "whitesmoke" : "white" }}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        intrestRate: e?.target?.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Interest Type</label>
                   <select
                      className="form-control"
                      value={formData?.intrestRateType}
                      readOnly={!isEditable}
                      style={{
                        background: !isEditable ? "whitesmoke" : "white",
                      }}
                    >
                      {" "}
                      <option value="">Select</option>
                      <option value="flat">Flat</option>
                      <option value="reducing">Reducing</option>
                      <option value="simple">Simple</option>
                      <option value="compound">Compound</option>
                    </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Repayment Frequency</label>
                  <input
                    type="text"
                    className="form-control"
                    value={formData?.repaymentFrequency}
                    readOnly={!isEditable}
                    style={{ background: !isEditable ? "whitesmoke" : "white" }}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        repaymentFrequency: e?.target?.value,
                      })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Freequency Type</label>
                  <select
                      className="form-control"
                      value={formData?.repaymentFrequencyType}
                      readOnly={!isEditable}
                      style={{
                        background: !isEditable ? "whitesmoke" : "white",
                      }}
                    >
                      <option value="">Select</option>
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                    </select>
                </div>
                <div className="col-md-6">
                  <label className="form-label">Start Date</label>
                  {!isEditable ?  <input
                    type="text"
                    className="form-control"
                    value={formData?.startDate}
                    readOnly={!isEditable}
                    style={{ background: !isEditable ? "whitesmoke" : "white" }}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e?.target?.value })
                    }
                  />: <input
                    type="date"
                    className="form-control"
                    value={formData?.startDate}
                    readOnly={!isEditable}
                    style={{ background: !isEditable ? "whitesmoke" : "white" }}
                    onChange={(e) =>
                      setFormData({ ...formData, startDate: e?.target?.value })
                    }
                  />}
                 
                </div>
                <div className="col-md-6">
                  <label className="form-label">End Date</label>
                   {!isEditable ?  <input
                    type="text"
                    className="form-control"
                    value={formData?.endDate}
                    readOnly={!isEditable}
                    style={{ background: !isEditable ? "whitesmoke" : "white" }}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e?.target?.value })
                    }
                  />: <input
                    type="date"
                    className="form-control"
                    value={formData?.endDate}
                    readOnly={!isEditable}
                    style={{ background: !isEditable ? "whitesmoke" : "white" }}
                    onChange={(e) =>
                      setFormData({ ...formData, endDate: e?.target?.value })
                    }
                  />}
                </div>
                <div
                  style={{ width: "100%", border: "1px solid whitesmoke" }}
                ></div>
                <p className="text-secondary">User Details</p>
                <div className="col-md-6">
                  <label className="form-label">First Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={details?.userId?.firstName}
                    readOnly={true}
                    style={{ background: "whitesmoke" }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Last Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={details?.userId?.lastName}
                    readOnly={true}
                    style={{ background: "whitesmoke" }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Email</label>
                  <input
                    type="text"
                    className="form-control"
                    value={details?.userId?.email}
                    readOnly={true}
                    style={{ background: "whitesmoke" }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Phone</label>
                  <input
                    type="text"
                    className="form-control"
                    value={details?.userId?.phone}
                    readOnly={true}
                    style={{ background: "whitesmoke" }}
                  />
                </div>
                <div
                  style={{ width: "100%", border: "1px solid whitesmoke" }}
                ></div>
                <p className="text-secondary">Branch Details</p>
                <div className="col-md-6">
                  <label className="form-label">Name</label>
                  <input
                    type="text"
                    className="form-control"
                    value={details?.branchId?.name}
                    readOnly={true}
                    style={{ background: "whitesmoke" }}
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Contact Person</label>
                  <input
                    type="text"
                    className="form-control"
                    value={details?.branchId?.contactPerson}
                    readOnly={true}
                    style={{ background: "whitesmoke" }}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">State</label>
                  <input
                    type="text"
                    className="form-control"
                    value={details?.branchId?.state}
                    readOnly={true}
                    style={{ background: "whitesmoke" }}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">City</label>
                  <input
                    type="text"
                    className="form-control"
                    value={details?.branchId?.city}
                    readOnly={true}
                    style={{ background: "whitesmoke" }}
                  />
                </div>
                <div className="col-md-4">
                  <label className="form-label">Pincode</label>
                  <input
                    type="text"
                    className="form-control"
                    value={details?.branchId?.pincode}
                    readOnly={true}
                    style={{ background: "whitesmoke" }}
                  />
                </div>
                <div className="col-md-12">
                  <label className="form-label">Address</label>
                  <input
                    type="text"
                    className="form-control"
                    value={details?.branchId?.address}
                    readOnly={true}
                    style={{ background: "whitesmoke" }}
                  />
                </div>

                <div className="d-flex justify-content-end">
                  <div
                    className="btn btn-secondary mx-2"
                    onClick={() => {
                      setIsEditable(!isEditable);
                      isEditable
                        ? toast.info("Fields are set to be readonly")
                        : toast.info("You can now start editing the fields");
                    }}
                  >
                    Enable Editing
                  </div>
                  <div
                    className="btn bgThemePrimary"
                    onClick={() => toast.info("Work in progress")}
                  >
                    Submit
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LoanApplicationDetails;
