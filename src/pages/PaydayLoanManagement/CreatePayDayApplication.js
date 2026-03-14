import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { getLoanPurposeServ } from "../../services/loanPurpose.service";
import { createPaydayLoanApplicationServ } from "../../services/loanApplication.services";
import { getUserListServ } from "../../services/user.service";
import { getBranchListServ } from "../../services/branch.service";
import { getAdminListServ } from "../../services/commandCenter.services";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { useGlobalState } from "../../GlobalProvider";

function CreatePayDayApplication() {
  const { globalState } = useGlobalState();
  const navigate = useNavigate();

  const [loanPurposeList, setLoanPurposeList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [submitBtnLoader, setSubmitBtnLoader] = useState(false);

  const initialValues = {
    userId: "",
    loanPurposeId: "",
    branchId: "",
    assignedAdminId: "",
    fullName: "",
    email: "",
    dob: "",
    gender: "",
    educationQ: "",
    maritalStatus: "",
    empType: "",
    cmpName: "",
    monthlyIncome: "",
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
  };

  const validationSchema = Yup.object().shape({
    userId: Yup.string()
      .trim()
      .required("User is required"),
      
    loanPurposeId: Yup.string()
      .trim()
      .required("Loan purpose is required"),
      
    branchId: Yup.string()
      .trim()
      .required("Branch is required"),
      
    fullName: Yup.string()
      .trim()
      .required("Full name is required"),
      
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
      
    dob: Yup.string()
      .trim()
      .required("Date of Birth is required"),
      
    gender: Yup.string()
      .trim()
      .required("Gender is required"),
      
    // Agar monthlyIncome number honi chahiye toh .number() use karein, 
    // filhaal string ke hisaab se trim fix hai:
    monthlyIncome: Yup.string()
      .trim()
      .required("Monthly Income is required"),
      
    loanAmount: Yup.string()
      .trim()
      .required("Loan Amount is required"),
      
    tenure: Yup.string()
      .trim()
      .required("Tenure is required"),
  });

  // ---------------------- API Calls ----------------------
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

  // ---------------------- Submit ----------------------
  const handleSubmit = async (values) => {
    setSubmitBtnLoader(true);
    try {
      const fd = new FormData();
      Object.keys(values).forEach((key) => {
        fd.append(key, values[key]);
      });
      fd.append("createdBy", globalState?.user?._id);

      const response = await createPaydayLoanApplicationServ(
        fd
      );
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
          label: `User`,
          name: "userId",
          type: "select",
          required: true,
          options: userList.map((u) => ({
            value: u._id,
            label: u.firstName || u.phone,
          })),
        },
        {
          label: "Loan Purpose",
          name: "loanPurposeId",
          type: "select",
          options: loanPurposeList.map((l) => ({
            value: l._id,
            label: l.name,
          })),
          required: true
        },
        {
          label: "Branch",
          name: "branchId",
          type: "select",
          options: branchList.map((b) => ({
            value: b._id,
            label: b.name,
          })),
          required: true
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
        { label: "Loan Amount", name: "loanAmount", type: "number", required: true },
        { label: "Tenure (Days)", name: "tenure", type: "number", required: true },
      ],
    },
    {
      title: "Basic Eligibility",
      fields: [
        { label: "Full Name", name: "fullName", type: "text", required: true },
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
          required: true
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
        { label: "Monthly Income", name: "monthlyIncome", type: "text", required: true },
        { label: "Next Salary Date", name: "nextSalary", type: "date" },
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
          options: [{ value: "Rent Aggrement", label: "Rent Aggrement" }],
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

  return (
    <div className="container-fluid p-4">
      <h5 className="mb-3">Create Payday Loan Application</h5>

       <Formik initialValues={initialValues} validationSchema={validationSchema} onSubmit={handleSubmit}>
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
                      <label className="form-label"> {f.label} {f.required && <span className="text-danger">*</span>}</label>

                      {/* ------- SELECT ------ */}
                      {f.type === "select" ? (
                        <Field as="select" name={f.name} className="form-control">
                          <option value="">Select</option>
                          {f.options?.map((opt, j) => (
                            <option key={j} value={opt.value}>
                              {opt.label}
                            </option>
                          ))}
                        </Field>
                      ) : f.type === "file" ? (
                        <>
                        <div>
                           {values[f.name + "Prev"] && (
                            <img
                              src={values[f.name + "Prev"]}
                              alt="preview"
                              className="img-thumbnail mb-2"
                              style={{ height: "120px" }}
                            />
                          )}
                        </div>
                          <input
                            type="file"
                            className="form-control"
                            onChange={(e) => {
                              setFieldValue(f.name, e.target.files[0]);
                              setFieldValue(
                                f.name + "Prev",
                                URL.createObjectURL(e.target.files[0])
                              );
                            }}
                          />

                          {/* ----------- Preview ---------- */}
                         
                        </>
                      ) : (
                        <Field type={f.type} name={f.name} className="form-control" />
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

            <button type="submit" className="btn bgThemePrimary w-100" disabled={submitBtnLoader}>
              {submitBtnLoader ? "Submitting..." : "Submit"}
            </button>
          </Form>
        )}
      </Formik>
    </div>
  );
}

export default CreatePayDayApplication;
