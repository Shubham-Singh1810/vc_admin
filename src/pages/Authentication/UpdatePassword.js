import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, useParams } from "react-router-dom";
import { resetPasswordServ } from "../../services/authentication.services";
import "./login.css";

function UpdatePassword() {
  const navigate = useNavigate();
  const { token } = useParams();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      password: "",
      confirmPassword: "",
    },
    validationSchema: Yup.object({
      password: Yup.string().trim()
        .min(8, "Password must be at least 8 characters")
        .required("Password is required"),

      confirmPassword: Yup.string().trim()
        .oneOf([Yup.ref("password"), null], "Passwords must match")
        .required("Confirm password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        const response = await resetPasswordServ(token, {
          password: values.password,
        });

        if (response?.data?.statusCode === 200) {
          toast.success(response?.data?.message);
          setTimeout(() => {
            navigate("/");
          }, 1500);
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message || "Link expired");
      }
      setSubmitting(false);
    },
  });

  return (
    <div className="signin-container">
      <div className="signin-card">
        <img
          src="/assets/images/logo.jpeg"
          alt="Rupee Loan Logo"
          className="sign-logo"
        />

        <h2>Update Password</h2>

        <form onSubmit={formik.handleSubmit}>
          {/* PASSWORD */}
          <div className="mb-3">
            <label className="form-label">New Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <i
                  className={showPassword ? "bi bi-unlock" : "bi bi-lock"}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(!showPassword)}
                ></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="password"
                placeholder="Enter new password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
            </div>
            {formik.touched.password && formik.errors.password && (
              <small className="text-danger">{formik.errors.password}</small>
            )}
          </div>

          {/* CONFIRM PASSWORD */}
          <div className="mb-3">
            <label className="form-label">Confirm Password</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-lock"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                name="confirmPassword"
                placeholder="Confirm new password"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.confirmPassword}
              />
            </div>
            {formik.touched.confirmPassword &&
              formik.errors.confirmPassword && (
                <small className="text-danger">
                  {formik.errors.confirmPassword}
                </small>
              )}
          </div>

          <div className="mb-3 text-end">
            <a
              onClick={() => navigate("/")}
              className="forgot-password cursor"
            >
              Login
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-gradient w-100"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default UpdatePassword;
