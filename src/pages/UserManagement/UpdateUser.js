import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate, useParams } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  getUserDetailsServ,
  updateUserServ,
} from "../../services/user.service";

function UpdateUser() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [initialValues, setInitialValues] = useState(null);

  // ✅ Validation Schema
  const userSchema = Yup.object().shape({
    firstName: Yup.string().trim().required("First Name is required"),
    lastName: Yup.string().trim().required("Last Name is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    countryCode: Yup.string().trim(),
    phone: Yup.string()
      .trim()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone number is required"),

    // Date field - No trim needed
    dob: Yup.date().required("Date of Birth is required"),

    gender: Yup.string().trim().required("Gender is required"),

    profileStatus: Yup.string().trim().required("Profile status is required"),

    state: Yup.string().trim().required("State is required"),
    city: Yup.string().trim().required("City is required"),
    pincode: Yup.string()
      .trim()
      .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
      .required("Pincode is required"),
    address: Yup.string().trim().required("Address is required"),

    employementType: Yup.string()
      .trim()
      .required("Employment Type is required"),

    // Number fields - No trim needed
    monthlyIncome: Yup.number().required("Monthly Income is required"),
    annualIncome: Yup.number().required("Annual Income is required"),
    creditScore: Yup.number().required("Credit Score is required"),

    panNumber: Yup.string()
      .trim()
      .matches(/^[A-Z]{5}[0-9]{4}[A-Z]{1}$/, "Invalid PAN format")
      .nullable(),

    aadharNumber: Yup.string()
      .trim()
      .matches(/^[0-9]{12}$/, "Aadhar must be 12 digits")
      .nullable(),

    profilePic: Yup.mixed(),
  });
const formatDateForInput = (dateStr) => {
    if (!dateStr || !dateStr.includes("/")) return "";
    const [day, month, year] = dateStr.split("/");
    return `${year}-${month}-${day}`;
  };
  // ✅ Fetch user
  useEffect(() => {
    const fetchUser = async () => {
      try {
        let response = await getUserDetailsServ(id);
        if (response?.data?.statusCode == "200") {
          const user = response.data.data;
          setInitialValues({
            firstName: user.firstName || "",
            lastName: user.lastName || "",
            email: user.email || "",
            phone: user.phone || "",
            countryCode: user.countryCode || "+91",
            dob: user.dob ? formatDateForInput(user.dob) : "",
            gender: user.gender || "",
            profileStatus: user.profileStatus || "",
            state: user.state || "",
            city: user.city || "",
            pincode: user.pincode || "",
            address: user.address || "",
            employementType: user.employementType || "",
            monthlyIncome: user.monthlyIncome || "",
            annualIncome: user.annualIncome || "",
            creditScore: user.creditScore || "",
            panNumber: user.panNumber || "",
            aadharNumber: user.aadharNumber || "",
            profilePrev: user?.profilePic,
          });
        } else {
          toast.error("Failed to load user details");
        }
      } catch (err) {
        console.error(err);
        toast.error("Error fetching user details");
      }
    };
    fetchUser();
  }, [id]);

  // ✅ Handle Update
  const handleUpdateUser = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "profilePic") {
          // ✅ Sirf tabhi bhejo jab file ho
          if (values.profilePic) {
            formData.append("profilePic", values.profilePic);
          }
        } else {
          formData.append(key, values[key]);
        }
      });
      formData.append("id", id);
      let response = await updateUserServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigate("/all-users");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  //   if (!initialValues) {
  //     return <div className="p-5 text-center">Loading...</div>;
  //   }

  return (
    <div className="container-fluid">
      <div className="col-lg-12 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="ms-1 mb-0">
            <i
              className="bi-arrow-left-circle bi cursor"
              onClick={() => navigate("/all-users")}
            ></i>{" "}
            Update User
          </h5>
        </div>

        <Formik
          initialValues={initialValues}
          validationSchema={userSchema}
          enableReinitialize
          
          onSubmit={async (values, { setSubmitting }) => {
                        try {
                          await handleUpdateUser(values);
                        } catch (error) {
                          console.error("Add failed", error);
                        } finally {
                          setSubmitting(false); 
                        }
                      }}
        >
          {({ setFieldValue, isSubmitting, values, dirty }) => (
            <Form>
              {/* Personal Details */}
              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Personal Details</div>
                <div className="form-section-body row g-3">
                  <div className="col-md-3 text-center">
                    <input
                      type="file"
                      id="profilePic"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFieldValue("profilePic", file);
                          const previewUrl = URL.createObjectURL(file);
                          setFieldValue("profilePrev", previewUrl);
                        }
                      }}
                    />
                    <label htmlFor="profilePic" className="cursor-pointer">
                      <img
                        src={
                          values?.profilePrev
                            ? values?.profilePrev
                            : "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                        }
                        alt="Profile"
                        style={{
                          width: "100px",
                          height: "100px",
                          borderRadius: "50%",
                          objectFit: "cover",
                        }}
                      />
                    </label>
                    <ErrorMessage
                      name="profilePic"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      First Name <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="text"
                      name="firstName"
                      className="form-control"
                      placeholder="Enter First Name"
                    />
                    <ErrorMessage
                      name="firstName"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Last Name <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="text"
                      name="lastName"
                      className="form-control"
                      placeholder="Enter Last Name"
                    />
                    <ErrorMessage
                      name="lastName"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Email <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      placeholder="Enter Email"
                    />
                    <ErrorMessage
                      name="email"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Phone <span className="text-danger">*</span>
                    </label>
                    <div className="input-group">
                      <Field
                        as="select"
                        name="countryCode"
                        className="form-select"
                        style={{ maxWidth: "100px" }}
                      >
                        <option value="+91">🇮🇳 +91</option>
                        <option value="+1">🇺🇸 +1</option>
                        <option value="+44">🇬🇧 +44</option>
                        <option value="+971">🇦🇪 +971</option>
                        <option value="+61">🇦🇺 +61</option>
                      </Field>
                      <Field
                        type="text"
                        name="phone"
                        className="form-control"
                        placeholder="Enter Phone"
                      />
                    </div>
                    <ErrorMessage
                      name="phone"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Date Of Birth <span className="text-danger">*</span>
                    </label>
                    <Field type="date" name="dob" className="form-control" />
                    <ErrorMessage
                      name="dob"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Gender <span className="text-danger">*</span>
                    </label>
                    <Field as="select" name="gender" className="form-select">
                      <option value="">Select</option>
                      <option value="male">Male</option>
                      <option value="female">Female</option>
                      <option value="other">Other</option>
                    </Field>
                    <ErrorMessage
                      name="gender"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Profile Status <span className="text-danger">*</span>
                    </label>
                    <Field
                      as="select"
                      name="profileStatus"
                      className="form-select"
                    >
                      <option value="">Select</option>
                      <option value="registered">Registered</option>
                      <option value="verified">Verified</option>
                      <option value="active">Active</option>
                      <option value="blocked">Blocked</option>
                    </Field>
                    <ErrorMessage
                      name="profileStatus"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                </div>
              </div>

              {/* Address Details */}
              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Address Details</div>
                <div className="form-section-body row g-3">
                  <div className="col-md-4">
                    <label className="form-label">
                      State <span className="text-danger">*</span>
                    </label>
                    <Field type="text" name="state" className="form-control" />
                    <ErrorMessage
                      name="state"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      City <span className="text-danger">*</span>{" "}
                    </label>
                    <Field type="text" name="city" className="form-control" />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">
                      Pincode <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="text"
                      name="pincode"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="pincode"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-12">
                    <label className="form-label">
                      Address <span className="text-danger">*</span>
                    </label>
                    <Field
                      as="textarea"
                      name="address"
                      className="form-control"
                      rows={3}
                    />
                    <ErrorMessage
                      name="address"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                </div>
              </div>

              {/* Document Uploads */}
              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Document Details</div>
                <div className="form-section-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label">PAN Number</label>
                    <Field
                      type="text"
                      name="panNumber"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="panNumber"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Aadhar Number</label>
                    <Field
                      type="text"
                      name="aadharNumber"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="aadharNumber"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                </div>
              </div>

              {/* Employment Details */}
              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Employment Details</div>
                <div className="form-section-body row g-3">
                  <div className="col-md-6">
                    <label className="form-label">
                      Employment Type <span className="text-danger">*</span>
                    </label>
                    <Field
                      as="select"
                      name="employementType"
                      className="form-select"
                    >
                      <option value="">Select</option>
                      <option value="Private Sector">Private Sector</option>
                      <option value="Government Sector">
                        Government Sector
                      </option>
                      <option value="Self-Employed">Self-Employed</option>
                      <option value="Freelancer / Independent Contractor">
                        Freelancer / Independent Contractor
                      </option>
                      <option value="Daily Wage / Labor Worker">
                        Daily Wage / Labor Worker
                      </option>
                    </Field>
                    <ErrorMessage
                      name="employementType"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Monthly Income <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="number"
                      name="monthlyIncome"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="monthlyIncome"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Annual Income <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="number"
                      name="annualIncome"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="annualIncome"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">
                      Credit Score <span className="text-danger">*</span>
                    </label>
                    <Field
                      type="number"
                      name="creditScore"
                      className="form-control"
                    />
                    <ErrorMessage
                      name="creditScore"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="d-flex justify-content-end align-items-center mb-5 mt-4">
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

export default UpdateUser;
