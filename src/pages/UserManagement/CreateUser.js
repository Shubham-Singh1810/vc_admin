import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import { createUserServ } from "../../services/user.service";
import { useGlobalState } from "../../GlobalProvider";
function CreateUser() {
  const { globalState } = useGlobalState();
  const navigate = useNavigate();

  // ✅ Validation Schema
  const userSchema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .required("First Name is required"),
    lastName: Yup.string()
      .trim()
      .required("Last Name is required"),
    email: Yup.string()
      .trim()
      .email("Invalid email")
      .required("Email is required"),
    countryCode: Yup.string().trim(),
    phone: Yup.string()
      .trim()
      .matches(/^[0-9]{10}$/, "Phone must be 10 digits")
      .required("Phone number is required"),
    
    // Date field par trim nahi lagta
    dob: Yup.date().required("Date of Birth is required"),
    
    gender: Yup.string()
      .trim()
      .required("Gender is required"),

    state: Yup.string()
      .trim()
      .required("State is required"),
    city: Yup.string()
      .trim()
      .required("City is required"),
    pincode: Yup.string()
      .trim()
      .matches(/^[0-9]{6}$/, "Pincode must be 6 digits")
      .required("Pincode is required"),
    address: Yup.string()
      .trim()
      .required("Address is required"),
    profilePic: Yup.mixed().required("Profile Picture is required"),
});

  const handleCreateUser = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        formData.append(key, values[key]);
      });
      formData.append("createdBy", globalState?.user?._id);
      formData.append("isUserApproved", false);
      let response = await createUserServ(formData);
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

  return (
    <div className="container-fluid">
      <div className="col-lg-12 p-4">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h5 className="ms-1 mb-0">Create New User</h5>
        </div>

        <Formik
          initialValues={{
            firstName: "",
            lastName: "",
            email: "",
            phone: "",
            countryCode: "+91",
            dob: "",
            gender: "",
            
            state: "",
            city: "",
            pincode: "",
            address: "",
            
            profilePic: "",
            
          }}
          validationSchema={userSchema}
          
          onSubmit={async (values, { setSubmitting }) => {
                        try {
                          await handleCreateUser(values);
                        } catch (error) {
                          console.error("Add failed", error);
                        } finally {
                          setSubmitting(false); 
                        }
                      }}
        >
          {({ setFieldValue, isSubmitting, values }) => (
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
                      onChange={(e) =>
                        setFieldValue("profilePic", e.target.files[0])
                      }
                    />
                    <label htmlFor="profilePic" className="cursor-pointer">
                      <img
                        src={
                          values.profilePic
                            ? URL.createObjectURL(values.profilePic)
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
                    <label className="form-label">First Name <span className="text-danger">*</span></label>
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
                    <label className="form-label">Last Name <span className="text-danger">*</span></label>
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
                    <label className="form-label">Email <span className="text-danger">*</span></label>
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
                    <label className="form-label">Phone <span className="text-danger">*</span></label>
                    <div className="input-group">
                      {/* Country Code Dropdown */}
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

                      {/* Phone Number Input */}
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
                    <label className="form-label">Date Of Birth <span className="text-danger">*</span></label>
                    <Field type="date" name="dob" className="form-control" />
                    <ErrorMessage
                      name="dob"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Gender <span className="text-danger">*</span></label>
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
                 
                </div>
              </div>

              {/* Address Details */}
              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Address Details</div>
                <div className="form-section-body row g-3">
                  <div className="col-md-4">
                    <label className="form-label">State <span className="text-danger">*</span></label>
                    <Field type="text" name="state" className="form-control" />
                    <ErrorMessage
                      name="state"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">City <span className="text-danger">*</span></label>
                    <Field type="text" name="city" className="form-control" />
                    <ErrorMessage
                      name="city"
                      component="div"
                      className="text-danger small"
                    />
                  </div>
                  <div className="col-md-4">
                    <label className="form-label">Pincode <span className="text-danger">*</span></label>
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
                    <label className="form-label">Address <span className="text-danger">*</span></label>
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

              

              

              {/* Submit Buttons */}
              <div className="d-flex justify-content-end align-items-center mb-5 mt-4">
                <button type="reset" className="btn btn-danger me-2">
                  Cancel
                </button>
                <button
                  className="btn bgThemePrimary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Submitting..." : "Save User"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>
    </div>
  );
}

export default CreateUser;
