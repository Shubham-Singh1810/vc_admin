import React, { useState, useEffect } from "react";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import "react-toastify/dist/ReactToastify.css";
import {
  getAdminProfileServ,
  updateAdminServ,
  updatePasswordServ,
} from "../../services/commandCenter.services";
import { useGlobalState } from "../../GlobalProvider";
import LogoutConfirmationModal from "../../components/LogoutConfirmationModal";

function Profile() {
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [initialValues, setInitialValues] = useState(null);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { globalState, setGlobalState } = useGlobalState();

  const adminId = globalState?.user?._id;

  // ✅ Validation Schema
  const userSchema = Yup.object().shape({
    firstName: Yup.string().trim().required("First Name is required"),
    lastName: Yup.string().trim().required("Last Name is required"),
    profilePic: Yup.mixed(),
  });

  // ✅ Fetch Profile Data
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        let response = await getAdminProfileServ(adminId);
        if (response?.data?.statusCode == "200") {
          setInitialValues({
            ...response?.data?.data,
            profilePic: "",
            profilePrev: response?.data?.data?.profilePic,
            role: response?.data?.data?.role?.name,
            branch: Array.isArray(response?.data?.data?.branch)
              ? response?.data?.data.branch.map((b) => b.name).join(", ")
              : "",
            status: response?.data?.data?.status ? "Active" : "Inactive",
          });
        } else {
          toast.error("Failed to fetch profile");
        }
      } catch (error) {
        console.error(error);
        toast.error(error?.response?.data?.message);
      }
    };
    fetchProfile();
  }, [adminId]);

  // ✅ Update Profile
  const updateAdminProfile = async (values) => {
    try {
      const formData = new FormData();
      formData.append("_id", adminId);
      formData.append("firstName", values?.firstName);
      formData.append("lastName", values?.lastName);
      if (values?.profilePrev) {
        formData.append("profilePic", values?.profilePic);
      }

      let response = await updateAdminServ(formData);
      if (response?.data?.statusCode == "200") {
        toast.success("Profile updated successfully");
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };

  const [errors, setErrors] = useState({});

  const passwordRegex =
    /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+[\]{}|;:,.<>?]).{8,}$/;
  const handleLogoutFunc = () => {
    setGlobalState({
      user: null,
      token: null,
      permissions: null,
    });
    toast.success("Admin logged out successfully");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    navigate("/");
  };
  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    const oldPassword = e.target.oldPassword.value;
    const newPassword = e.target.newPassword.value;
    const confirmPassword = e.target.confirmPassword.value;
    let tempErrors = {};

    if (!passwordRegex.test(newPassword)) {
      tempErrors.newPassword =
        "The Password must be atleast 8 characters including atleast 1 digit, 1 uppercase character, 1 lowercase character 1 special character";
    } else {
      tempErrors.newPassword = "";
    }
    if (newPassword != confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
    } else {
      tempErrors.confirmPassword = "";
    }

    setErrors(tempErrors);
    if (tempErrors?.newPassword || tempErrors?.confirmPassword) {
      return;
    }

    try {
      let response = await updatePasswordServ({
        _id: adminId,
        oldPassword,
        newPassword,
      });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setShowPasswordModal(false);
      } else {
        toast.error(response?.data?.message || "Failed to update password");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
  };
  const [passwordInputType, setPasswordInputType] = useState({
    showOldPassword: true,
    showNewPassword: true,
    showConfirmPassword: true,
  });
  return (
    <div className="container-fluid">
      <div className="col-lg-12 p-4">
        <div className="d-flex justify-content-between align-items-center mb-2">
          <h5 className="ms-1 mb-0">Admin Section</h5>
        </div>
        <div className="d-flex justify-content-between mb-4 mx-2">
          <b className="textThemePrimary">
            <u>Profile</u>
          </b>
          <div className="d-flex">
            <span
              className="status-badge bg-light-subtle text-secondary border cursor"
              onClick={() => setShowPasswordModal(true)}
            >
              Change Password
            </span>

            <span
              className="status-badge bg-light-subtle text-secondary mx-3 border cursor"
              onClick={() => navigate("/permissions")}
            >
              Permissions
            </span>
            <span
              className="status-badge bg-danger-subtle text-secondary border cursor"
              onClick={() => setShowConfirm(true)}
            >
              Logout
            </span>
          </div>
        </div>

        <Formik
          enableReinitialize
          initialValues={initialValues}
          validationSchema={userSchema}
          
           onSubmit={async (values, { setSubmitting }) => {
                        try {
                          await updateAdminProfile(values);
                        } catch (error) {
                          console.error("Add failed", error);
                        } finally {
                          setSubmitting(false); 
                        }
                      }}
        >
          {({ setFieldValue, isSubmitting, values }) => (
            <Form>
              <div className="form-section shadow-sm mb-3">
                <div className="form-section-header">Personal Details</div>
                <div className="form-section-body row g-3">
                  {/* Profile Pic */}
                  <div className="col-md-12 ">
                    <input
                      type="file"
                      id="profilePic"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => {
                        const file = e.target.files[0];
                        if (file) {
                          setFieldValue("profilePic", file); // form ke liye
                          setFieldValue(
                            "profilePrev",
                            URL.createObjectURL(file),
                          ); // 👈 preview ke liye
                        }
                      }}
                    />
                    <label htmlFor="profilePic" className="cursor-pointer">
                      <img
                        src={
                          values?.profilePrev ||
                          "https://cdn-icons-png.flaticon.com/512/847/847969.png"
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

                  {/* Editable Fields */}
                  <div className="col-md-6">
                    <label className="form-label">First Name</label>
                    <Field
                      type="text"
                      name="firstName"
                      className="form-control"
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Last Name</label>
                    <Field
                      type="text"
                      name="lastName"
                      className="form-control"
                    />
                  </div>

                  {/* Read-only Fields */}
                  <div className="col-md-6">
                    <label className="form-label">Email</label>
                    <Field
                      type="email"
                      name="email"
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Phone</label>
                    <Field
                      type="text"
                      name="phone"
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Role</label>
                    <Field
                      type="text"
                      name="role"
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Branch</label>
                    <Field
                      type="text"
                      name="branch"
                      className="form-control"
                      disabled
                    />
                  </div>
                  <div className="col-md-6">
                    <label className="form-label">Status</label>
                    <Field
                      type="text"
                      name="status"
                      className="form-control"
                      disabled
                    />
                  </div>
                </div>
              </div>

              {/* Buttons */}
              <div className="d-flex justify-content-end align-items-center mb-5 mt-4">
                <button
                  className="btn bgThemePrimary"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? "Updating..." : "Update Profile"}
                </button>
              </div>
            </Form>
          )}
        </Formik>
      </div>

      {/* Password Modal */}
      {showPasswordModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <form onSubmit={handlePasswordUpdate}>
                <div className="modal-header">
                  <h5 className="modal-title">Change Password</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordInputType({
                        showOldPassword: false,
                        showNewPassword: false,
                        showConfirmPassword: false,
                      });
                      setErrors({});
                    }}
                  ></button>
                </div>
                <div className="modal-body">
                  <div className="mb-3">
                    <label>Old Password</label>
                    <div className="d-flex align-items-center border rounded">
                      <input
                        type={
                          passwordInputType?.showOldPassword
                            ? "password"
                            : "text"
                        }
                        name="oldPassword"
                        className="form-control border-0 passwordInput"
                        required
                      />
                      <i
                        className={
                          "bi me-2 " +
                          (passwordInputType?.showOldPassword
                            ? " bi-eye-slash"
                            : " bi-eye")
                        }
                        onClick={() =>
                          setPasswordInputType({
                            ...passwordInputType,
                            showOldPassword:
                              !passwordInputType?.showOldPassword,
                          })
                        }
                      ></i>
                    </div>
                  </div>
                  <div className="mb-3">
                    <label>New Password</label>
                    <div className="d-flex align-items-center border rounded">
                      <input
                        type={
                          passwordInputType?.showNewPassword
                            ? "password"
                            : "text"
                        }
                        name="newPassword"
                        className="form-control border-0 passwordInput"
                        required
                      />
                      <i
                        className={
                          "bi me-2 " +
                          (passwordInputType?.showNewPassword
                            ? " bi-eye-slash"
                            : " bi-eye")
                        }
                        onClick={() =>
                          setPasswordInputType({
                            ...passwordInputType,
                            showNewPassword:
                              !passwordInputType?.showNewPassword,
                          })
                        }
                      ></i>
                    </div>
                    {errors.newPassword && (
                      <small className="text-danger">
                        {errors.newPassword}
                      </small>
                    )}
                  </div>
                  <div className="mb-3">
                    <label>Confirm Password</label>
                    <div className="d-flex align-items-center border rounded">
                      <input
                        type={
                          passwordInputType?.showConfirmPassword
                            ? "password"
                            : "text"
                        }
                        name="confirmPassword"
                        className="form-control border-0 passwordInput"
                        required
                      />
                      <i
                        className={
                          "bi me-2 " +
                          (passwordInputType?.showConfirmPassword
                            ? " bi-eye-slash"
                            : " bi-eye")
                        }
                        onClick={() =>
                          setPasswordInputType({
                            ...passwordInputType,
                            showConfirmPassword:
                              !passwordInputType?.showConfirmPassword,
                          })
                        }
                      ></i>
                    </div>
                    {errors.confirmPassword && (
                      <small className="text-danger">
                        {errors.confirmPassword}
                      </small>
                    )}
                  </div>
                </div>
                <div className="modal-footer">
                  <button
                    type="button"
                    className="btn btn-danger"
                    onClick={() => {
                      setShowPasswordModal(false);
                      setPasswordInputType({
                        showOldPassword: false,
                        showNewPassword: false,
                        showConfirmPassword: false,
                      });
                      setErrors({});
                    }}
                  >
                    Cancel
                  </button>
                  <button type="submit" className="btn bgThemePrimary">
                    Update Password
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
      {showPasswordModal && <div className="modal-backdrop fade show"></div>}
      <LogoutConfirmationModal
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleLogoutFunc}
        title="Logout"
        body="Are you sure you want to logout?"
      />
    </div>
  );
}

export default Profile;
