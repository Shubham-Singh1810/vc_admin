import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import {
  getRoleDetailServ,
  updatePasswordServ,
} from "../../services/commandCenter.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { useGlobalState } from "../../GlobalProvider";
import LogoutConfirmationModal from "../../components/LogoutConfirmationModal";
function Permissions() {
  const params = useParams();
  const navigate = useNavigate();
  const [showConfirm, setShowConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const { globalState, setGlobalState } = useGlobalState();
  const adminId = globalState?.user?._id;
  console.log("admin", globalState?.user?._id)
  const role = globalState?.user?.role;
  const [rolePermissions, setRolePermissions] = useState({});
  const [openSections, setOpenSections] = useState({});
  const [roleName, setRoleName] = useState("");
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(true);
  const [submitLoader, setSubmitLoader] = useState(false);

  const navItemsPermissions = [
    {
      title: "Dashboard",
      list: [
        {
          menu: "Dashboard",
          permissions: ["View"],
        },
        {
          menu: "Analytics",
          permissions: ["View"],
        },
      ],
    },
    {
      title: "Branch Management",
      list: [
        {
          menu: "Branches",
          permissions: ["View", "Create", "Edit", "Delete"],
        },
      ],
    },
    {
      title: "Command Center",
      list: [
        {
          menu: "Staff/Agent",
          permissions: ["View", "Create", "Edit", "Delete"],
        },
        {
          menu: "Role Management",
          subMenu: [
            {
              name: "Roles",
              permissions: ["View", "Edit", "Delete"],
            },
            {
              name: "Assign Role",
              permissions: ["Create"],
            },
          ],
        },
      ],
    },
    {
      title: "User Management",
      list: [
        {
          menu: "Users",
          permissions: ["View", "Create", "Edit", "Delete"],
        },
      ],
    },
    {
      title: "Loan Management",
      list: [
        {
          menu: "Loans",
          permissions: ["View", "Create", "Edit", "Delete"],
        },
      ],
    },
    {
      title: "Fund Management",
      list: [
        {
          menu: "Transactions",
          subMenu: [
            {
              name: "Deposit List",
              permissions: ["View", "Edit", "Delete"],
            },
            {
              name: "Withdraw List",
              permissions: ["View", "Edit", "Delete"],
            },
          ],
        },
      ],
    },
    {
      title: "System Management",
      list: [
        {
          menu: "Loan Type",
          permissions: ["View", "Create", "Edit", "Delete"],
        },
        {
          menu: "Policies",
          subMenu: [
            {
              name: "Terms & Condition",
              permissions: ["View", "Edit"],
            },
            {
              name: "Privacy Policy",
              permissions: ["View", "Edit"],
            },
            {
              name: "Cookie Policy",
              permissions: ["View", "Edit"],
            },
          ],
        },
        {
          menu: "Notify",
          permissions: ["View", "Create", "Edit", "Delete"],
        },
        {
          menu: "Documents",
          permissions: ["View", "Create", "Edit", "Delete"],
        },
      ],
    },
    {
      title: "Support Management",
      list: [
        {
          menu: "Contact Queries",
          permissions: ["View", "Update"],
        },
        {
          menu: "Tickets",
          subMenu: [
            {
              name: "All Ticket",
              permissions: ["View", "Edit", "Delete"],
            },
            {
              name: "Ticket Category",
              permissions: ["View", "Create", "Edit", "Delete"],
            },
            {
              name: "Open Ticket",
              permissions: ["View", "Edit"],
            },
            {
              name: "Closed Ticket",
              permissions: ["View", "Edit"],
            },
          ],
        },
        {
          menu: "FAQ'S",
          permissions: ["View", "Create", "Edit", "Delete"],
        },
      ],
    },
  ];

  // ✅ API call to load role details
  useEffect(() => {
    const fetchRole = async () => {
      try {
        let res = await getRoleDetailServ(role?._id);
        if (res?.data?.statusCode == "200") {
          const roleData = res?.data?.data;

          setRoleName(roleData?.name || "");
          setStatus(roleData?.status || "");

          // Convert ["Users-View", "Loans-Edit"] → { Users:["View"], Loans:["Edit"] }
          let perms = {};
          roleData?.permissions?.forEach((p) => {
            const [menu, perm] = p.split("-");
            if (!perms[menu]) perms[menu] = [];
            perms[menu].push(perm);
          });
          console.log(perms);
          setRolePermissions(perms);
        } else {
          toast.error("Failed to load role details");
        }
      } catch (err) {
        toast.error("Error fetching role details");
      } finally {
        setLoading(false);
      }
    };
    fetchRole();
  }, [params?.id]);

  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
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
    }else{
       tempErrors.newPassword =
        "";
    }
    if (newPassword != confirmPassword) {
      tempErrors.confirmPassword = "Passwords do not match.";
    }else{
      tempErrors.confirmPassword = "";
    }
    
    setErrors(tempErrors);
    if(tempErrors?.newPassword || tempErrors?.confirmPassword){
      return
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
    showOldPassword: false,
    showNewPassword: false,
    showConfirmPassword: false,
  });

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12 p-4">
          <div className="d-flex justify-content-between align-items-center mb-2">
            <h5 className="ms-1 mb-0">Admin Section</h5>
          </div>
          <div className="d-flex justify-content-between mb-4 mx-2">
            <b className="textThemePrimary">
              <u>Role & Permissions</u>
            </b>
            <div className="d-flex">
              <span
                className="status-badge bg-light-subtle text-secondary border cursor"
                onClick={() => navigate("/my-profile")}
              >
                Profile
              </span>
              <span
                className="status-badge bg-light-subtle text-secondary border cursor mx-3"
                onClick={() => setShowPasswordModal(true)}
              >
                Change Password
              </span>

              <span
                className="status-badge bg-danger-subtle text-secondary border cursor "
                  onClick={() => setShowConfirm(true)}
              >
                Logout
              </span>
            </div>
          </div>

          <div className="bg-white p-3 border my-1 rounded">
            <div className="d-flex mb-3">
              <div className="w-50 me-2">
                <label>Role Title</label>
                {loading ? (
                  <Skeleton height={45} />
                ) : (
                  <input
                    className="form-control"
                    placeholder="Enter role title"
                    value={roleName}
                    style={{ background: "whitesmoke" }}
                    //   onChange={(e) => setRoleName(e?.target?.value)}
                  />
                )}
              </div>
              <div className="w-50 ms-2">
                <label>Status</label>
                {loading ? (
                  <Skeleton height={45} />
                ) : (
                  <input
                    className="form-control"
                    placeholder="Enter role title"
                    value={status ? "Active" : "Inactive"}
                    style={{ background: "whitesmoke" }}
                    //   onChange={(e) => setRoleName(e?.target?.value)}
                  />
                )}
              </div>
            </div>

            {loading
              ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((v, i) => {
                  return (
                    <div className="mb-2">
                      <Skeleton height={40} />
                    </div>
                  );
                })
              : navItemsPermissions?.map((v, i) => (
                  <div key={i} className="mb-3 border rounded">
                    <div
                      className="d-flex justify-content-between align-items-center p-2 bg-light cursor-pointer"
                      onClick={() => toggleSection(v?.title)}
                    >
                      <div className="d-flex align-items-center">
                        <input
                          type="checkbox"
                          className="me-2"
                          checked={
                            rolePermissions[v?.title]?.includes("View") || false
                          }
                        />
                        <label className="fw-bold mb-0">{v?.title}</label>
                      </div>
                      <span>
                        {openSections[v?.title] ? (
                          <i className="bi bi-chevron-up" />
                        ) : (
                          <i className="bi bi-chevron-down" />
                        )}
                      </span>
                    </div>

                    {openSections[v?.title] && (
                      <div className="ms-2 p-2">
                        {v?.list?.map((value, j) => (
                          <div
                            key={j}
                            className="m-2 border-bottom p-2 rounded"
                          >
                            <label className="fw-semibold">{value?.menu}</label>
                            <div>
                              {value?.permissions?.map((perm) => (
                                <label key={perm} className="me-3">
                                  <input
                                    type="checkbox"
                                    className="me-1"
                                    checked={
                                      rolePermissions[value?.menu]?.includes(
                                        perm
                                      ) || false
                                    }
                                  />
                                  {perm}
                                </label>
                              ))}
                            </div>

                            {value?.subMenu?.map((submenu, k) => (
                              <div key={k} className="ms-2 mt-2">
                                <label>{submenu?.name}</label>
                                <div className="d-flex flex-wrap">
                                  {submenu?.permissions?.map((perm) => (
                                    <label key={perm} className="me-3">
                                      <input
                                        type="checkbox"
                                        className="me-1"
                                        checked={
                                          rolePermissions[
                                            submenu?.name
                                          ]?.includes(perm) || false
                                        }
                                      />
                                      {perm}
                                    </label>
                                  ))}
                                </div>
                              </div>
                            ))}
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
          </div>
        </div>
      </div>
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
                      setErrors({})
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
                      setErrors({})
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

export default Permissions;
