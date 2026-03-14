import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getLoanPurposeServ } from "../../services/loanPurpose.service";
import {
  getPaydayLoanApplicationServ,
  updatePaydayLoanApplicationServ,
} from "../../services/loanApplication.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { getUserListServ } from "../../services/user.service";
import { getBranchListServ } from "../../services/branch.service";
import { getAdminListServ } from "../../services/commandCenter.services";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalState } from "../../GlobalProvider";
import moment from "moment";

function UpdatePayDayApplication() {
  const { globalState } = useGlobalState();
  const navigate = useNavigate();
  const [loanPurposeList, setLoanPurposeList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [submitBtnLoader, setSubmitBtnLoader] = useState(false);

  const [initialValues, setInitialValues] = useState({
    userId: "",
    loanPurposeId: "",
    branchId: "",
    assignedAdminId: "",
    fullName: "",
    panNumber: "",
    email: "",
    dob: "",
    gender: "",
    educationQ: "",
    maritalStatus: "",
    empType: "",
    cmpName: "",
    monthlyIncome: "",
    monthlyExpense: "",
    nextSalary: "",
    pincode: "",
    area: "",
    currentAddress: "",
    currentAddressOwnership: "",
    whoYouliveWith: "",
    adharFrontend: "",
    adharBack: "",
    pan: "",
    selfie: "",
    bankVerificationMode: "",
    loanAmount: "",
    tenure: "",
    residenceProofType: "",
    residenceProof: "",
    referenceName: "",
    referenceRelation: "",
    referencePhone: "",
    bankName: "",
    acountNumber: "",
    ifscCode: "",
    eSign: "",
  });

  const validationSchema = Yup.object().shape({
    userId: Yup.string().trim().required("User is required"),

    loanPurposeId: Yup.string().trim().required("Loan purpose is required"),

    branchId: Yup.string().trim().required("Branch is required"),

    fullName: Yup.string().trim().required("Full name is required"),

    panNumber: Yup.string()
      .trim()
      .required("PAN Number is required")
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"), // Format check added

    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),

    dob: Yup.string().trim().required("Date of Birth is required"),

    monthlyExpense: Yup.string().trim().required("Monthly expense is required"),

    gender: Yup.string().trim().required("Gender is required"),

    monthlyIncome: Yup.string().trim().required("Monthly Income is required"),

    loanAmount: Yup.string().trim().required("Loan Amount is required"),

    tenure: Yup.string().trim().required("Tenure is required"),
  });

  // ---------------------- API Calls ----------------------
  const params = useParams();
  const [showSkelton, setShowSkelton] = useState(false);
  const [details, setDetails] = useState([]);
  const formatDateForInput = (dateStr) => {
    if (!dateStr || !dateStr.includes("/")) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };
  const getPaydayDetailsFunc = async () => {
    setShowSkelton(true);
    try {
      let response = await getPaydayLoanApplicationServ(params?.id);

      if (response?.data?.statusCode == "200") {
        const data = response?.data?.data;
        setDetails(data);
        setInitialValues({
          userId: data.userId?._id || "",
          loanPurposeId: data.loanPurposeId?._id || "",
          branchId: data.branchId?._id || "",
          assignedAdminId: data.assignedAdminId?._id || "",
          fullName: data.fullName || "",
          panNumber: data.panNumber || "",
          email: data.email || "",
          dob: data.dob ? formatDateForInput(data.dob) : "",
          gender: data.gender || "",
          educationQ: data.educationQ || "",
          maritalStatus: data.maritalStatus || "",
          empType: data.empType || "",
          cmpName: data.cmpName || "",
          monthlyIncome: data.monthlyIncome || "",
          monthlyExpense: data.monthlyExpense || "",
          nextSalary: data.nextSalary
            ? formatDateForInput(data.nextSalary)
            : "",
          pincode: data.pincode || "",
          area: data.area || "",
          currentAddress: data.currentAddress || "",
          currentAddressOwnership: data.currentAddressOwnership || "",
          whoYouliveWith: data.whoYouliveWith || "",

          // FILES will not be pre-filled
          adharFrontend: "",
          adharFrontendPrev: data.adharFrontend || "",

          adharBack: "",
          adharBackPrev: data.adharBack || "",

          pan: "",
          panPrev: data.pan || "",

          selfie: "",
          selfieApprovalStatus: data?.selfieApprovalStatus || "",
          selfiePrev: data.selfie || "",

          bankVerificationMode: "",
          bankVerificationModePrev: data.bankVerificationMode || "",

          residenceProof: "",
          residenceProofPrev: data.residenceProof || "",

          eSign: "",
          eSignPrev: data.eSign || "",

          loanAmount: data.loanAmount || "",
          tenure: data.tenure || "",
          residenceProofType: data.residenceProofType || "",
          referenceName: data.referenceName || "",
          referenceRelation: data.referenceRelation || "",
          referencePhone: data.referencePhone || "",
          bankName: data.bankName || "",
          acountNumber: data.acountNumber || "",
          acountHolderName: data?.acountHolderName || "",
          ifscCode: data.ifscCode || "",
        });
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };

  useEffect(() => {
    getLoanPurposeFunc();
    getBranchListFunc();
    getUserListFunc();
    getAdminListFunc();
    getPaydayDetailsFunc();
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
  const renderPreview = (fileUrl) => {
    if (!fileUrl) return null;

    const isPdf = fileUrl?.toLowerCase().endsWith(".pdf");

    if (isPdf) {
      return (
        <iframe
          src={fileUrl}
          width="100%"
          height="300px"
          className="border rounded mb-2"
          title="PDF Preview"
        />
      );
    }

    return (
      <img
        src={fileUrl}
        alt="preview"
        className="img-thumbnail mb-2"
        style={{ height: "120px" }}
      />
    );
  };

  // ---------------------- Submit ----------------------
  const handleSubmit = async (values) => {
    setSubmitBtnLoader(true);
    try {
      const fd = new FormData();
      Object.keys(values).forEach((key) => {
        fd.append(key, values[key]);
      });
      fd.append("_id", params?.id);

      const response = await updatePaydayLoanApplicationServ(fd);
      if (response?.data?.data) {
        toast.success(response?.data?.message);
        navigate("/payday-loan-applications");
      } else {
        toast.error("Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      toast.error("Failed to create loan application");
    }
    setSubmitBtnLoader(false);
  };

  // ---------------------- UI Structure ----------------------
  const paydaySections = [
    {
      title: "Main Details",
      fields: [
        {
          label: "User",
          name: "userId",
          type: "select",
          options: userList.map((u) => ({
            value: u._id,
            label: u.firstName || u.phone,
          })),
          required: true,
        },
        {
          label: "Loan Purpose",
          name: "loanPurposeId",
          type: "select",
          options: loanPurposeList.map((l) => ({
            value: l._id,
            label: l.name,
          })),
          required: true,
        },
        {
          label: "Branch",
          name: "branchId",
          type: "select",
          options: branchList.map((b) => ({
            value: b._id,
            label: b.name,
          })),
          required: true,
        },
        {
          label: "Assigned Admin",
          name: "assignedAdminId",
          type: "select",
          options: adminList.map((a) => ({
            value: a._id,
            label: a.firstName,
          })),
        },
        {
          label: "Loan Amount",
          name: "loanAmount",
          type: "number",
          required: true,
        },
        {
          label: "Tenure (Days)",
          name: "tenure",
          type: "number",
          required: true,
        },
      ],
    },
    {
      title: "Basic Eligibility",
      fields: [
        { label: "Full Name", name: "fullName", type: "text", required: true },
        {
          label: "PAN Number",
          name: "panNumber",
          type: "text",
          required: true,
        },
        { label: "Email", name: "email", type: "email", required: true },
        { label: "Date of Birth", name: "dob", type: "date", required: true },
        {
          label: "Gender",
          name: "gender",
          type: "select",
          options: [
            { value: "male", label: "Male" },
            { value: "female", label: "Female" },
            { value: "other", label: "Other" },
          ],
          required: true,
        },
        {
          label: "Education Qualification",
          name: "educationQ",
          type: "select",
          options: [
            {
              value: "10th Pass / Matriculation",
              label: "10th Pass / Matriculation",
            },
            {
              value: "12th Pass / Higher Secondary",
              label: "12th Pass / Higher Secondary",
            },
            { value: "Diploma / ITI", label: "Diploma / ITI" },
            {
              value: "Graduate (Bachelor’s Degree)",
              label: "Graduate (Bachelor’s Degree)",
            },
            {
              value: "Post Graduate (Master’s Degree)",
              label: "Post Graduate (Master’s Degree)",
            },
            {
              value: "Professional Degree (CA / CS / MBBS / LLB / etc.)",
              label: "Professional Degree (CA / CS / MBBS / LLB / etc.)",
            },
          ],
        },
        {
          label: "Marital Status",
          name: "maritalStatus",
          type: "select",
          options: [
            { value: "Single", label: "Single" },
            { value: "Married", label: "Married" },
          ],
        },
      ],
    },
    {
      title: "Employment Details",
      fields: [
        {
          label: "Employment Type",
          name: "empType",
          type: "select",
          options: [
            { value: "Private Sector", label: "Private Sector" },
            { value: "Government Sector", label: "Government Sector" },
            { value: "Self-Employed", label: "Self-Employed" },
            {
              value: "Freelancer / Independent Contractor",
              label: "Freelancer / Independent Contractor",
            },
            {
              value: "Daily Wage / Labor Worker",
              label: "Daily Wage / Labor Worker",
            },
          ],
        },
        { label: "Company Name", name: "cmpName", type: "text" },
        {
          label: "Monthly Income",
          name: "monthlyIncome",
          type: "text",
          required: true,
        },
        {
          label: "Monthly Expense",
          name: "monthlyExpense",
          type: "text",
          required: true,
        },
        {
          label: "Next Salary Date",
          name: "nextSalary",
          type: "date",
          required: true,
        },
      ],
    },
    {
      title: "Address Details",
      fields: [
        { label: "Pincode", name: "pincode", type: "number" },
        { label: "Area", name: "area", type: "text" },
        { label: "Current Address", name: "currentAddress", type: "text" },
        {
          label: "Ownership of Current Address",
          name: "currentAddressOwnership",
          type: "select",
          options: [
            { value: "Company Provided", label: "Company Provided" },
            { value: "Owned", label: "Owned" },
            { value: "Rented", label: "Rented" },
            { value: "Other", label: "Other" },
          ],
        },
        {
          label: "Who You Live With",
          name: "whoYouliveWith",
          type: "select",
          options: [
            { value: "Family", label: "Family" },
            { value: "Friends", label: "Friends" },
            { value: "Alone", label: "Alone" },
          ],
        },
      ],
    },
    {
      title: "E-KYC",
      fields: [
        { label: "Upload Aadhar (Front)", name: "adharFrontend", type: "file" },
        { label: "Upload Aadhar (Back)", name: "adharBack", type: "file" },
        { label: "Upload PAN", name: "pan", type: "file" },
      ],
    },
    // {
    //   title: "Selfie",
    //   fields: [
    //     { label: "Selfie", name: "selfie", type: "file" },
    //     {
    //       label: "Approve Selfie",
    //       name: "selfieApprovalStatus",
    //       type: "select",
    //       options: [
    //       {
    //         label:"Approve",
    //         value:"approved"
    //       },
    //       {
    //         label:"Reject",
    //         value:"rejected"
    //       }

    //     ],
    //       required: true,
    //     },
    //   ],
    // },
    {
      title: "Bank Statement",
      fields: [
        {
          label: "Upload bank statement",
          name: "bankVerificationMode",
          type: "file",
        },
      ],
    },
    {
      title: "Residence Proof",
      fields: [
        {
          label: "Proof Type",
          name: "residenceProofType",
          type: "select",
          options: [{ value: "Rent Agreement", label: "Rent Agreement" }],
        },
        {
          label: "Upload Residence Proof",
          name: "residenceProof",
          type: "file",
        },
      ],
    },
    {
      title: "Reference",
      fields: [
        { label: "Name", name: "referenceName", type: "text" },
        { label: "Relation", name: "referenceRelation", type: "text" },
        { label: "Phone", name: "referencePhone", type: "text" },
      ],
    },
    {
      title: "Banking Details",
      fields: [
        { label: "Bank Name", name: "bankName", type: "text" },
        {
          label: "Account Holder Name",
          name: "acountHolderName",
          type: "text",
        },
        { label: "Account Number", name: "acountNumber", type: "text" },
        { label: "IFSC Code", name: "ifscCode", type: "text" },
      ],
    },
    {
      title: "E-Sign",
      fields: [{ label: "Upload E-Sign", name: "eSign", type: "file" }],
    },
  ];
  const [statusUpdateLoader, setStatusUpdateLoader] = useState(false);
  const updateLoanApplicationFunc = async () => {
    setStatusUpdateLoader(true);
    try {
      const filteredPayload = Object.keys(formData).reduce((acc, key) => {
        const value = formData[key];
        if (value !== "" && value !== null && value !== undefined) {
          acc[key] = value;
        }
        return acc;
      }, {});
      if (params?.id) {
        filteredPayload._id = params.id;
      }
      let response = await updatePaydayLoanApplicationServ(filteredPayload);

      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getPaydayDetailsFunc();
        setFormData({
          _id: params?.id,
          rejectReason: "",
          status: "",
          branchId: "",
          assignedAdminId: "",
          dueDate: "",
          disbursedDate: "",
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Update failed");
    }
    setStatusUpdateLoader(false);
  };
  const updateSelfieStatusFunc = async (formData) => {
    setStatusUpdateLoader(true);
    let finalFormData = formData;
    if (formData?.selfieApprovalStatus == "rejected") {
      finalFormData = { ...formData, processingStatus: "selfie" };
    }
    try {
      let response = await updatePaydayLoanApplicationServ(finalFormData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getPaydayDetailsFunc();
        setFormData({
          _id: params?.id,
          rejectReason: "",
          status: "",
          dueDate: "",
          disbursedDate: "",
        });
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
    setStatusUpdateLoader(false);
  };

  const renderStatusOption = (status) => {
    if (status == "pending") {
      return [
        { label: "Approve", value: "approved" },
        { label: "Reject", value: "rejected" },
        { label: "Close", value: "closed" },
      ];
    } else if (status == "approved") {
      return [
        { label: "Reject", value: "rejected" },
        { label: "Disburse", value: "disbursed" },
        { label: "Close", value: "closed" },
      ];
    } else if (status == "rejected") {
      return [
        { label: "Approve", value: "approved" },
        { label: "Close", value: "closed" },
      ];
    } else if (status == "completed") {
      return [];
    } else if (status == "disbursed") {
      return [{ label: "Complete", value: "completed" }];
    } else if (status == "overDue") {
      return [
        { label: "Complete", value: "completed" },
        { label: "Disburse", value: "disbursed" },
      ];
    } else if (status == "closed") {
      return [
        { label: "New Request", value: "pending" },
        { label: "Reject", value: "rejected" },
        { label: "Approve", value: "approved" },
      ];
    }
  };
  const renderProfile = (status) => {
    if (status == "pending") {
      return (
        <div className="d-flex align-items-center ">
          <p className="mb-0 me-4 text-secondary">
            Processing Status : {details?.processingStatus}
          </p>
          <span className="status-badge bg-primary-subtle text-primary">
            New Request
          </span>
        </div>
      );
    }
    if (status == "closed") {
      return (
        <div
          className="d-flex align-items-center "
          style={{ marginBottom: "-40px" }}
        >
          <p className="mb-0 me-2 text-secondary">Application is</p>
          <span className="status-badge bg-secondary-subtle text-secondary">
            Closed
          </span>
        </div>
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
        <div className="d-flex align-items-center ">
          <p className="mb-0 me-4 text-secondary">
            Reject Reason : {details?.rejectReason}
          </p>
          <span className="status-badge bg-danger-subtle text-danger">
            Rejected
          </span>
        </div>
      );
    }
    if (status == "disbursed") {
      return (
        <div className="d-flex align-items-center ">
          <p className="mb-0 me-4 text-secondary">
            Disburse Date: {moment(details.disbursedDate).format("DD-MM-YYYY")}{" "}
            || Due Date : {moment(details.dueDate).format("DD-MM-YYYY")}
          </p>
          <span className="status-badge bg-info-subtle text-info">
            Disbursed
          </span>
        </div>
      );
    }
    if (status == "overDue") {
      return (
        <div className="d-flex align-items-center ">
          <p className="mb-0 me-4 text-secondary">
            Disburse Date: {moment(details.disbursedDate).format("DD-MM-YYYY")}{" "}
            || Due Date : {moment(details.dueDate).format("DD-MM-YYYY")}
          </p>
          <span className="status-badge bg-danger-subtle text-danger">
            Over Due
          </span>
        </div>
      );
    }
    if (status == "completed") {
      return (
        <div
          className="d-flex align-items-center "
          style={{ marginBottom: "-40px" }}
        >
          <p className="mb-0 me-2 text-secondary">Application is</p>
          <span className="status-badge bg-success-subtle text-success">
            Completed
          </span>
        </div>
      );
    }
  };
  const [formData, setFormData] = useState({
    _id: params?.id,
    rejectReason: "",
    status: "",
    branchId: "",
    assignedAdminId: "",
    dueDate: "",
    disbursedDate: "",
  });

  const handleBranchChange = (e) => {
    const branchId = e.target.value;
    const currentAdmin = adminList?.find(
      (a) => a._id === formData.assignedAdminId,
    );
    const isAdminInNewBranch = currentAdmin?.branch?.some(
      (b) => b._id === branchId,
    );

    setFormData({
      ...formData,
      branchId: branchId,
      assignedAdminId: isAdminInNewBranch ? formData.assignedAdminId : "",
    });
  };

  const handleAdminChange = (e) => {
    const adminId = e.target.value;
    const admin = adminList?.find((a) => a._id === adminId);
    let autoBranchId = formData.branchId;
    if (admin?.branch?.length === 1) {
      autoBranchId = admin.branch[0]._id;
    } else if (admin?.branch?.length > 1) {
      const hasCurrentBranch = admin.branch.some(
        (b) => b._id === formData.branchId,
      );
      if (!hasCurrentBranch) autoBranchId = "";
    }

    setFormData({
      ...formData,
      assignedAdminId: adminId,
      branchId: autoBranchId,
    });
  };
  const filteredAdmins = formData?.branchId
    ? adminList?.filter((admin) =>
        admin.branch?.some((b) => b._id === formData.branchId),
      )
    : adminList;
  const selectedAdminObj = adminList?.find(
    (a) => a._id === formData?.assignedAdminId,
  );
  const filteredBranches =
    formData?.assignedAdminId && selectedAdminObj?.branch?.length > 0
      ? selectedAdminObj.branch
      : branchList;

  useEffect(() => {
    if (formData?.status === "disbursed" && details?.tenure) {
      const today = moment().startOf("day");
      const calculatedDueDate = moment(today).add(
        parseInt(details.tenure),
        "days",
      );
      setFormData({
        ...formData,
        disbursedDate: today.format("YYYY-MM-DD"),
        dueDate: calculatedDueDate.format("YYYY-MM-DD"),
      });
    }
  }, [formData?.status, details?.tenure]);

  return (
    <div className="container-fluid p-4">
      <div className="d-flex justify-content-end mb-2">
        {renderProfile(details?.status)}
      </div>
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h5>Update Payday Loan Application</h5>
        {!(details?.status == "completed" || details?.status == "closed") && (
          <div className="d-flex align-items-center">
            <lebel style={{ width: "200px" }}>
              <b>Update Status: </b>
            </lebel>
            <select
              className="form-control"
              value={formData?.status}
              onChange={(e) =>
                setFormData({ ...formData, status: e?.target?.value })
              }
            >
              <option value="">Select</option>
              {renderStatusOption(details?.status)?.map((v, i) => {
                return <option value={v?.value}>{v?.label}</option>;
              })}
            </select>
          </div>
        )}
      </div>
      {showSkelton ? (
        <div className="row border bg-light px-2 py-4  rounded">
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15]?.map((v, i) => {
            return (
              <div className="col-6 mb-3">
                <Skeleton width={150} height={20} />
                <div className="mt-1"></div>
                <Skeleton width="100%" height={35} />
              </div>
            );
          })}
        </div>
      ) : (
        <Formik
          enableReinitialize={true}
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, values }) => (
            <Form>
              {paydaySections.map((section, idx) => (
                <div className="form-section shadow-sm mb-4" key={idx}>
                  <div className="form-section-header fw-bold mb-3">
                    {section.title}
                  </div>
                  <div className="form-section-body row g-3">
                    {section.fields.map((f, i) => (
                      <div className="col-md-6" key={i}>
                        <label className="form-label">
                          {" "}
                          {f.label}{" "}
                          {f.required && <span className="text-danger">*</span>}
                        </label>

                        {/* ------- SELECT ------ */}
                        {f.type === "select" ? (
                          <Field
                            as="select"
                            name={f.name}
                            className="form-control"
                          >
                            <option value="">Select</option>
                            {f.options?.map((opt, j) => (
                              <option key={j} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </Field>
                        ) : f.type === "file" ? (
                          <>
                            <div>{renderPreview(values[f.name + "Prev"])}</div>
                            <input
                              type="file"
                              className="form-control"
                              onChange={(e) => {
                                setFieldValue(f.name, e.target.files[0]);
                                setFieldValue(
                                  f.name + "Prev",
                                  URL.createObjectURL(e.target.files[0]),
                                );
                              }}
                            />

                            {/* ----------- Preview ---------- */}
                          </>
                        ) : (
                          <Field
                            type={f.type}
                            name={f.name}
                            className="form-control"
                          />
                        )}

                        <ErrorMessage
                          name={f.name}
                          component="div"
                          className="text-danger mt-1"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              {details?.selfie && (
                <div className="form-section shadow-sm mb-4">
                  <div className="form-section-header fw-bold mb-3">Selfie</div>
                  <div className="form-section-body row g-3">
                    <div>
                      {values?.selfiePrev && (
                        <img
                          src={values?.selfiePrev}
                          alt="preview"
                          className="img-thumbnail mb-2"
                          style={{ height: "120px" }}
                        />
                      )}
                    </div>
                    {details?.status == "pending" && (
                      <>
                        {" "}
                        <label>Update Selfie Status</label>
                        <select
                          className="form-control mt-1"
                          value={values?.selfieApprovalStatus}
                          onChange={(e) => {
                            const newStatus = e.target.value;

                            // Khali value check (trim karke)
                            if (newStatus && newStatus.trim() !== "") {
                              updateSelfieStatusFunc({
                                _id: params?.id,
                                selfieApprovalStatus: newStatus,
                              });
                            }
                          }}
                        >
                          <option value="">Select</option>
                          <option value="approved">Approved</option>
                          <option value="rejected">Rejected</option>
                        </select>
                      </>
                    )}
                  </div>
                </div>
              )}
              {(details?.status == "pending" ||
                details?.status == "approved" ||
                details?.status == "rejected") && (
                <button
                  type="submit"
                  className="btn bgThemePrimary w-100"
                  disabled={submitBtnLoader}
                >
                  {submitBtnLoader ? "Submitting..." : "Submit"}
                </button>
              )}
            </Form>
          )}
        </Formik>
      )}
      {formData?.status == "rejected" && (
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
                          setFormData({
                            _id: "",
                            rejectReason: "",
                            status: "",
                            branchId: "",
                            assignedAdminId: "",
                            dueDate: "",
                            disbursedDate: "",
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
                            setFormData({
                              ...formData,
                              rejectReason: e?.target?.value,
                            })
                          }
                        />
                      </div>

                      <div className="d-flex justify-content-end">
                        {formData?.rejectReason ? (
                          statusUpdateLoader ? (
                            <button
                              className="btn bgThemePrimary w-100 mt-2"
                              style={{ opacity: "0.5" }}
                            >
                              Confirm...
                            </button>
                          ) : (
                            <button
                              className="btn bgThemePrimary w-100 mt-2"
                              onClick={() => updateLoanApplicationFunc()}
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
      {formData?.status == "rejected" && (
        <div className="modal-backdrop fade show"></div>
      )}
      {formData?.status == "closed" && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ width: "350px" }}
          >
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title">Close Application</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      status: "",
                      assignedAdminId: "",
                      branchId: "",
                      dueDate: "",
                      disbursedDate: "",
                    })
                  }
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body">
                <p className="mb-0">
                  Do you really want to close this application
                </p>
                <p className="text-muted mb-0">
                  This action will not allow the user to procced further.
                </p>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      status: "",
                      assignedAdminId: "",
                      branchId: "",
                      dueDate: "",
                      disbursedDate: "",
                    });
                  }}
                >
                  NO
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={() => updateLoanApplicationFunc()}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {formData?.status == "closed" && (
        <div className="modal-backdrop fade show"></div>
      )}
      {formData?.status == "approved" && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ width: "350px" }}
          >
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title">Approve Application</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      status: "",
                      assignedAdminId: "",
                      branchId: "",
                      dueDate: "",
                      disbursedDate: "",
                    })
                  }
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body">
                {details?.processingStatus == "eSign" ? (
                  details?.branchId && details?.assignedAdminId ? (
                    <>
                      <p className="mb-0">
                        Do you really want to approve this application
                      </p>
                      <p className="text-muted mb-0">
                        Have you seen all the details properly ?
                      </p>
                    </>
                  ) : (
                    <>
                      <div>
                        <label>Branch</label>
                        <select
                          value={formData?.branchId}
                          className="form-control"
                          onChange={handleBranchChange}
                        >
                          <option value="">Select</option>
                          {filteredBranches?.map((v) => (
                            <option key={v._id} value={v._id}>
                              {v.name}
                            </option>
                          ))}
                        </select>
                      </div>
                      <div className="mt-3">
                        <label>Assign Staff</label>
                        <select
                          value={formData?.assignedAdminId}
                          className="form-control"
                          onChange={handleAdminChange}
                        >
                          <option value="">Select</option>
                          {filteredAdmins?.map((v) => (
                            <option key={v._id} value={v._id}>
                              {v.firstName} {v.lastName} ({v.code})
                            </option>
                          ))}
                        </select>
                      </div>
                    </>
                  )
                ) : (
                  <>
                    <p className="mb-0">Application is still in progress !</p>
                  </>
                )}
              </div>

              {/* Footer */}
              {details?.processingStatus == "eSign" ? (
                details?.branchId && details?.assignedAdminId ? (
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          status: "",
                          assignedAdminId: "",
                          branchId: "",
                          dueDate: "",
                          disbursedDate: "",
                        });
                      }}
                    >
                      NO
                    </button>
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => updateLoanApplicationFunc()}
                    >
                      Yes
                    </button>
                  </div>
                ) : formData?.branchId && formData?.assignedAdminId ? (
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-success"
                      onClick={() => updateLoanApplicationFunc()}
                    >
                      Submit
                    </button>
                  </div>
                ) : (
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-success"
                      style={{ opacity: 0.5 }}
                    >
                      Submit
                    </button>
                  </div>
                )
              ) : (
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setFormData({
                        ...formData,
                        status: "",
                        branchId: "",
                        assignedAdminId: "",
                        dueDate: "",
                        disbursedDate: "",
                      });
                    }}
                  >
                    Close
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
      {formData?.status == "approved" && (
        <div className="modal-backdrop fade show"></div>
      )}
      {formData?.status == "completed" && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ width: "350px" }}
          >
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title">Complete Application</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      status: "",
                      branchId: "",
                      assignedAdminId: "",
                      dueDate: "",
                      disbursedDate: "",
                    })
                  }
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body">
                <p className="mb-0">
                  Do you really want to mark this application as completed ?
                </p>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      status: "",
                      assignedAdminId: "",
                      branchId: "",
                      dueDate: "",
                      disbursedDate: "",
                    });
                  }}
                >
                  NO
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => updateLoanApplicationFunc()}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {formData?.status == "completed" && (
        <div className="modal-backdrop fade show"></div>
      )}
      {formData?.status == "disbursed" && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ width: "350px" }}
          >
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title">Disburse Loan</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      status: "",
                      assignedAdminId: "",
                      branchId: "",
                      dueDate: "",
                      disbursedDate: "",
                    })
                  }
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body">
                <b>Disburse Amount : {details?.disbursedAmount} INR</b>
                <div className="mt-3">
                  <label>Disburse Date</label>
                  <input
                    className="form-control"
                    value={
                      formData?.disbursedDate
                        ? moment(formData.disbursedDate).format("DD-MM-YYYY")
                        : ""
                    }
                    readOnly
                  />
                </div>
                <div className="mt-3">
                  <label>Due Date</label>
                  <input
                    className="form-control"
                    readOnly
                    value={
                      formData?.dueDate
                        ? moment(formData.dueDate).format("DD-MM-YYYY")
                        : ""
                    }
                  />
                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-success w-100"
                  onClick={() => updateLoanApplicationFunc()}
                >
                  Procced To Pay
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {formData?.status == "disbursed" && (
        <div className="modal-backdrop fade show"></div>
      )}
      {formData?.status == "pending" && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div
            className="modal-dialog modal-dialog-centered"
            style={{ width: "350px" }}
          >
            <div className="modal-content">
              {/* Header */}
              <div className="modal-header">
                <h5 className="modal-title">New Application</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() =>
                    setFormData({
                      ...formData,
                      status: "",
                      branchId: "",
                      assignedAdminId: "",
                      dueDate: "",
                      disbursedDate: "",
                    })
                  }
                ></button>
              </div>

              {/* Body */}
              <div className="modal-body">
                <p className="mb-0">
                  Do you really want to mark this application as New Request ?
                </p>
              </div>

              {/* Footer */}
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => {
                    setFormData({
                      ...formData,
                      status: "",
                      assignedAdminId: "",
                      branchId: "",
                      dueDate: "",
                      disbursedDate: "",
                    });
                  }}
                >
                  NO
                </button>
                <button
                  type="button"
                  className="btn btn-success"
                  onClick={() => updateLoanApplicationFunc()}
                >
                  Yes
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
      {formData?.status == "pending" && (
        <div className="modal-backdrop fade show"></div>
      )}
    </div>
  );
}

export default UpdatePayDayApplication;
