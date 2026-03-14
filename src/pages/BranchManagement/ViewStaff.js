import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  getRoleListServ,
  deleteAdminServ,
  getAdminListServ,
  addAdminServ,
  updateAdminServ,
} from "../../services/commandCenter.services";
import {
  getBranchListServ,
  handleDeleteBranchServ,
  handleCreateBranchServ,
  handleUpdateBranchServ,
} from "../../services/branch.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../../components/NoDataScreen";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from "moment";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
function ViewStaff() {
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const [showSkelton, setShowSkelton] = useState(false);
  const [showStatsSkelton, setShowStatsSkelton] = useState(false);
  const [payload, setPayload] = useState({
    searchKey: "",
    pageNo: 1,
    pageCount: 20,
    status: "",
    branch: params?.id,
    role: "",
  });
  const [documentCount, setDocumentCount] = useState();
  const getListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }

    try {
      let response = await getAdminListServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
        setDocumentCount(response?.data?.documentCount);
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };

  useEffect(() => {
    getListFunc();
  }, [payload]);
  const [addFormData, setAddFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    branch: params?.id,
    status: "",
    profilePic: "",
    show: false,
  });
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    password: "",
    role: "",
    branch: params?.id,
    status: "",
    profilePic: "",
    _id: "",
  });
  const renderProfile = (status) => {
    if (status) {
      return (
        <span className="status-badge bg-success-subtle text-success">
          Active
        </span>
      );
    } else {
      return (
        <span className="status-badge bg-danger-subtle text-danger">
          Inactive
        </span>
      );
    }
  };
  const staticsData = [
    {
      label: "Total Staff",
      icon: "bi bi-diagram-3",
      count: documentCount?.totalCount,

      iconColor: "#010a2d",
    },
    {
      label: "Active Staff",
      icon: "bi bi-diagram-3",
      count: documentCount?.activeCount,

      iconColor: "green",
    },
    {
      label: "Inactive Staff",
      icon: "bi bi-diagram-3",
      count: documentCount?.inactiveCount,

      iconColor: "red",
    },
  ];
  const handleDeleteFunc = async (id) => {
    try {
      let response = await deleteAdminServ(deleteId);
      if (response?.data?.statusCode == "200") {
        getListFunc();
        toast.success(response?.data?.message);
        setShowConfirm(false);
        setDeleteId("");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const AdminSchema = Yup.object().shape({
    firstName: Yup.string().trim().required("First Name is required"),
    lastName: Yup.string().trim().required("Last Name is required"),
    phone: Yup.string().trim()
      .matches(/^[0-9]{10}$/, "Must be a valid 10-digit number")
      .required("Contact Number is required"),
    status: Yup.string().trim().required("Status is required"),
    branch: Yup.string().trim(),
    email: Yup.string().trim().email("Invalid email").required("Email is required"),
    profilePic: Yup.mixed(),
  });
  const handleAddAdmin = async (value) => {
    try {
      let finalPayload = { ...value };
      if (!finalPayload.branch) {
        delete finalPayload.branch;
      }

      let response = await addAdminServ(finalPayload);

      if (response?.data?.statusCode == "200") {
        setAddFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          role: "",
          branch: "",
          status: "",
          profilePic: "",
          show: false,
        });
        toast.success(response?.data?.message);
        getListFunc();
      } else {
        toast?.error("Something went wrong!");
      }
    } catch (error) {
      toast?.error("Internal Server Error!");
    }
  };

  const handleUpdateAdmin = async (value) => {
    try {
      let response = await updateAdminServ({
        ...value,
        _id: editFormData?._id,
      });
      if (response?.data?.statusCode == "200") {
        setEditFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          role: "",
          branch: "",
          status: "",
          profilePic: "",
          _id: "",
        });
        toast.success(response?.data?.message);
        getListFunc();
      } else {
        toast?.error("Something went wrong!");
      }
    } catch (error) {
      toast?.error("Internal Server Error!");
    }
  };
  const [branchList, setBranchList] = useState();
  const getBranchListFunc = async () => {
    try {
      let response = await getBranchListServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setBranchList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBranchListFunc();
  }, []);
  const [roleList, setRoleList] = useState();
  const getRoleListFunc = async () => {
    try {
      let response = await getRoleListServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setRoleList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getRoleListFunc();
  }, []);
  return (
    <div className="container-fluid user-table py-3">
      {/* KPIs */}
      <div className="row g-3">
        {/* Loan Applications */}
        {showSkelton
          ? [1, 2, 3]?.map((v, i) => {
              return (
                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="card-soft p-2 kpi">
                    <div className="d-flex justify-content-between align-items-center">
                      <Skeleton height={50} width={50} />
                      <div className="card-soft-content">
                        <div className="text-uppercase small">
                          <Skeleton height={20} width={100} />
                        </div>
                        <div className="value">
                          <Skeleton height={30} width={150} />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          : staticsData?.map((v, i) => {
              return (
                <div className="col-12 col-sm-6 col-lg-4">
                  <div className="card-soft p-3 kpi">
                    <div className="d-flex justify-content-between align-items-center">
                      <span
                        className="icon"
                        style={{ background: "#f4f6ff", color: v?.iconColor }}
                      >
                        <i className={v?.icon} />
                      </span>
                      <div className="card-soft-content">
                        <div className="text-uppercase small">{v.label}</div>
                        <div className="value">{v?.count}</div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center my-4">
        <h4 className="mb-0">Staff /Agent of {list[0]?.branch?.name}</h4>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center px-2 user-search">
            <form className="input-group search ms-2 d-none d-md-flex">
              <span className="input-group-text input-span">
                <i className="bi bi-search" />
              </span>
              <input
                type="search"
                className="form-control search-input"
                placeholder="Name, email, Phone Number..."
                value={payload?.searchKey}
                onChange={(e) =>
                  setPayload({ ...payload, searchKey: e?.target?.value })
                }
              />
            </form>
          </div>
          <div className="dropdown me-2">
            <button
              className="btn btn-light dropdown-toggle border height37"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                width: "180px",
                fontSize: "14px",
              }}
            >
              {payload?.role
                ? roleList?.find((b) => b?._id === payload?.role)?.name
                : "Select Role"}
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, role: "" })}
                >
                  Select Role
                </button>
              </li>
              {roleList?.map((v, i) => {
                return (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() => setPayload({ ...payload, role: v?._id })}
                    >
                      {v?.name}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>

          <div className="dropdown me-2">
            <button
              className="btn btn-light dropdown-toggle border height37"
              type="button"
              data-bs-toggle="dropdown"
              aria-expanded="false"
              style={{
                width: "150px",
                fontSize: "14px",
              }}
            >
              {payload?.status == "true"
                ? "Active"
                : payload?.status == "false"
                ? "Inactive"
                : "Select Status"}
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, status: "" })}
                >
                  Select Status
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, status: "true" })}
                >
                  Active
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, status: "false" })}
                >
                  Inactive
                </button>
              </li>
            </ul>
          </div>

          <button
            className="btn  bgThemePrimary shadow-sm"
            onClick={() => setAddFormData({ ...addFormData, show: true })}
          >
            + Add Agent
          </button>
        </div>
      </div>
      {/* Table Card */}
      <div className="card shadow-sm border-0">
        <div className="card-body p-0">
          <div className="table-responsive">
            <table
              id="usersTable"
              className="table table-hover align-middle mb-0"
            >
              <thead className="table-light">
                <tr>
                  <th className="text-center">Sr No.</th>
                  <th>Profile</th>
                  <th>Name</th>

                  <th>Email/Phone</th>
                  <th className="text-center">Role</th>
                  <th className="text-center">Status</th>

                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {showSkelton
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td className="text-center">
                            <Skeleton width={100} />
                          </td>

                          <td>
                            <Skeleton width={100} />
                          </td>

                          <td>
                            <Skeleton width={100} />
                          </td>
                          <td>
                            <Skeleton width={100} />
                          </td>
                          <td className="text-center">
                            <Skeleton width={100} />
                          </td>
                          <td className="text-center">
                            <Skeleton width={100} />
                          </td>

                          <td className="text-center">
                            <Skeleton width={100} />
                          </td>
                        </tr>
                      );
                    })
                  : list?.map((v, i) => {
                      return (
                        <tr>
                          <td className="text-center">
                            {i + 1 + (payload?.pageNo - 1) * payload?.pageCount}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  v?.profilePic ||
                                  "https://cdn-icons-png.flaticon.com/128/149/149071.png"
                                }
                                alt="User"
                                className="rounded-circle me-2"
                                width={40}
                                height={40}
                              />
                            </div>
                          </td>

                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <h6
                                  className="mb-0"
                                  style={{ fontSize: "14px" }}
                                >
                                  {v?.firstName + " " + v?.lastName}
                                </h6>
                                <small className="text-muted">
                                  ID: {v?.code || "N/A"}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div>{v?.email}</div>
                              <small className="text-muted">{v?.phone}</small>
                            </div>
                          </td>
                          <td className="text-center">{v?.role?.name}</td>
                          <td className="text-center">
                            {renderProfile(v?.status)}
                          </td>

                          <td style={{ textAlign: "center" }}>
                            <a
                              onClick={() =>
                                setEditFormData({
                                  firstName: v?.firstName,
                                  lastName: v?.lastName,
                                  email: v?.email,
                                  phone: v?.phone,
                                  password: v?.password,
                                  role: v?.role?._id,
                                  branch: v?.branch?._id,
                                  status: v?.status,
                                  profilePic: v?.profilePic,
                                  _id: v?._id,
                                })
                              }
                              className="text-primary text-decoration-underline me-2"
                            >
                              <i class="bi bi-pencil fs-6"></i>
                            </a>
                            <a
                              onClick={() => {
                                setDeleteId(v?._id);
                                setShowConfirm(true);
                              }}
                              className="text-danger text-decoration-underline"
                            >
                              <i class="bi bi-trash fs-6"></i>
                            </a>
                          </td>
                        </tr>
                      );
                    })}
              </tbody>
            </table>
            {list?.length == 0 && !showSkelton && <NoDataScreen />}
            <Pagination
              payload={payload}
              setPayload={setPayload}
              totalCount={documentCount?.totalCount || 0}
            />
          </div>
        </div>
      </div>
      {addFormData?.show && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "8px",

                width: "700px",
              }}
            >
              <div className="modal-body">
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100"
                >
                  <div className="w-100 px-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="">Add Staff</h5>
                      <img
                        onClick={() =>
                          setAddFormData({
                            firstName: "",
                            lastName: "",
                            email: "",
                            phone: "",
                            profilePic: "",
                            status: "",
                            branch: "",
                            role: "",
                            show: false,
                          })
                        }
                        src="https://cdn-icons-png.flaticon.com/128/2734/2734822.png"
                        style={{ height: "20px", cursor: "pointer" }}
                      />
                    </div>

                    {/* ✅ Formik Form Start */}
                    <Formik
                      initialValues={{
                        firstName: "",
                        lastName: "",
                        email: "",
                        phone: "",
                        profilePic: "",
                        status: "",
                        branch: "",
                        role: "",
                      }}
                      validationSchema={AdminSchema}
                      
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          await handleAddAdmin(values);;
                        } catch (error) {
                          console.error("Add failed", error);
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                    >
                      {({ setFieldValue, isSubmitting, values }) => (
                        <Form>
                          <div className="row">
                            <div className="col-12 row  p-0 m-0">
                              <div className="col-md-3 text-center my-auto">
                                <input
                                  type="file"
                                  id="profilePic"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  onChange={(e) =>
                                    setFieldValue(
                                      "profilePic",
                                      e.target.files[0]
                                    )
                                  }
                                />
                                <label
                                  htmlFor="profilePic"
                                  className="cursor-pointer"
                                >
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
                                <small>Upload Profile Pic</small>
                                <ErrorMessage
                                  name="profilePic"
                                  component="div"
                                  className="text-danger small"
                                />
                              </div>
                              <div className="col-9 row  p-0 m-0">
                                <div className="col-6">
                                  <label className="mt-3">
                                    First Name
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    type="text"
                                    name="firstName"
                                  />
                                  <ErrorMessage
                                    name="firstName"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                                <div className="col-6">
                                  <label className="mt-3">
                                    Last Name
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    type="text"
                                    name="lastName"
                                  />
                                  <ErrorMessage
                                    name="lastName"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                                <div className="col-6">
                                  <label className="mt-3">
                                    Phone
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    type="text"
                                    name="phone"
                                  />
                                  <ErrorMessage
                                    name="phone"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                                <div className="col-6">
                                  <label className="mt-3">
                                    Email
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    type="text"
                                    name="email"
                                  />
                                  <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Status */}

                            <div className="col-6">
                              <label className="mt-3">
                                Role<span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className="form-control"
                                name="role"
                              >
                                <option value="">Select Status</option>
                                {roleList?.map((v, i) => {
                                  return (
                                    <option value={v?._id}>{v?.name}</option>
                                  );
                                })}
                              </Field>
                              <ErrorMessage
                                name="role"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="col-6">
                              <label className="mt-3">
                                Branch<span className="text-danger"></span>
                              </label>
                              <input
                                className="form-control"
                                type="text"
                                value={list[0]?.branch?.name}
                                style={{background:"whitesmoke"}}
                              />
                            </div>
                            <div className="col-12">
                              <label className="mt-3">
                                Status<span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className="form-control"
                                name="status"
                              >
                                <option value="">Select Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                              </Field>
                              <ErrorMessage
                                name="status"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>

                          {/* Submit */}
                          <button
                            className="btn bgThemePrimary w-100 mt-3"
                            type="submit"
                            disabled={isSubmitting}
                          >
                            {isSubmitting ? "Submitting..." : "Submit"}
                          </button>
                        </Form>
                      )}
                    </Formik>
                    {/* ✅ Formik Form End */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {addFormData?.show && <div className="modal-backdrop fade show"></div>}
      {editFormData?._id && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "8px",
                width: "700px",
              }}
            >
              <div className="modal-body">
                <div
                  style={{
                    wordWrap: "break-word",
                    whiteSpace: "pre-wrap",
                  }}
                  className="d-flex justify-content-center w-100"
                >
                  <div className="w-100 px-2">
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 className="">Update Staff</h5>
                      <img
                        onClick={() =>
                          setEditFormData({
                            show: false,
                            firstName: "",
                            lastName: "",
                            email: "",
                            phone: "",
                            profilePic: "",
                            status: "",
                            branch: "",
                            role: "",
                          })
                        }
                        src="https://cdn-icons-png.flaticon.com/128/2734/2734822.png"
                        style={{ height: "20px", cursor: "pointer" }}
                      />
                    </div>

                    {/* ✅ Formik Form Start */}
                    <Formik
                      initialValues={{
                        firstName: editFormData?.firstName || "",
                        lastName: editFormData?.lastName || "",
                        email: editFormData?.email || "",
                        phone: editFormData?.phone || "",
                        profilePic: editFormData?.profilePic || "",
                        status: editFormData?.status?.toString() || "",
                        branch: editFormData?.branch || "",
                        role: editFormData?.role || "",
                      }}
                      validationSchema={AdminSchema}
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          await handleUpdateAdmin(values);;
                        } catch (error) {
                          console.error("Add failed", error);
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                      enableReinitialize
                    >
                      {({ setFieldValue, isSubmitting, values, dirty }) => (
                        <Form>
                          <div className="row">
                            <div className="col-12 row p-0 m-0">
                              <div className="col-md-3 text-center my-auto">
                                <input
                                  type="file"
                                  id="profilePic"
                                  accept="image/*"
                                  style={{ display: "none" }}
                                  onChange={(e) =>
                                    setFieldValue(
                                      "profilePic",
                                      e.target.files[0]
                                    )
                                  }
                                />
                                <label
                                  htmlFor="profilePic"
                                  className="cursor-pointer"
                                >
                                  <img
                                    src={
                                      values.profilePic
                                        ? typeof values.profilePic === "string"
                                          ? values.profilePic
                                          : URL.createObjectURL(
                                              values.profilePic
                                            )
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
                                <small>Upload Profile Pic</small>
                                <ErrorMessage
                                  name="profilePic"
                                  component="div"
                                  className="text-danger small"
                                />
                              </div>
                              <div className="col-9 row p-0 m-0">
                                <div className="col-6">
                                  <label className="mt-3">
                                    First Name{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    type="text"
                                    name="firstName"
                                  />
                                  <ErrorMessage
                                    name="firstName"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                                <div className="col-6">
                                  <label className="mt-3">
                                    Last Name{" "}
                                    <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    type="text"
                                    name="lastName"
                                  />
                                  <ErrorMessage
                                    name="lastName"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                                <div className="col-6">
                                  <label className="mt-3">
                                    Phone <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    type="text"
                                    name="phone"
                                  />
                                  <ErrorMessage
                                    name="phone"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                                <div className="col-6">
                                  <label className="mt-3">
                                    Email <span className="text-danger">*</span>
                                  </label>
                                  <Field
                                    className="form-control"
                                    type="text"
                                    name="email"
                                  />
                                  <ErrorMessage
                                    name="email"
                                    component="div"
                                    className="text-danger"
                                  />
                                </div>
                              </div>
                            </div>

                            {/* Role */}
                            <div className="col-6">
                              <label className="mt-3">
                                Role <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className="form-control"
                                name="role"
                              >
                                <option value="">Select Role</option>
                                {roleList?.map((v, i) => (
                                  <option key={i} value={v?._id}>
                                    {v?.name}
                                  </option>
                                ))}
                              </Field>
                              <ErrorMessage
                                name="role"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* Branch */}
                            <div className="col-6">
                              <label className="mt-3">Branch</label>
                              <input
                                className="form-control"
                                type="text"
                                value={list[0]?.branch?.name}
                                style={{background:"whitesmoke"}}
                              />
                             
                            </div>

                            {/* Status */}
                            <div className="col-12">
                              <label className="mt-3">
                                Status <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className="form-control"
                                name="status"
                              >
                                <option value="">Select Status</option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                              </Field>
                              <ErrorMessage
                                name="status"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>

                          {/* Submit */}
                          <button
                            className="btn bgThemePrimary w-100 mt-3"
                            type="submit"
                            disabled={isSubmitting || !dirty}
                          >
                            {isSubmitting ? "Updating..." : "Update"}
                          </button>
                        </Form>
                      )}
                    </Formik>
                    {/* ✅ Formik Form End */}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {editFormData?._id && <div className="modal-backdrop fade show"></div>}

      <ConfirmDeleteModal
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteFunc}
        title="Agent Delete"
        body="Do you really want to delete this agent?"
      />
    </div>
  );
}

export default ViewStaff;
