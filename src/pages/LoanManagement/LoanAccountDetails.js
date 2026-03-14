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

function LoanAccountDetails() {
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
                    (v?.name == "Account Details" ? " active" : " ")
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
                <div className="col-md-6">
                  <label className="form-label">Account Holder Name</label>
                  <input
                    type="text"
                    className="form-control"
                    readOnly={!isEditable}
                    value={formData?.accountHolderName}
                    style={{ background: !isEditable ? "whitesmoke" : "white" }}
                    onChange={(e) =>
                      setFormData({ ...formData, accountHolderName: e?.target?.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Account Number</label>
                  <input
                    type="text"
                    className="form-control"
                    readOnly={!isEditable}
                    value={formData?.accountNumber}
                    style={{ background: !isEditable ? "whitesmoke" : "white" }}
                    onChange={(e) =>
                      setFormData({ ...formData, accountNumber: e?.target?.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">IFSC</label>
                  <input
                    type="text"
                    className="form-control"
                    readOnly={!isEditable}
                    value={formData?.ifsc}
                    style={{ background: !isEditable ? "whitesmoke" : "white" }}
                    onChange={(e) =>
                      setFormData({ ...formData, ifsc: e?.target?.value })
                    }
                  />
                </div>
                <div className="col-md-6">
                  <label className="form-label">Bank Name</label>
                  <input
                    type="text"
                    className="form-control"
                    readOnly={!isEditable}
                    value={formData?.bankName}
                    style={{ background: !isEditable ? "whitesmoke" : "white" }}
                    onChange={(e) =>
                      setFormData({ ...formData, bankName: e?.target?.value })
                    }
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

export default LoanAccountDetails;
