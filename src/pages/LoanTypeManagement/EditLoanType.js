import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import {
  updateLoanTypeServ,
  loanTypeDetailsServ,
} from "../../services/loan.services";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { MultiSelect } from "react-multi-select-component";
import { getDocumentSetServ } from "../../services/document.services";

function EditLoanType() {
  const navigate = useNavigate();
  const [showDaysForm, setShowDaysForm] = useState(false);
  const [showWebForm, setShowWebForm] = useState(false);
  const [initialValues, setInitialValues] = useState({
    name: "",
    code: "",
    description: "",
    status: "",
    icon: "",

    // normal fields
    minAmount: "",
    maxAmount: "",
    minTenure: "",
    maxTenure: "",
    intrestRate: "",
    intrestType: "",
    repaymentFrequency: "",

    // days fields
    minAmountDays: "",
    maxAmountDays: "",
    minTenureDays: "",
    maxTenureDays: "",
    intrestRateDays: "",
    intrestTypeDays: "",
    repaymentFrequencyDays: "",

    // common fields
    minIncome: "",
    creditScoreRequired: "",
    minAge: "",
    maxAge: "",
    employmentTypesAllowed: [],
    DTIR: "",

    collateralRequired: false,
    collateralTypes: [],
    maxLTV: "",

    processingFee: "",
    latePaymentPenalty: "",
    prepaymentFee: "",

    auto_approval: false,
    documentRequired: [],
    isActiveOnWeb: false,
    title: "",
    slug: "",
    banner: "",
    seoTitle: "",
    metaKeywords: "",
    metaDescription: "",
  });
  const getLoanSchema = (showDaysForm) =>
  Yup.object().shape({
    name: Yup.string().trim(),
    code: Yup.string().trim(),
    description: Yup.string().trim().required("Description is required"),
    status: Yup.boolean().required("Status is required"),
    icon: Yup.mixed().required("Icon is required"),

    // --- Conditional Days Form ---
    ...(showDaysForm
      ? {
          minAmountDays: Yup.number().required("Minimum amount (days) is required"),
          maxAmountDays: Yup.number().required("Maximum amount (days) is required"),
          minTenureDays: Yup.number().required("Minimum tenure (days) is required"),
          maxTenureDays: Yup.number().required("Maximum tenure (days) is required"),
          intrestRateDays: Yup.number().required("Interest rate (days) is required"),
          intrestTypeDays: Yup.string().trim().required("Interest type (days) is required"),
          repaymentFrequencyDays: Yup.number().required("Repayment frequency (days) is required"),
        }
      : {
          minAmount: Yup.number().required("Minimum amount is required"),
          maxAmount: Yup.number().required("Maximum amount is required"),
          minTenure: Yup.number().required("Minimum tenure is required"),
          maxTenure: Yup.number().required("Maximum tenure is required"),
          intrestRate: Yup.number().required("Interest rate is required"),
          intrestType: Yup.string().trim().required("Interest type is required"),
          repaymentFrequency: Yup.number().required("Repayment frequency is required"),
        }),

    minIncome: Yup.number(),
    creditScoreRequired: Yup.number(),
    minAge: Yup.number(),
    maxAge: Yup.number(),
    employmentTypesAllowed: Yup.array(),
    DTIR: Yup.number(),
    collateralRequired: Yup.boolean().required("Collateral required is required"),
    collateralTypes: Yup.array().of(Yup.string().trim()), // Trimmed inside array
    maxLTV: Yup.number(),
    processingFee: Yup.number().required("Processing fee is required"),
    latePaymentPenalty: Yup.number().required("Late payment penalty is required"),
    prepaymentFee: Yup.number().required("Prepayment fee is required"),
    auto_approval: Yup.boolean().required("Auto approval is required"),
    
    documentRequired: Yup.array()
      .of(Yup.string().trim().required("Document is required"))
      .min(1, "At least one document is required"),

    // --- Conditional Web Form (Using showWebForm from state) ---
    ...(showWebForm
      ? {
          title: Yup.string().trim().required("Title is required"),
          slug: Yup.string().trim().required("Slug is required"),
          seoTitle: Yup.string().trim(),
          metaDescription: Yup.string().trim(),
          metaKeywords: Yup.string().trim(),
          isActiveOnWeb: Yup.boolean(),
          banner: Yup.mixed().required("Banner image is required"),
        }
      : {
          title: Yup.string().trim(),
          slug: Yup.string().trim(),
          seoTitle: Yup.string().trim(),
          metaDescription: Yup.string().trim(),
          metaKeywords: Yup.string().trim(),
          isActiveOnWeb: Yup.boolean(),
          banner: Yup.mixed(),
        }),
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
      formData.append("_id", params?.id);
      let response = await updateLoanTypeServ(formData);

      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigate("/loan-type-list");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
      console.error(error);
    }
  };

  const [documentList, setDocumentList] = useState([]);
  const [selectedDocument, setSelectedDocument] = useState([]);

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
  const getLoanDetailsFunc = async (id) => {
    try {
      let response = await loanTypeDetailsServ(id);
      if (response?.data?.statusCode == "200") {
        const loanData = response?.data?.data;
        setDetails(loanData);

        // ✅ set API data in state
        setInitialValues({
          name: loanData?.name || "",
          code: loanData?.code || "",
          description: loanData?.description || "",
          status: loanData?.status || "active",
          iconPreview: loanData?.icon,
          icon: loanData?.icon || "",

          // normal fields
          minAmount: loanData?.minAmount || "",
          maxAmount: loanData?.maxAmount || "",
          minTenure: loanData?.minTenure || "",
          maxTenure: loanData?.maxTenure || "",
          intrestRate: loanData?.intrestRate || "",
          intrestType: loanData?.intrestType || "",
          repaymentFrequency: loanData?.repaymentFrequency || "",

          // days fields
          minAmountDays: loanData?.minAmountDays || "",
          maxAmountDays: loanData?.maxAmountDays || "",
          minTenureDays: loanData?.minTenureDays || "",
          maxTenureDays: loanData?.maxTenureDays || "",
          intrestRateDays: loanData?.intrestRateDays || "",
          intrestTypeDays: loanData?.intrestTypeDays || "",
          repaymentFrequencyDays: loanData?.repaymentFrequencyDays || "",

          // common fields
          minIncome: loanData?.minIncome || "",
          creditScoreRequired: loanData?.creditScoreRequired || "",
          minAge: loanData?.minAge || "",
          maxAge: loanData?.maxAge || "",
          employmentTypesAllowed: loanData?.employmentTypesAllowed || [],
          DTIR: loanData?.DTIR || "",

          collateralRequired: loanData?.collateralRequired || false,
          collateralTypes: loanData?.collateralTypes || [],
          maxLTV: loanData?.maxLTV || "",

          processingFee: loanData?.processingFee || "",
          latePaymentPenalty: loanData?.latePaymentPenalty || "",
          prepaymentFee: loanData?.prepaymentFee || "",

          auto_approval: loanData?.auto_approval || false,
          documentRequired: loanData?.documentRequired || [],

          title: loanData?.title,
          slug: loanData?.slug,
          seoTitle: loanData?.seoTitle,
          metaDescription: loanData?.metaDescription,
          metaKeywords: loanData?.metaKeywords,
          isActiveOnWeb: loanData?.isActiveOnWeb,
          banner: loanData?.banner || "",
          bannerPreview :loanData?.banner || ""
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getLoanDetailsFunc(params?.id);
  }, [params?.id]);
  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="ms-1 mb-0">
              <i
                className="bi-arrow-left-circle bi cursor"
                onClick={() => navigate("/loan-type-list")}
              ></i>{" "}
              Update {details?.name}
            </h5>
          </div>

          {/* ✅ Formik Wrapper */}
          <Formik
            initialValues={initialValues}
            enableReinitialize
            validationSchema={getLoanSchema(showDaysForm)}
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
                      Loan Amount & Duration (Months)
                    </div>
                    <div className="form-check form-switch mb-3">
                      <input
                        type="checkbox"
                        onChange={() => setShowDaysForm(!showDaysForm)}
                        className="form-check-input"
                      />
                      <label className="form-check-label">
                        Also add for days
                      </label>
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

                      <div className="col-md-3">
                        <label className="form-label">
                          Minimum Tenure (Months)
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

                      <div className="col-md-3">
                        <label className="form-label">
                          Maximum Tenure (Months)
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

                      <div className="col-md-3">
                        <label className="form-label">Interest Rate (%)</label>
                        <Field
                          type="number"
                          name="intrestRate"
                          step="0.01"
                          className="form-control"
                          placeholder="Enter Interest Rate"
                        />
                        <ErrorMessage
                          name="intrestRate"
                          component="div"
                          className="text-danger small"
                        />
                      </div>

                      <div className="col-md-3">
                        <label className="form-label">Interest Type</label>
                        <Field
                          as="select"
                          name="intrestType"
                          className="form-select"
                        >
                          <option value="">Select</option>
                          <option value="flat">Flat</option>
                          <option value="reducing">Reducing</option>
                          <option value="simple">Simple</option>
                          <option value="compound">Compound</option>
                        </Field>
                        <ErrorMessage
                          name="intrestType"
                          component="div"
                          className="text-danger small"
                        />
                      </div>

                      <div className="col-md-6">
                        <label className="form-label">
                          Repayment Frequency (In Months)
                        </label>

                        <Field
                          type="number"
                          name="repaymentFrequency"
                          className="form-control"
                          placeholder="Enter Repayment Frequency"
                        />
                        <ErrorMessage
                          name="repaymentFrequency"
                          component="div"
                          className="text-danger small"
                        />
                      </div>
                    </div>
                  </div>
                </div>
                {showDaysForm && (
                  <div className="form-section shadow-sm">
                    <div className="d-flex justify-content-between align-items-center">
                      <div className="form-section-header">
                        <i className="bi bi-info-circle me-2" />
                        Loan Amount & Duration (Days)
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
                            name="minAmountDays"
                            className="form-control"
                            placeholder="Enter Amount"
                          />
                          <ErrorMessage
                            name="minAmountDays"
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
                            name="maxAmountDays"
                            className="form-control"
                            placeholder="Enter Amount"
                          />
                          <ErrorMessage
                            name="maxAmountDays"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label">
                            Minimum Tenure (Days)
                          </label>
                          <Field
                            type="number"
                            name="minTenureDays"
                            className="form-control"
                            placeholder="Enter Tenure"
                          />
                          <ErrorMessage
                            name="minTenureDays"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label">
                            Maximum Tenure (Days)
                          </label>
                          <Field
                            type="number"
                            name="maxTenureDays"
                            className="form-control"
                            placeholder="Enter Tenure"
                          />
                          <ErrorMessage
                            name="maxTenureDays"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label">
                            Interest Rate (%)
                          </label>
                          <Field
                            type="number"
                            name="intrestRateDays"
                            step="0.01"
                            className="form-control"
                            placeholder="Enter Interest Rate"
                          />
                          <ErrorMessage
                            name="intrestRateDays"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-3">
                          <label className="form-label">Interest Type</label>
                          <Field
                            as="select"
                            name="intrestTypeDays"
                            className="form-select"
                          >
                            <option value="">Select</option>
                            <option value="flat">Flat</option>
                            <option value="reducing">Reducing</option>
                            <option value="simple">Simple</option>
                            <option value="compound">Compound</option>
                          </Field>
                          <ErrorMessage
                            name="intrestTypeDays"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-6">
                          <label className="form-label">
                            Repayment Frequency (In Days)
                          </label>

                          <Field
                            type="number"
                            name="repaymentFrequencyDays"
                            className="form-control"
                            placeholder="Enter Repayment Frequency"
                          />
                          <ErrorMessage
                            name="repaymentFrequencyDays"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                )}

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
                             { value: "Private Sector", label: "Private Sector" },
                            { value: "Government Sector", label: "Government Sector" },
                            { value: "Self-Employed", label: "Self-Employed" },
                            { value: "Freelancer / Independent Contractor", label: "Freelancer / Independent Contractor" },
                            { value: "Daily Wage / Labor Worker", label: "Daily Wage / Labor Worker" },
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
                          Dept To Income Max Ration
                        </label>
                        <Field
                          type="string"
                          name="DTIR"
                          className="form-control"
                          placeholder="Enter Dept To Income Ratio"
                        />
                        <ErrorMessage
                          name="DTIR"
                          component="div"
                          className="text-danger small"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Collateral / Security */}
                <div className="form-section shadow-sm">
                  <div className="form-section-header">
                    <i className="bi bi-info-circle me-2" />
                    Collateral / Security
                  </div>
                  <div className="form-section-body">
                    <div className="form-check form-switch mb-3">
                      <Field
                        type="checkbox"
                        name="collateralRequired"
                        className="form-check-input"
                      />
                      <label className="form-check-label">
                        Collateral Required
                      </label>
                    </div>

                    {values.collateralRequired && (
                      <div className="row g-3">
                        <div className="col-md-6">
                          <label className="form-label">
                            Accepted Collateral Type
                          </label>
                          {/* <Field
                            as="select"
                            name="collateralTypes"
                            className="form-select"
                          >
                            <option value="property">Property</option>
                            <option value="vehicle">Vehicle</option>
                            <option value="fd">Fixed Deposit</option>
                            <option value="gold">Gold</option>
                            <option value="others">Others</option>
                          </Field> */}
                          <MultiSelect
                            options={[
                              { value: "Property", label: "Property" },
                              { value: "Vehicle", label: "Vehicle" },
                              { value: "Deposit", label: "Deposit" },
                              { value: "Gold", label: "Gold" },
                              { value: "Others", label: "Others" },
                            ]}
                            value={values.collateralTypes.map((v) => ({
                              value: v,
                              label: v,
                            }))}
                            onChange={(selected) =>
                              setFieldValue(
                                "collateralTypes",
                                selected.map((s) => s.value)
                              )
                            }
                            labelledBy="Select Collateral Types"
                          />
                          <ErrorMessage
                            name="collateralTypes"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Maximum LTV (%)</label>
                          <Field
                            type="number"
                            name="maxLTV"
                            className="form-control"
                            placeholder="Enter MaxLTV"
                          />
                          <ErrorMessage
                            name="maxLTV"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </div>
                    )}
                  </div>
                </div>

                {/* Fees & Charges */}
                <div className="form-section shadow-sm">
                  <div className="form-section-header">
                    <i className="bi bi-info-circle me-2" />
                    Fees & Charges
                  </div>
                  <div className="form-section-body">
                    <div className="row g-3">
                      <div className="col-md-4">
                        <label className="form-label">
                          Processing Fee (%)
                          <span className="text-danger">*</span>
                        </label>
                        <Field
                          type="number"
                          step="0.01"
                          name="processingFee"
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
                        <label className="form-label">
                          Late Payment Penalty (%)
                          <span className="text-danger">*</span>
                        </label>
                        <Field
                          type="number"
                          step="0.01"
                          name="latePaymentPenalty"
                          className="form-control"
                          placeholder="Enter Late Payment Penalty"
                        />
                        <ErrorMessage
                          name="latePaymentPenalty"
                          component="div"
                          className="text-danger small"
                        />
                      </div>
                      <div className="col-md-4">
                        <label className="form-label">
                          Prepayment Fee (%)
                          <span className="text-danger">*</span>
                        </label>
                        <Field
                          type="number"
                          step="0.01"
                          name="prepaymentFee"
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

                {/* Disbursal Settings */}
                <div className="form-section shadow-sm">
                  <div className="form-section-header">
                    <i className="bi bi-info-circle me-2" />
                    Disbursal Settings
                  </div>
                  <div className="form-section-body">
                    <div className="form-check form-switch">
                      <Field
                        type="checkbox"
                        name="auto_approval"
                        className="form-check-input"
                      />
                      <label className="form-check-label">
                        Auto-Disbursal Allowed
                      </label>
                    </div>
                  </div>
                </div>
                <div className="form-section shadow-sm">
                  <div className="form-section-header">
                    <i className="bi bi-info-circle me-2" />
                    Document Required
                  </div>
                  <div className="form-section-body">
                    <label className="form-label">
                      Required Documents<span className="text-danger">*</span>
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
                <div className="form-section shadow-sm">
                  <div className="form-section-header">Web content</div>
                  <div className="form-section-body">
                    <div className="form-check form-switch mb-3">
                      <Field
                        type="checkbox"
                        name="isActiveOnWeb"
                        className="form-check-input"
                        onChange={(e) => {
                          setFieldValue("isActiveOnWeb", e.target.checked);
                          setShowWebForm(e.target.checked);
                        }}
                      />
                      <label className="form-check-label">Is active</label>
                    </div>
                    <div className="form-section-body">
                      {values?.isActiveOnWeb && (
                        <div className="row g-3">
                          <div className="col-md-6">
                            <label className="form-label">
                              Title<span className="text-danger">*</span>
                            </label>
                            <Field
                              type="text"
                              name="title"
                              className="form-control"
                              placeholder="Enter loan title"
                            />
                            <ErrorMessage
                              name="title"
                              component="div"
                              className="text-danger small"
                            />
                          </div>

                          <div className="col-md-6">
                            <label className="form-label">
                              Slug <span className="text-danger">*</span>
                            </label>
                            <Field
                              type="text"
                              name="slug"
                              className="form-control"
                              placeholder="Enter Slug"
                            />
                            <ErrorMessage
                              name="slug"
                              component="div"
                              className="text-danger small"
                            />
                          </div>

                          <div className="col-2 my-auto">
                            <div className="text-center">
                              <input
                                id="bannerUpload"
                                type="file"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) => {
                                  const file = e.target.files[0];
                                  if (file) {
                                    setFieldValue("banner", file);

                                    // ✅ preview ke liye
                                    const previewUrl =
                                      URL.createObjectURL(file);
                                    setFieldValue("bannerPreview", previewUrl);
                                  }
                                }}
                              />

                              <label
                                htmlFor="bannerUpload"
                                className="cursor-pointer"
                              >
                                <img
                                  src={
                                    values.bannerPreview ||
                                    "https://cdn-icons-png.flaticon.com/128/8191/8191607.png"
                                  }
                                  alt="Loan Banner"
                                  style={{
                                    width: "90px",
                                    height: "90px",
                                    objectFit: "contain",
                                  }}
                                />
                              </label>
                              <p>
                                Upload Banner{" "}
                                <span className="text-danger">*</span>
                              </p>
                              <ErrorMessage
                                name="banner"
                                component="div"
                                className="text-danger small"
                              />
                            </div>
                          </div>

                          <div className="col-10  row m-0 p-0 mt-3">
                            <div className="col-md-6">
                              <label className="form-label">Seo Title</label>
                              <Field
                                type="text"
                                name="seoTitle"
                                className="form-control"
                                placeholder="Enter Title"
                              />
                              <ErrorMessage
                                name="seoTitle"
                                component="div"
                                className="text-danger small"
                              />
                            </div>
                            <div className="col-md-6">
                              <label className="form-label">Meta Keyword</label>
                              <Field
                                type="text"
                                name="metaKeywords"
                                className="form-control"
                                placeholder="Enter keywords"
                              />
                              <ErrorMessage
                                name="metaKeywords"
                                component="div"
                                className="text-danger small"
                              />
                            </div>
                            <div className="col-12 mt-3">
                              <label className="form-label">
                                Meta Description
                              </label>
                              <Field
                                as="textarea"
                                name="metaDescription"
                                className="form-control"
                                rows={4}
                                placeholder="Please enter brief meta description about this loan type"
                              />
                              <ErrorMessage
                                name="metaDescription"
                                component="div"
                                className="text-danger small"
                              />
                            </div>
                          </div>
                        </div>
                      )}
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
        </div>
      </div>
    </div>
  );
}

export default EditLoanType;
