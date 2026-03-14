import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../../components/NoDataScreen";
import { toast } from "react-toastify";
import TableNavItems from "../../components/TableNavItems";
import { getPaydayLoanApplicationServ } from "../../services/loanApplication.services";

function PaydayLoanDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const [showSkelton, setShowSkelton] = useState(false);
  const navItems = [
    {
      name: "Application",
      img: "https://cdn-icons-png.flaticon.com/128/4797/4797927.png",
    },
    {
      name: "Documents",
      img: "https://cdn-icons-png.flaticon.com/128/2991/2991106.png",
    },
    {
      name: "Banking Details",
      img: "https://cdn-icons-png.flaticon.com/128/2838/2838851.png",
    },
    {
      name: "Reference",
      img: "https://cdn-icons-png.flaticon.com/128/15233/15233273.png",
    },
    {
      name: "Transaction History",
      img: "https://cdn-icons-png.flaticon.com/128/879/879890.png",
    },
  ];
  const [details, setDetails] = useState(null);
  const getLoanDetailsFunc = async () => {
    setShowSkelton(true);
    try {
      let response = await getPaydayLoanApplicationServ(params?.id);
      if (response?.data?.statusCode == "200") {
        setDetails(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };
  useEffect(() => {
    getLoanDetailsFunc();
  }, [params?.id]);
  const paydaySections = [
    {
      title: "Main Details",
      fields: [
        {
          label: "User",
          name: "userId",
          value: details?.userId?.firstName + " " + details?.userId?.lastName,
        },
        {
          label: "Loan Purpose",
          name: "loanPurposeId",
          value: details?.loanPurposeId?.name,
        },
        {
          label: "Branch",
          name: "branchId",
          value: details?.branchId?.name,
        },
        {
          label: "Assigned Admin",
          name: "assignedAdminId",
          value:
            details?.assignedAdminId?.firstName +
            " " +
            details?.assignedAdminId?.lastName,
        },
        {
          label: "Loan Amount",
          name: "loanAmount",
          value: details?.loanAmount,
        },
        { label: "Tenure (Days)", name: "tenure", value: details?.tenure },
        // { label: "Processing Fee", name: "processingFee", value: details?.processingFee },
        // { label: "Payable Amount", name: "payable", value: details?.payable },
      ],
    },
    {
      title: "Configuration Details",
      fields: [
        {
          label: "Payable Amount",
          name: "payable",
          value: details?.payable,
        },
        {
          label: "Disbursed Amount",
          name: "payable",
          value: details?.disbursedAmount,
        },
        {
          label: "Interest Rate (%)",
          name: "interestRate",
          value: details?.interestRate,
        },
        {
          label: "Interest Amount",
          name: "interestAmount",
          value: details?.interestAmount,
        },
        {
          label: "Processing Fee (%)",
          name: "processingFee",
          value: details?.processingFee,
        },
        {
          label: "Processing Amount",
          name: "processingAmount",
          value: details?.processingAmount,
        },
        {
          label: "GST Applicable",
          name: "isGstApplicable",
          value: details?.isGstApplicable ? "Yes" : "No",
        },
        {
          label: "GST Rate (%)",
          name: "gstRate",
          value: details?.isGstApplicable ? details?.gstRate : "Not Applicable",
        },
        {
          label: "GST Amount",
          name: "gstAmount",
          value: details?.gstAmount,
        },
        {
          label: "Late Fee (%)",
          name: "lateFee",
          value: details?.lateFee,
        },
        {
          label: "Penalty Grace Days",
          name: "penaltyGraceDays",
          value: details?.penaltyGraceDays,
        },
        {
          label: "Prepayment Allowed",
          name: "isPrepaymentAllowed",
          value: details?.isPrepaymentAllowed ? "Yes" : "No",
        },
        {
          label: "Prepayment Fee (%)",
          name: "prepaymentFee",
          value: details?.isPrepaymentAllowed
            ? details?.prepaymentFee
            : "Not Applicable",
        },
      ],
    },
    {
      title: "Basic Eligibility",
      fields: [
        { label: "Full Name", name: "fullName", value: details?.fullName },
        { label: "Email", name: "email", value: details?.email },
        { label: "Date of Birth", name: "dob", value: details?.dob },
        {
          label: "Gender",
          name: "gender",
          value: details?.gender,
        },
        {
          label: "Education Qualification",
          name: "educationQ",
          value: details?.educationQ,
        },
        {
          label: "Marital Status",
          name: "maritalStatus",
          value: details?.maritalStatus,
        },
      ],
    },
    {
      title: "Employment Details",
      fields: [
        {
          label: "Employment Type",
          name: "empType",
          value: details?.empType,
        },
        { label: "Company Name", name: "cmpName", value: details?.cmpName },
        {
          label: "Monthly Income",
          name: "monthlyIncome",
          value: details?.monthlyIncome,
        },
        {
          label: "Next Salary Date",
          name: "nextSalary",
          value: details?.nextSalary,
        },
      ],
    },
    {
      title: "Address Details",
      fields: [
        { label: "Pincode", name: "pincode", value: details?.pincode },
        { label: "Area", name: "area", value: details?.area },
        {
          label: "Current Address",
          name: "currentAddress",
          value: details?.currentAddress,
        },
        {
          label: "Ownership of Current Address",
          name: "currentAddressOwnership",
          value: details?.currentAddressOwnership,
        },
        {
          label: "Who You Live With",
          name: "whoYouliveWith",
          value: details?.whoYouliveWith,
        },
      ],
    },
  ];
  const bankingDetails = [
    {
      title: "Banking Details",
      fields: [
        { label: "Bank Name", name: "bankName", value: details?.bankName },
        {
          label: "Account Holder Name",
          name: "acountHolderName",
          value: details?.acountHolderName,
        },
        {
          label: "Account Number",
          name: "acountNumber",
          value: details?.acountNumber,
        },
        { label: "IFSC Code", name: "ifscCode", value: details?.ifscCode },
      ],
    },
  ];
  const referenceDetails = [
    {
      title: "Reference",
      fields: [
        { label: "Name", name: "referenceName", value: details?.referenceName },
        {
          label: "Relation",
          name: "referenceRelation",
          value: details?.referenceRelation,
        },
        {
          label: "Phone",
          name: "referencePhone",
          value: details?.referencePhone,
        },
      ],
    },
  ];
  const [selectedTab, setSelectedTab] = useState("Application");
  const documents = [
    {
      name: "Aadhar Front",
      img: details?.adharFrontend,
    },
    {
      name: "Aadhar Back",
      img: details?.adharBack,
    },
    {
      name: "PAN",
      img: details?.pan,
    },
    {
      name: "Bank Statement",
      img: details?.bankVerificationMode,
    },
    {
      name: "Residence Proof",
      img: details?.residenceProof,
    },
    {
      name: "E-Sign",
      img: details?.eSign,
    },
  ];
  const renderTabFunc = () => {
    if (selectedTab == "Application") {
      return (
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
                {paydaySections.map((section, idx) => (
                  <div className="form-section shadow-sm mb-4" key={idx}>
                    <div className="form-section-header fw-bold mb-3">
                      {section.title}
                    </div>
                    <div className="form-section-body row g-3">
                      {section.fields.map((f, i) => (
                        <div className="col-md-6" key={i}>
                          <label className="form-label">{f.label}</label>
                          <input
                            className="form-control"
                            readOnly
                            value={f?.value}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (selectedTab == "Documents") {
      return (
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
                <th className="text-center">View</th>
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
                        <td>
                          <Skeleton width={100} />
                        </td>
                      </tr>
                    );
                  })
                : documents?.map((v, i) => {
                    return (
                      <tr>
                        <td>{i + 1}</td>
                        <td>
                          <h6 style={{ fontSize: "14px" }}>{v?.name}</h6>{" "}
                        </td>
                        <td>
                          <div>
                            {v?.name == "Bank Statement" ? (
                              <div
                                style={{
                                  width: "80px",
                                  height: "80px",
                                  overflow: "hidden",
                                  borderRadius: "6px",
                                  border: "1px solid #ddd",
                                }}
                              >
                                <iframe
                                  src={v?.img}
                                  title="PDF Preview"
                                  style={{
                                    width: "100%",
                                    height: "100%",
                                    border: "0",
                                  }}
                                  scrolling="no"
                                />
                              </div>
                            ) : (
                              <img
                                style={{
                                  height: "80px",
                                  width: "80px",
                                  borderRadius: "6px",
                                }}
                                src={v?.img}
                              />
                            )}
                          </div>
                        </td>
                        <td className="text-center">
                          <a
                            href={v?.img}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-primary text-decoration-underline me-2"
                          >
                            <i class="bi bi-eye fs-6"></i>
                          </a>
                        </td>
                      </tr>
                    );
                  })}
            </tbody>
          </table>
        </div>
      );
    } else if (selectedTab == "Banking Details") {
      return (
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
                {bankingDetails.map((section, idx) => (
                  <div className="form-section shadow-sm mb-4" key={idx}>
                    <div className="form-section-header fw-bold mb-3">
                      {section.title}
                    </div>
                    <div className="form-section-body row g-3">
                      {section.fields.map((f, i) => (
                        <div className="col-md-6" key={i}>
                          <label className="form-label">{f.label}</label>
                          <input
                            className="form-control"
                            readOnly
                            value={f?.value}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else if (selectedTab == "Reference") {
      return (
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
                {referenceDetails.map((section, idx) => (
                  <div className="form-section shadow-sm mb-4" key={idx}>
                    <div className="form-section-header fw-bold mb-3">
                      {section.title}
                    </div>
                    <div className="form-section-body row g-3">
                      {section.fields.map((f, i) => (
                        <div className="col-md-6" key={i}>
                          <label className="form-label">{f.label}</label>
                          <input
                            className="form-control"
                            readOnly
                            value={f?.value}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <NoDataScreen />;
    }
  };
  return (
    <div className="container-fluid py-3">
      {/* User Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center">
          <img
            src={
              details?.userId?.profilePic
                ? details?.userId?.profilePic
                : "https://cdn-icons-png.flaticon.com/128/149/149071.png"
            }
            className="img-fluid rounded-circle"
            style={{ width: "50px", height: "50px" }}
            alt="User"
          />
          <div className="ms-3">
            <h5 className="mb-1">Purpose : {details?.loanPurposeId?.name}</h5>
            <h6 className="text-secondary">Application ID: {details?.code}</h6>
          </div>
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
                  onClick={() => setSelectedTab(v?.name)}
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
        renderTabFunc()
      )}
    </div>
  );
}

export default PaydayLoanDetails;
