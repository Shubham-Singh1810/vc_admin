import { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { loanTypeListServ } from "../../services/loan.services";
import {
  loanApplicationDetailsServ,
  updateLoanApplicationServ,
} from "../../services/loanApplication.services";
import { getUserListServ } from "../../services/user.service";
import { getBranchListServ } from "../../services/branch.service";
import { getAdminListServ } from "../../services/commandCenter.services";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import { useGlobalState } from "../../GlobalProvider";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function EditLoanApplication() {
  const { globalState } = useGlobalState();
  const navigate = useNavigate();
  const { id } = useParams(); // loan application id from URL

  const [loanTypeList, setLoanTypeList] = useState([]);
  const [branchList, setBranchList] = useState([]);
  const [userList, setUserList] = useState([]);
  const [adminList, setAdminList] = useState([]);
  const [selectedLoanType, setSelectedLoanType] = useState(null);
  const [selectedUser, setSelectedUser] = useState(null);
  const [submitBtnLoader, setSubmitBtnLoader] = useState(false);
  const [initialValues, setInitialValues] = useState(null);

  // ---------------------- Yup Validation ----------------------
  const validationSchema = Yup.object().shape({
    loanId: Yup.string()
      .trim()
      .required("Loan Type is required"),
    
    branchId: Yup.string()
      .trim()
      .required("Branch is required"),
    
    userId: Yup.string()
      .trim()
      .required("User is required"),
    
    assignedAdminId: Yup.string()
      .trim()
      .nullable(), // Edit mein kabhi kabhi admin assigned nahi hota, isliye nullable safe rehta hai

    loanAmount: Yup.number()
      .typeError("Loan Amount must be a number")
      .required("Loan Amount is required")
      .positive("Loan Amount must be positive"),

    loanTenuare: Yup.number()
      .typeError("Tenure must be a number")
      .required("Tenure is required")
      .positive("Tenure must be positive"),

    loanTenuareType: Yup.string()
      .trim()
      .oneOf(["days", "months", "years"], "Invalid Tenure Type")
      .required("Tenure Type is required"),

    intrestRate: Yup.number()
      .typeError("Interest Rate must be a number")
      .required("Interest Rate is required")
      .min(1, "Interest Rate must be greater than 0"),

    intrestRateType: Yup.string()
      .trim()
      .oneOf(["flat", "reducing", "simple", "compound"], "Invalid Interest Type")
      .required("Interest Type is required"),

    repaymentFrequency: Yup.number()
      .typeError("Repayment Frequency must be a number")
      .required("Repayment Frequency is required")
      .positive("Repayment Frequency must be positive"),

    repaymentFrequencyType: Yup.string()
      .trim()
      .oneOf(["days", "months"], "Invalid Frequency Type")
      .required("Repayment Frequency Type is required"),

    startDate: Yup.date()
      .typeError("Invalid Start Date"),
    
    endDate: Yup.date()
      .typeError("Invalid End Date"),

    panNumber: Yup.string()
      .trim()
      .required("PAN Number is required")
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format"), // Optional: PAN format validation

    creditScore: Yup.string()
      .trim()
      .required("Credit score is required"),
});

  // ---------------------- API calls ----------------------
  const getLoanTypeListFunc = async () => {
    try {
      const response = await loanTypeListServ();
      if (response?.data?.statusCode == "200")
        setLoanTypeList(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getBranchListFunc = async () => {
    try {
      const response = await getBranchListServ();
      if (response?.data?.statusCode == "200")
        setBranchList(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getUserListFunc = async () => {
    try {
      const response = await getUserListServ();
      if (response?.data?.statusCode == "200")
        setUserList(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  const getAdminListFunc = async () => {
    try {
      const response = await getAdminListServ();
      if (response?.data?.statusCode == "200")
        setAdminList(response?.data?.data);
    } catch (error) {
      console.log(error);
    }
  };
  function formatDateToInput(dateStr) {
    if (!dateStr) return "";
    const [day, month, year] = dateStr.split("-");
    return `${year}-${month}-${day}`; // 👈 YYYY-MM-DD
  }
  const getLoanDetails = async () => {
    try {
      const response = await loanApplicationDetailsServ(id);
      if (response?.data?.statusCode == "200") {
        const data = response?.data?.data;

        setInitialValues({
          userId: data.userId?._id || "",
          loanId: data.loanId?._id || "",
          branchId: data.branchId?._id || "",
          assignedAdminId: data.assignedAdminId?._id || "",
          loanAmount: data.loanAmount || "",
          loanTenuare: data.loanTenuare || "",
          loanTenuareType: data.loanTenuareType || "",
          intrestRate: data.intrestRate || "",
          intrestRateType: data.intrestRateType || "",
          repaymentFrequency: data.repaymentFrequency || "",
          repaymentFrequencyType: data.repaymentFrequencyType || "",
          startDate: formatDateToInput(data.startDate),
          endDate: formatDateToInput(data.endDate),
          collateralDetails: data.collateralDetails || [],
          documents:
            data.documents?.map((doc) => ({
              name: doc.name,
              image: null, // old files not re-uploaded, only new files can be added
            })) || [],
          panNumber: data.panNumber || "",
          creditScore: data.creditScore || "",
        });

        // set selected loan type and user
        const loanTypeObj = loanTypeList.find(
          (l) => l._id === data.loanId?._id
        );
        setSelectedLoanType(loanTypeObj || null);
        const userObj = userList.find((u) => u._id === data.userId?._id);
        setSelectedUser(userObj || null);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLoanTypeListFunc();
    getBranchListFunc();
    getUserListFunc();
    getAdminListFunc();
  }, []);

  useEffect(() => {
    if (
      loanTypeList.length > 0 &&
      userList.length > 0 &&
      branchList.length > 0 &&
      adminList.length > 0
    ) {
      getLoanDetails();
    }
  }, [loanTypeList, userList, branchList, adminList]);

  const handleSubmit = async (values) => {
    setSubmitBtnLoader(true);
    try {
      const fd = new FormData();

      Object.keys(values).forEach((key) => {
        if (key !== "documents" && key !== "collateralDetails") {
          fd.append(key, values[key]);
        }
      });
      fd.append("_id", id);

      if (values.collateralDetails?.length > 0) {
        fd.append(
          "collateralDetails",
          JSON.stringify(values.collateralDetails)
        );
      }

      if (values.documents?.length > 0) {
        const docsMeta = values.documents.map((doc) => ({ name: doc.name }));
        fd.append("documentsMeta", JSON.stringify(docsMeta));

        values.documents.forEach((doc) => {
          if (doc.image instanceof File || doc.image instanceof Blob) {
            fd.append("documents", doc.image);
          }
        });
      }

      

      const response = await updateLoanApplicationServ(fd);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigate("/all-applications");
      }
    } catch (error) {
      console.error("Submit Error:", error);
      toast.error("Something went wrong!");
    }
    setSubmitBtnLoader(false);
  };
  if (!initialValues)
    return (
      <div className="container-fluid">
        <div className="col-lg-12 p-4">
          <h5 className="mb-3">Edit Loan Application</h5>

          <div className="form-section shadow-sm mb-3">
            {/* <div className="form-section-header">Main</div> */}
            <div className="form-section-body row g-3">
              {/* Loan Type */}
              {[1, 2, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13, 14, 15]?.map((v, i) => {
                return (
                  <div className="col-md-6">
                    <Skeleton width={200} height={25} />
                    <div className="py-1"></div>
                    <Skeleton height={35} />
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  return (
    <div className="container-fluid">
      <div className="col-lg-12 p-4">
        <h5 className="mb-3">Edit Loan Application</h5>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({ setFieldValue, isSubmitting, values, dirty }) => (
            <Form>
              {/* ---------------- Main Section ---------------- */}
              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Main</div>
                <div className="form-section-body row g-3">
                  {/* Loan Type */}
                  <div className="col-md-6">
                    <label className="form-label">Loan Type</label>
                    <Field
                      as="select"
                      name="loanId"
                      className="form-control"
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedObj = loanTypeList.find(
                          (loan) => loan._id === selectedId
                        );
                        setSelectedLoanType(selectedObj || null);
                        setFieldValue("loanId", selectedId);
                        // reset collateral & documents if loan type changes
                        setFieldValue("collateralDetails", []);
                        setFieldValue("documents", []);
                        // 🔹 Auto fill loan details
                        if (selectedObj) {
                          setFieldValue(
                            "intrestRate",
                            selectedObj.intrestRate || ""
                          );
                          setFieldValue(
                            "intrestRateType",
                            selectedObj.intrestType || ""
                          );
                        } else {
                          setFieldValue("intrestRate", "");
                          setFieldValue("intrestRateType", "");
                        }
                      }}
                    >
                      <option value="">Select</option>
                      {loanTypeList?.map((v, i) => (
                        <option key={i} value={v._id}>
                          {v.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="loanId"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  {/* Branch */}
                  <div className="col-md-6">
                    <label className="form-label">Branch</label>
                    <Field as="select" name="branchId" className="form-control">
                      <option value="">Select</option>
                      {branchList?.map((v, i) => (
                        <option key={i} value={v._id}>
                          {v.name}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="branchId"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  {/* User */}
                  <div className="col-md-6">
                    <label className="form-label">User</label>
                    <Field
                      as="select"
                      name="userId"
                      className="form-control"
                      onChange={(e) => {
                        const selectedId = e.target.value;
                        const selectedObj = userList.find(
                          (user) => user._id === selectedId
                        );
                        setFieldValue("userId", selectedId);
                        setSelectedUser(selectedObj || null);
                        if (selectedObj) {
                          setFieldValue(
                            "panNumber",
                            selectedObj.panNumber || ""
                          );
                          setFieldValue(
                            "creditScore",
                            selectedObj.creditScore || ""
                          );
                        } else {
                          setFieldValue("panNumber", "");
                          setFieldValue("creditScore", "");
                        }
                      }}
                    >
                      <option value="">Select</option>
                      {userList?.map((v, i) => (
                        <option key={i} value={v._id}>
                          {v.firstName + " " + v.lastName}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="userId"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  {/* Assigned Admin */}
                  <div className="col-md-6">
                    <label className="form-label">Assigned To</label>
                    <Field
                      as="select"
                      name="assignedAdminId"
                      className="form-control"
                    >
                      <option value="">Select</option>
                      {adminList?.map((v, i) => (
                        <option key={i} value={v._id}>
                          {v.firstName + " " + v.lastName}
                        </option>
                      ))}
                    </Field>
                    <ErrorMessage
                      name="assignedAdminId"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  {selectedUser && (
                    <>
                      <div className="col-md-6">
                        <label className="form-label">PAN Number</label>
                        <Field
                          className="form-control"
                          type="text"
                          name="panNumber"
                          placeholder="Enter PAN Number"
                        />
                        <ErrorMessage
                          name="panNumber"
                          component="div"
                          className="text-danger small"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">Credit Score</label>
                        <Field
                          className="form-control"
                          type="number"
                          name="creditScore"
                          placeholder="Enter Credit Score"
                        />
                        <ErrorMessage
                          name="creditScore"
                          component="div"
                          className="text-danger small"
                        />
                      </div>
                    </>
                  )}
                </div>
              </div>

              {/* ---------------- Loan Details Section ---------------- */}
              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Loan Details</div>
                <div className="form-section-body row g-3">
                  {/* Loan Amount */}
                  <div className="col-md-7">
                    <label className="form-label">Loan Amount</label>
                    <Field
                      className="form-control"
                      type="number"
                      name="loanAmount"
                      placeholder="Enter loan amount"
                    />
                    <ErrorMessage
                      name="loanAmount"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  {/* Tenure */}
                  <div className="col-md-6">
                    <label className="form-label">Tenure</label>
                    <Field
                      className="form-control"
                      type="number"
                      name="loanTenuare"
                      placeholder="Enter loan tenure"
                    />
                    <ErrorMessage
                      name="loanTenuare"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  {/* Tenure Type */}
                  <div className="col-md-6">
                    <label className="form-label">Tenure Type</label>
                    <Field
                      as="select"
                      name="loanTenuareType"
                      className="form-control"
                    >
                      <option value="">Select</option>
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                      <option value="years">Years</option>
                    </Field>
                    <ErrorMessage
                      name="loanTenuareType"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  {/* Interest Rate */}
                  <div className="col-md-6">
                    <label className="form-label">Interest Rate</label>
                    <Field
                      className="form-control"
                      type="number"
                      name="intrestRate"
                      placeholder="Enter interest rate"
                    />
                    <ErrorMessage
                      name="intrestRate"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  {/* Interest Type */}
                  <div className="col-md-6">
                    <label className="form-label">Interest Type</label>
                    <Field
                      as="select"
                      name="intrestRateType"
                      className="form-control"
                    >
                      <option value="">Select</option>
                      <option value="flat">Flat</option>
                      <option value="reducing">Reducing</option>
                      <option value="simple">Simple</option>
                      <option value="compound">Compound</option>
                    </Field>
                    <ErrorMessage
                      name="intrestRateType"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  {/* Repayment Frequency */}
                  <div className="col-md-6">
                    <label className="form-label">Repayment Frequency</label>
                    <Field
                      className="form-control"
                      type="number"
                      name="repaymentFrequency"
                      placeholder="Enter repayment frequency"
                    />
                    <ErrorMessage
                      name="repaymentFrequency"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  {/* Repayment Frequency Type */}
                  <div className="col-md-6">
                    <label className="form-label">Frequency Type</label>
                    <Field
                      as="select"
                      name="repaymentFrequencyType"
                      className="form-control"
                    >
                      <option value="">Select</option>
                      <option value="days">Days</option>
                      <option value="months">Months</option>
                    </Field>
                    <ErrorMessage
                      name="repaymentFrequencyType"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  {/* Start Date */}
                  <div className="col-md-6">
                    <label className="form-label">Start Date</label>
                    <Field
                      className="form-control"
                      type="date"
                      name="startDate"
                    />
                    <ErrorMessage
                      name="startDate"
                      component="div"
                      className="text-danger small"
                    />
                  </div>

                  {/* End Date */}
                  <div className="col-md-6">
                    <label className="form-label">End Date</label>
                    <Field
                      className="form-control"
                      type="date"
                      name="endDate"
                    />
                    <ErrorMessage
                      name="endDate"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                </div>
              </div>

              {/* ---------------- Collateral Section ---------------- */}
              {selectedLoanType &&
                selectedLoanType?.collateralRequired &&
                selectedLoanType?.collateralTypes?.[0]?.split(",")?.length >
                  0 && (
                  <div className="form-section shadow-sm mb-3">
                    <div className="form-section-header">
                      Collateral Details
                    </div>
                    {(Array.isArray(selectedLoanType.collateralTypes)
                      ? selectedLoanType.collateralTypes[0]?.split(",")
                      : selectedLoanType.collateralTypes.split(",")
                    )?.map((v, i) => (
                      <div className="form-section-body row g-3" key={i}>
                        <div className="col-md-12">
                          <label className="form-label mt-3">
                            {v} Description
                          </label>
                          <textarea
                            className="form-control"
                            placeholder={`Enter ${v} details`}
                            rows={3}
                            value={
                              values.collateralDetails[i]?.description || ""
                            }
                            onChange={(e) => {
                              const newCollaterals = [
                                ...values.collateralDetails,
                              ];
                              newCollaterals[i] = {
                                name: v,
                                description: e.target.value,
                              };
                              setFieldValue(
                                "collateralDetails",
                                newCollaterals
                              );
                            }}
                          />
                          <ErrorMessage
                            name={`collateralDetails[${i}].description`}
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </div>
                    ))}
                  </div>
                )}

              {/* ---------------- Documents Section ---------------- */}
              {selectedLoanType &&
                selectedLoanType?.documentRequired?.length > 0 && (
                  <div className="form-section shadow-sm mb-3">
                    <div className="form-section-header">
                      Required Documents
                    </div>
                    <div className="form-section-body row g-3">
                      {selectedLoanType?.documentRequired?.map((v, i) => (
                        <div className="col-md-6" key={i}>
                          <label className="form-label">Upload {v}</label>
                          <input
                            className="form-control"
                            type="file"
                            onChange={(e) => {
                              const newDocs = [...values.documents];
                              newDocs[i] = {
                                name: v,
                                image: e.target.files[0],
                              };
                              setFieldValue("documents", newDocs);
                            }}
                          />
                          <ErrorMessage
                            name={`documents[${i}].image`}
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              <div className="d-flex justify-content-end">
               
                <button
                  className="btn bgThemePrimary"
                  type="submit"
                  disabled={isSubmitting || !dirty}
                >
                  {isSubmitting ? "Updating..." : "Update User"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default EditLoanApplication;
