import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  loginServ,
  forgetPasswordServ,
} from "../../services/authentication.services";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useGlobalState } from "../../GlobalProvider";
import "./login.css";
function Login() {
  const { setGlobalState } = useGlobalState();
  const [showPassword, setShowPassword] = useState(false);

  const formik = useFormik({
    initialValues: {
      email: "",
      password: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().trim()
        .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email format")
        .required("Email is required"),
      password: Yup.string().trim().required("Password is required"),
    }),
    onSubmit: async (values, { setSubmitting }) => {
      setSubmitting(true);
      try {
        let deviceId = localStorage.getItem("deviceId");
        const response = await loginServ({ ...values, deviceId });
        if (response?.data?.statusCode == "200") {
          toast.success(response?.data?.message);
          localStorage.setItem(
            "token",
            JSON.stringify(response?.data?.data?.token)
          );
          localStorage.setItem("user", JSON.stringify(response?.data?.data));
          localStorage.setItem(
            "permissions",
            JSON.stringify(response?.data?.data?.permissions)
          );
          setGlobalState({
            token: response?.data?.data?.token,
            user: response?.data?.data,
            permissions: response?.data?.data?.permissions,
          });
        } else {
          toast.error(response?.data?.message);
        }
      } catch (error) {
        toast.error(error?.response?.data?.message);
      }
      setSubmitting(false);
    },
  });
  const forgetPasswordFunc = async () => {
    if (!formik.values.email) {
      toast.error("Please enter your email first");
      return;
    }

    // 🛑 Invalid email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
    if (!emailRegex.test(formik.values.email)) {
      toast.error("Please enter a valid email address");
      return;
    }
    try {
      let response = await forgetPasswordServ({ email: formik.values.email });
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  return (
    <div className="signin-container">
      <div className="signin-card">
        <img
          src="/assets/images/logo.jpeg"
          alt="Rupee Loan Logo"
          className="sign-logo"
        />
        <h2>Sign In</h2>
        <form onSubmit={formik.handleSubmit}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">
              Email Address
            </label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="bi bi-envelope" />
              </span>
              <input
                type="email"
                className="form-control"
                id="email"
                placeholder="Enter your email"
                required=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <small
                className="text-danger mb-2"
                style={{ marginTop: "-20px" }}
              >
                {formik.errors.email}
              </small>
            ) : null}
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label">
              Password
            </label>
            <div className="input-group">
              <span className="input-group-text">
                {/* <i className="bi bi-lock" /> */}
                <i
                  class={!showPassword ? " bi bi-lock" : " bi bi-unlock"}
                  style={{ cursor: "pointer" }}
                  onClick={() => setShowPassword(showPassword)}
                ></i>
              </span>
              <input
                type={!showPassword ? "password" : "text"}
                className="form-control"
                id="password"
                placeholder="Enter your password"
                required=""
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.password}
              />
            </div>
            {formik.touched.password && formik.errors.password ? (
              <small
                className="text-danger mb-2"
                style={{ marginTop: "-20px" }}
              >
                {formik.errors.password}
              </small>
            ) : null}
          </div>
          <div className="mb-3 text-end">
            <a
              onClick={() => forgetPasswordFunc()}
              className="forgot-password cursor"
            >
              Forgot Password?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn-gradient"
            disabled={formik.isSubmitting || !formik.isValid}
          >
            {formik.isSubmitting ? "Secure Login ..." : "Login"}
          </button>
        </form>
        {/* <div className="mt-4 text-center">
      Don't have an account? <a href="sign-up.html">Sign Up</a>
    </div> */}
      </div>
    </div>
  );
  return (
    <section className="login-wrapper loginPage">
      <div className="background-section">
        <img
          src="https://images.unsplash.com/photo-1450101499163-c8848c66ca85?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1920&q=80"
          alt="Financial Background"
        />
        <div className="background-overlay"></div>
      </div>

      <div className="floating-element"></div>
      <div className="floating-element"></div>
      <div className="floating-element"></div>

      <div className="login-container">
        <div className="login-card">
          <div className="login-header">
            <div className="brand-logo">
              <i className="fas fa-hand-holding-usd"></i>
            </div>
            <h1 className="login-title">NBFC Admin</h1>
            <p className="login-subtitle">Secure Access Portal</p>
          </div>

          <div className="login-body">
            <form onSubmit={formik.handleSubmit}>
              <div className="mb-3">
                <label for="email" className="form-label">
                  <i className="fas fa-envelope me-2"></i>Email Address
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i class="fas fa-envelope"></i>
                  </span>
                  <input
                    type="email"
                    class="form-control"
                    id="email"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.email}
                    placeHolder="admin@nbfc.com"
                  />
                </div>
                {formik.touched.email && formik.errors.email ? (
                  <small
                    className="text-danger mb-2"
                    style={{ marginTop: "-20px" }}
                  >
                    {formik.errors.email}
                  </small>
                ) : null}
              </div>

              <div className="mb-4">
                <label for="password" className="form-label">
                  <i className="fas fa-key me-2"></i>Password
                </label>
                <div className="input-group">
                  <span className="input-group-text">
                    <i
                      class={showPassword ? " fas fa-lock" : " fas fa-unlock"}
                      style={{ cursor: "pointer" }}
                      onClick={() => setShowPassword(!showPassword)}
                    ></i>
                  </span>
                  <input
                    type={showPassword ? "password" : "text"}
                    class="form-control"
                    id="password"
                    placeHolder="••••••••"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.password}
                  />
                </div>
                {formik.touched.password && formik.errors.password ? (
                  <small
                    className="text-danger mb-2"
                    style={{ marginTop: "-20px" }}
                  >
                    {formik.errors.password}
                  </small>
                ) : null}
                <div className="text-end mt-2">
                  <a
                    className="forgot-link"
                    style={{ cursor: "pointer" }}
                    onClick={() => toast.info("Coming Soon")}
                  >
                    Forgot password? <i className="fas fa-arrow-right ms-1"></i>
                  </a>
                </div>
              </div>

              <button
                type="submit"
                className="btn btn-login"
                disabled={formik.isSubmitting || !formik.isValid}
              >
                <i className="fas fa-sign-in-alt me-2"></i>{" "}
                {formik.isSubmitting ? "Secure Login ..." : "Secure Login"}
              </button>

              <div className="security-notice">
                <i className="fas fa-shield-alt"></i>
                <p>Your login is protected with advanced encryption</p>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Login;
