import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  updateLoanTypeServ,
  loanTypeDetailsServ,
} from "../../services/loan.services";
import {
  getPaydayLoanDetailsServ,
  updatePaydayLoanServ,
} from "../../services/paydayLoan.services";

import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { MultiSelect } from "react-multi-select-component";
import { getDocumentSetServ } from "../../services/document.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

function UpdateLoanRequirement() {
  const navigate = useNavigate();
  const [initialValues, setInitialValues] = useState({
    // basic fields
    name: "",
    code: "",
    description: "",
    status: "",
    icon: "",

    // financial fields
    minAmount: "",
    maxAmount: "",
    minTenure: "",
    maxTenure: "",
    intrestRate: "",
    processingFee: "",
    gstApplicable: "",
    gst: "",
    lateFee: "",
    penaltyGraceDays: "",
    prepaymentAllowed: "",
    prepaymentFee: "",

    // eligibility fields
    minIncome: "",
    maxEmiRatio: "",
    incomeToLoanPercentage: "",
    creditScoreRequired: "",
    minAge: "",
    maxAge: "",
    employmentTypesAllowed: [],
    documentRequired: [],
  });
  const getLoanSchema = () =>
    Yup.object().shape({
      name: Yup.string()
        .trim()
        .required("Name is required"),
      
      code: Yup.string().trim(),
      
      description: Yup.string()
        .trim()
        .required("Description is required"),
      
      status: Yup.boolean().required("Status is required"),
      icon: Yup.mixed().required("Icon is required"),

      // Numbers par trim nahi lagta, bas .required() kaafi hai
      minAmount: Yup.number().required("Minimum amount is required"),
      maxAmount: Yup.number().required("Maximum amount is required"),
      minTenure: Yup.number().required("Minimum tenure is required"),
      maxTenure: Yup.number().required("Maximum tenure is required"),
      intrestRate: Yup.number().required("Interest rate is required"),
      processingFee: Yup.number().required("Processing fee is required"),
      
      gstApplicable: Yup.boolean().required("This field is required"),
      lateFee: Yup.number().required("Late fee is required"),
      penaltyGraceDays: Yup.number().required("Penalty grace days is required"),
      prepaymentAllowed: Yup.boolean().required("This field is required"),
      prepaymentFee: Yup.number().required("This field is required"),

      minIncome: Yup.number().required("Minimum income is required"),
      maxEmiRatio: Yup.number().required("Maximum emi ratio is required"),
      incomeToLoanPercentage: Yup.number().required(
        "Income to loan percentage is required"
      ),
      creditScoreRequired: Yup.number().required("Credit score is required"),
      minAge: Yup.number().required("Min age is required"),
      maxAge: Yup.number().required("Max age is required"),

      // Array validation
      employmentTypesAllowed: Yup.array()
        .of(Yup.string().trim().required("Employment types is required"))
        .min(1, "At least one employment type is required"), // Message fixed here
        
      documentRequired: Yup.array()
        .of(Yup.string().trim().required("Document is required"))
        .min(1, "At least one document is required"),
    });

  const updateLoanTypeFunc = async (values) => {
    try {
      const formData = new FormData();

      // ✅ Append all values
      Object.keys(values).forEach((key) => {
        if (Array.isArray(values[key])) {
          // Array (employmentTypesAllowed, documentRequired, collateralTypes)
          values[key].forEach((item) => {
            formData.append(`${key}[]`, item);
          });
        } else if (key === "icon") {
          // Agar icon ek File object hai to append karo
          if (values.icon && typeof values.icon !== "string") {
            formData.append("icon", values.icon);
          }
        } else {
          formData.append(key, values[key]);
        }
      });

      // ✅ ID add kar do
      formData.append("_id", details?._id);
      let response = await updatePaydayLoanServ(formData);

      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        getLoanDetailsFunc();
        // navigate("/loan-type-list");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  const [documentList, setDocumentList] = useState([]);

  const getDocumentListFunc = async () => {
    try {
      let response = await getDocumentSetServ({ status: true });
      if (response?.data?.statusCode == "200") {
        const documentOption = response?.data?.data?.map((v) => ({
          value: v?.name,
          label: v?.name,
        }));

        setDocumentList(documentOption);
      }
    } catch (error) {}
  };
  useEffect((v, i) => {
    getDocumentListFunc();
  }, []);
  const params = useParams();
  const [details, setDetails] = useState();
  const getLoanDetailsFunc = async () => {
    try {
      let response = await getPaydayLoanDetailsServ();
      if (response?.data?.statusCode == "200") {
        const loanData = response?.data?.data;
        setDetails(loanData);
        setInitialValues({
          // basic fields
          name: loanData?.name || "",
          code: loanData?.code || "",
          description: loanData?.description || "",
          status: loanData?.status || "active",
          iconPreview: loanData?.icon,
          icon: loanData?.icon || "",

          // financial fields
          minAmount: loanData?.minAmount || "",
          maxAmount: loanData?.maxAmount || "",
          minTenure: loanData?.minTenure || "",
          maxTenure: loanData?.maxTenure || "",
          intrestRate: loanData?.intrestRate || "",
          processingFee: loanData?.processingFee || "",
          gstApplicable: loanData?.gstApplicable || "",
          gst: loanData?.gst || "",
          lateFee: loanData?.lateFee || "",
          penaltyGraceDays: loanData?.penaltyGraceDays || "",
          prepaymentAllowed: loanData?.prepaymentAllowed || "",
          prepaymentFee: loanData?.prepaymentFee || "",

          // eligibility fields
          minIncome: loanData?.minIncome || "",
          maxEmiRatio: loanData?.maxEmiRatio || "",
          incomeToLoanPercentage: loanData?.incomeToLoanPercentage || "",
          creditScoreRequired: loanData?.creditScoreRequired || "",
          minAge: loanData?.minAge || "",
          maxAge: loanData?.maxAge || "",
          employmentTypesAllowed: loanData?.employmentTypesAllowed || [],
          documentRequired: loanData?.documentRequired || [],
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLoanDetailsFunc();
  }, []);

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="ms-1 mb-0">Update {details?.name}</h5>
          </div>

          {details ? (
            <Formik
              initialValues={initialValues}
              enableReinitialize
              validationSchema={getLoanSchema()}
              
              onSubmit={async (values, { setSubmitting }) => {
                        try {
                          await updateLoanTypeFunc(values);
                        } catch (error) {
                          console.error("Add failed", error);
                        } finally {
                          setSubmitting(false); 
                        }
                      }}
            >
              {({ values, setFieldValue, isSubmitting, dirty }) => (
                <Form>
                  {/* Basic Information */}
                  <div className="form-section shadow-sm">
                    <div className="form-section-header">
                      <i className="bi bi-info-circle me-2" />
                      Basic Information
                    </div>
                    <div className="form-section-body">
                      <div className="row g-3">
                        <div className="col-md-4">
                          <label className="form-label">
                            Loan Name<span className="text-danger">*</span>
                          </label>
                          <Field
                            type="text"
                            name="name"
                            className="form-control"
                            placeholder="Enter loan type name"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label">Loan Code / ID</label>
                          <Field
                            type="text"
                            name="code"
                            className="form-control"
                            placeholder="Auto-generated if empty"
                          />
                          <ErrorMessage
                            name="code"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">
                            Status<span className="text-danger">*</span>
                          </label>
                          <Field
                            as="select"
                            name="status"
                            className="form-select"
                          >
                            <option value="">Select</option>
                            <option value={true}>Active</option>
                            <option value={false}>Inactive</option>
                          </Field>
                          <ErrorMessage
                            name="status"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-2 mt-auto">
                          <div className="text-center">
                            <input
                              id="iconUpload"
                              type="file"
                              accept="image/*"
                              style={{ display: "none" }}
                              onChange={(e) => {
                                const file = e.target.files[0];
                                if (file) {
                                  setFieldValue("icon", file);

                                  // ✅ preview ke liye
                                  const previewUrl = URL.createObjectURL(file);
                                  setFieldValue("iconPreview", previewUrl);
                                }
                              }}
                            />

                            <label
                              htmlFor="iconUpload"
                              className="cursor-pointer"
                            >
                              <img
                                src={
                                  values.iconPreview ||
                                  "https://cdn-icons-png.flaticon.com/128/8191/8191607.png"
                                }
                                alt="Loan Icon"
                                style={{
                                  width: "90px",
                                  height: "90px",
                                  objectFit: "contain",
                                }}
                              />
                            </label>
                            <p>
                              Upload Icon <span className="text-danger">*</span>
                            </p>
                            <ErrorMessage
                              name="icon"
                              component="div"
                              className="text-danger small"
                            />
                          </div>
                        </div>

                        <div className="col-10">
                          <label className="form-label">
                            Description<span className="text-danger">*</span>
                          </label>
                          <Field
                            as="textarea"
                            name="description"
                            className="form-control"
                            rows={4}
                            placeholder="Please enter brief description about this loan type"
                          />
                          <ErrorMessage
                            name="description"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Loan Amount & Duration */}
                  <div className="form-section shadow-sm">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="form-section-header">
                        <i className="bi bi-info-circle me-2" />
                        Financial Parameters
                      </div>
                    </div>

                    <div className="form-section-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">
                            Minimum Loan Amount (INR)
                          </label>
                          <Field
                            type="number"
                            name="minAmount"
                            className="form-control"
                            placeholder="Enter Amount"
                          />
                          <ErrorMessage
                            name="minAmount"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">
                            Maximum Loan Amount (INR)
                          </label>
                          <Field
                            type="number"
                            name="maxAmount"
                            className="form-control"
                            placeholder="Enter Amount"
                          />
                          <ErrorMessage
                            name="maxAmount"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label">
                            Minimum Tenure (Days)
                          </label>
                          <Field
                            type="number"
                            name="minTenure"
                            className="form-control"
                            placeholder="Enter Tenure"
                          />
                          <ErrorMessage
                            name="minTenure"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label">
                            Maximum Tenure (Days)
                          </label>
                          <Field
                            type="number"
                            name="maxTenure"
                            className="form-control"
                            placeholder="Enter Tenure "
                          />
                          <ErrorMessage
                            name="maxTenure"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-4">
                          <label className="form-label">
                            Interest Rate (%)
                          </label>
                          <Field
                            type="number"
                            name="intrestRate"
                            // step="0.01"
                            className="form-control"
                            placeholder="Enter Interest Rate"
                          />
                          <ErrorMessage
                            name="intrestRate"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Processing Fee</label>
                          <Field
                            type="number"
                            name="processingFee"
                            // step="0.01"
                            className="form-control"
                            placeholder="Enter Processing Fee"
                          />
                          <ErrorMessage
                            name="processingFee"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">GST Applicable</label>
                          <Field
                            as="select"
                            name="gstApplicable"
                            className="form-control"
                          >
                            <option value="">Select GST Option</option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </Field>
                          <ErrorMessage
                            name="gstApplicable"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">GST (%)</label>
                          <Field
                            type="number"
                            name="gst"
                            // step="0.01"
                            className="form-control"
                            placeholder="Enter GST Fee"
                          />
                          <ErrorMessage
                            name="gst"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Late Fee (%)</label>
                          <Field
                            type="number"
                            name="lateFee"
                            // step="0.01"
                            className="form-control"
                            placeholder="Enter Late Fee"
                          />
                          <ErrorMessage
                            name="lateFee"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">
                            Penalty Grace Days
                          </label>
                          <Field
                            type="number"
                            name="penaltyGraceDays"
                            // step="0.01"
                            className="form-control"
                            placeholder="Enter penalty grace days"
                          />
                          <ErrorMessage
                            name="penaltyGraceDays"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">
                            Prepayment Allowed
                          </label>
                          <Field
                            as="select"
                            name="prepaymentAllowed"
                            className="form-control"
                          >
                            <option value="">Select</option>
                            <option value={true}>Yes</option>
                            <option value={false}>No</option>
                          </Field>
                          <ErrorMessage
                            name="prepaymentAllowed"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-4">
                          <label className="form-label">Prepayment Fee %</label>
                          <Field
                            type="number"
                            name="prepaymentFee"
                            // step="0.01"
                            className="form-control"
                            placeholder="Enter Prepayment Fee"
                          />
                          <ErrorMessage
                            name="prepaymentFee"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Eligibility Rules */}
                  <div className="form-section shadow-sm">
                    <div className="form-section-header">
                      <i className="bi bi-info-circle me-2" />
                      Eligibility Rules
                    </div>
                    <div className="form-section-body">
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">Minimum Income</label>
                          <Field
                            type="number"
                            name="minIncome"
                            className="form-control"
                            placeholder="Enter Income"
                          />
                          <ErrorMessage
                            name="minIncome"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Maximum Emi Ration
                          </label>
                          <Field
                            type="number"
                            name="maxEmiRatio"
                            className="form-control"
                            placeholder="Enter max emi ration"
                          />
                          <ErrorMessage
                            name="maxEmiRatio"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Income To Loan %</label>
                          <Field
                            type="number"
                            name="incomeToLoanPercentage"
                            className="form-control"
                            placeholder="Enter income to loan %"
                          />
                          <ErrorMessage
                            name="incomeToLoanPercentage"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Credit Score Requirement
                          </label>
                          <Field
                            type="number"
                            name="creditScoreRequired"
                            className="form-control"
                            placeholder="Enter Credit Score"
                          />
                          <ErrorMessage
                            name="creditScoreRequired"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Minimum Age</label>
                          <Field
                            type="number"
                            name="minAge"
                            className="form-control"
                            placeholder="Enter Age"
                          />
                          <ErrorMessage
                            name="minAge"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Maximum Age</label>
                          <Field
                            type="number"
                            name="maxAge"
                            className="form-control"
                            placeholder="Enter Age"
                          />
                          <ErrorMessage
                            name="maxAge"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Employement Type</label>
                          <MultiSelect
                            options={[
                              {
                                value: "Private Sector",
                                label: "Private Sector",
                              },
                              {
                                value: "Government Sector",
                                label: "Government Sector",
                              },
                              {
                                value: "Self-Employed",
                                label: "Self-Employed",
                              },
                              {
                                value: "Freelancer / Independent Contractor",
                                label: "Freelancer / Independent Contractor",
                              },
                              {
                                value: "Daily Wage / Labor Worker",
                                label: "Daily Wage / Labor Worker",
                              },
                            ]}
                            value={values.employmentTypesAllowed.map((v) => ({
                              value: v,
                              label: v,
                            }))}
                            onChange={(selected) =>
                              setFieldValue(
                                "employmentTypesAllowed",
                                selected.map((s) => s.value)
                              )
                            }
                            labelledBy="Select Employment Types"
                          />
                          <ErrorMessage
                            name="employmentTypesAllowed"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">
                            Required Documents
                            <span className="text-danger">*</span>
                          </label>
                          <MultiSelect
                            options={documentList}
                            value={values.documentRequired.map((doc) => ({
                              value: doc,
                              label: doc,
                            }))}
                            onChange={(selected) =>
                              setFieldValue(
                                "documentRequired",
                                selected.map((s) => s.value)
                              )
                            }
                            labelledBy="Select Document"
                            hasSelectAll={true}
                            overrideStrings={{
                              selectSomeItems: "Select Documents", // Placeholder text
                              allItemsAreSelected: "All Documents Selected",
                              selectAll: "Select All",
                              search: "Search Documents...",
                            }}
                          />
                          <ErrorMessage
                            name="documentRequired"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Submit Buttons */}
                  <div className="d-flex justify-content-end align-items-center mb-5 mt-4">
                    <div>
                      <button type="reset" className="btn btn-danger me-2">
                        Reset
                      </button>
                      <button
                        className="btn bgThemePrimary "
                        type="submit"
                        disabled={isSubmitting || !dirty}
                      >
                        {isSubmitting ? "Submitting..." : " Save Loan Type"}
                      </button>
                    </div>
                  </div>
                </Form>
              )}
            </Formik>
          ) : (
            <div>
              {[1, 2, 3, 4, 5]?.map((v, i) => {
                return (
                  <div className="form-section shadow-sm">
                    <div className="form-section-header">
                      <Skeleton height={30} width={30}/>
                      <Skeleton height={30} width={300} />
                    </div>
                    <div className="form-section-body">
                      <div className="row g-3">
                        {[1, 2, 3, 4, 5, 6]?.map((v, i) => {
                          return (
                            <div className="col-4">
                              <Skeleton width={100} />
                              <div className="mt-1">
                                <Skeleton height={30} />
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default UpdateLoanRequirement;
