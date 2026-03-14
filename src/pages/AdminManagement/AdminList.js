import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getRoleListServ,
  deleteAdminServ,
  getAdminListServ,
  addAdminServ,
  updateAdminServ,
} from "../../services/commandCenter.services";
import * as XLSX from "xlsx";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../../components/NoDataScreen";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from "moment";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { useGlobalState } from "../../GlobalProvider";
import { MultiSelect } from "react-multi-select-component";
function AdminList() {
  const { globalState } = useGlobalState();
  const permissions = globalState?.user?.role?.permissions || [];
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [showSkelton, setShowSkelton] = useState(false);
  const [showStatsSkelton, setShowStatsSkelton] = useState(false);
  const [payload, setPayload] = useState({
    searchKey: "",
    pageNo: 1,
    pageCount: 20,
    status: "",
    role: "",
  });
  const [documentCount, setDocumentCount] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const getListFunc = async () => {
    setFilterPayload({ ...filterPayload, show: false });
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
      toast.error(error?.response?.data?.error);
    }
  };
 const AdminSchema = Yup.object().shape({
  firstName: Yup.string()
    .trim()
    .required("First Name is required"),
  lastName: Yup.string()
    .trim()
    .required("Last Name is required"),
  phone: Yup.string()
    .trim()
    .matches(/^[0-9]{10}$/, "Must be a valid 10-digit number")
    .required("Contact Number is required"),
  status: Yup.string()
    .trim()
    .required("Status is required"),
  role: Yup.string()
    .trim()
    .required("Role is required"),
  
  email: Yup.string()
    .trim()
    .matches(/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/, "Invalid email format")
    .required("Email is required"),
  profilePic: Yup.mixed(),
});
  const handleAddAdmin = async (values, setSubmitting) => {
    try {
      
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
         if (key === "profilePic") {
          if (values.profilePic instanceof File) {
            formData.append("profilePic", values.profilePic);
          }
        } else {
          formData.append(key, values[key]);
        }
      });
      const response = await addAdminServ(formData);

      if (response?.data?.statusCode === 200) {
        toast.success(response?.data?.message || "Staff created successfully!");
        setAddFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          role: "",
         
          status: "",
          profilePic: "",
          show: false,
        });

        getListFunc();
      } else {
        toast.error(response?.data?.message || "Something went wrong!");
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message);
    }
    finally {
      setSubmitting(false);
    }
  };

  const handleUpdateAdmin = async (values, setSubmitting) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "profilePic") {
          if (values.profilePic instanceof File) {
            formData.append("profilePic", values.profilePic);
          }
        } else {
          formData.append(key, values[key]);
        }
      });
      formData.append("_id", editFormData?._id);
      let response = await updateAdminServ(formData);
      if (response?.data?.statusCode == "200") {
        setEditFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          password: "",
          role: "",
         
          status: "",
          profilePic: "",
          _id: "",
        });
        toast.success(response?.data?.message);
        getListFunc();
      } else {
        toast?.error(response?.data?.message);
      }
    } catch (error) {
      toast?.error(error?.response?.data?.message);
    } finally {
      setSubmitting(false);
    }
  };
 
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
  const [filterPayload, setFilterPayload] = useState({
    show: false,
    searchKey: "",
    status: "",
    role: "",
  });

  const exportToCSV = () => {
    if (!list.length) return toast.error("No data to export");

    const headers = ["Name", "Email", "Phone", "Role", "Status"];

    const rows = list.map((v) => [
      `${v.firstName || ""} ${v.lastName || ""}`,
      v.email || "",
      v.phone || "",
      v.role?.name || "",
      v.status ? "Active" : "Inactive",
    ]);

    const csv =
      headers.join(",") + "\n" + rows.map((r) => r.join(",")).join("\n");

    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "Staff_List.csv";
    link.click();
  };

  // ---------------- EXPORT EXCEL ----------------
  const exportToExcel = () => {
    if (!list.length) return toast.error("No data to export");

    const excelData = list.map((v) => ({
      Name: `${v.firstName || ""} ${v.lastName || ""}`,
      Email: v.email || "",
      Phone: v.phone || "",
      Role: v.role?.name || "",
      Status: v.status ? "Active" : "Inactive",
      
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Admins");

    XLSX.writeFile(workbook, "Staff_List.xlsx");
  };
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
        <h4 className="mb-0">Staff /Agent</h4>
        <div className="d-flex align-items-center">
          <div className="dropdown me-3">
            <button
              className="btn btn-secondary dropdown-toggle shadow-sm"
              type="button"
              data-bs-toggle="dropdown"
              style={{ width: "170px" }}
            >
              Export
            </button>

            <ul className="dropdown-menu">
              <li>
                <button className="dropdown-item" onClick={exportToCSV}>
                  📄 Export as CSV
                </button>
              </li>
              <li>
                <button className="dropdown-item" onClick={exportToExcel}>
                  📊 Export as Excel
                </button>
              </li>
            </ul>
          </div>
          {filterPayload.status ||
          filterPayload.searchKey ||
          filterPayload.role ? (
            <div className="d-flex flex-wrap gap-2 my-3">
              {filterPayload.searchKey && (
                <span className="badge bg-primary d-flex align-items-center">
                  Search: {filterPayload.searchKey}
                  <i
                    className="bi bi-x ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setFilterPayload({ ...filterPayload, searchKey: "" });
                      setPayload({ ...payload, searchKey: "" });
                    }}
                  />
                </span>
              )}
              {filterPayload.status && (
                <span className="badge bg-primary d-flex align-items-center">
                  Status: {filterPayload.status ? "Active" : "Inactive"}
                  <i
                    className="bi bi-x ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setFilterPayload({ ...filterPayload, status: "" });
                      setPayload({ ...payload, status: "" });
                    }}
                  />
                </span>
              )}

              
              {filterPayload.role && (
                <span className="badge bg-info d-flex align-items-center">
                  Role:{" "}
                  {roleList.find((b) => b._id === filterPayload.role)?.name}
                  <i
                    className="bi bi-x ms-2"
                    style={{ cursor: "pointer" }}
                    onClick={() => {
                      setFilterPayload({ ...filterPayload, role: "" });
                      setPayload({ ...payload, role: "" });
                    }}
                  />
                </span>
              )}

              <button
                className="btn btn-sm btn-outline-danger ms-2"
                onClick={() => {
                  const reset = {
                    show: false,
                    status: "",
                   
                    searchKey: "",
                    role: "",
                  };
                  setFilterPayload(reset);
                  setPayload({ ...payload, ...reset });
                }}
              >
                Clear All
              </button>
            </div>
          ) : (
            <button
              className="btn btn-light shadow-sm  px-3"
              onClick={() => setFilterPayload({ ...filterPayload, show: true })}
            >
              Filter <i className="bi bi-filter ms-2" />
            </button>
          )}
          {permissions?.includes("Staff/Agent-Create") && (
            <button
              className="btn  bgThemePrimary shadow-sm ms-3"
              onClick={() => setAddFormData({ ...addFormData, show: true })}
            >
              + Add Agent
            </button>
          )}
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
                          
                          {(permissions?.includes("Staff/Agent-Edit") ||
                            permissions?.includes("Staff/Agent-Delete")) && (
                            <td className="text-center">
                              <Skeleton width={100} />
                            </td>
                          )}
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
                            {permissions?.includes("Staff/Agent-Edit") && (
                              <a
                                onClick={() =>
                                  setEditFormData({
                                    firstName: v?.firstName,
                                    lastName: v?.lastName,
                                    email: v?.email,
                                    phone: v?.phone,
                                    password: v?.password,
                                    role: v?.role?._id,
                                    
                                    status: v?.status,
                                    profilePic: v?.profilePic,
                                    _id: v?._id,
                                  })
                                }
                                className="text-primary text-decoration-underline me-2"
                              >
                                <i class="bi bi-pencil fs-6"></i>
                              </a>
                            )}
                            {permissions?.includes("Staff/Agent-Delete") && (
                              <a
                                onClick={() => {
                                  setDeleteId(v?._id);
                                  setShowConfirm(true);
                                }}
                                className="text-danger text-decoration-underline"
                              >
                                <i class="bi bi-trash fs-6"></i>
                              </a>
                            )}
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
                        
                        role: "",
                      }}
                      validationSchema={AdminSchema}
                     
                      onSubmit={(values, { setSubmitting }) => {
                        handleAddAdmin(values, setSubmitting);
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
                                      e.target.files[0],
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
                        
                        role: editFormData?.role || "",
                      }}
                      validationSchema={AdminSchema}
                      onSubmit={(values, { setSubmitting }) => {
                        handleUpdateAdmin(values, setSubmitting);
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
                                      e.target.files[0],
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
                                              values.profilePic,
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

                           

                            {/* Status */}
                            <div className="col-6">
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
      {filterPayload?.show && (
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
                      <h5 className="">Filter</h5>
                      <img
                        onClick={() =>
                          setFilterPayload({ ...filterPayload, show: false })
                        }
                        src="https://cdn-icons-png.flaticon.com/128/2734/2734822.png"
                        style={{ height: "20px", cursor: "pointer" }}
                      />
                    </div>
                    <div className="row">
                      <div className="col-6 mb-2">
                        <label>Search</label>
                        <input
                          type="search"
                          className="form-control search-input"
                          placeholder="Name, email, Phone Number..."
                          value={filterPayload?.searchKey}
                          onChange={(e) =>
                            setFilterPayload({
                              ...filterPayload,
                              searchKey: e?.target?.value,
                            })
                          }
                        />
                      </div>
                      <div className="col-6 mb-2">
                        <label>Status</label>
                        <select
                          className="form-control"
                          onChange={(e) =>
                            setFilterPayload({
                              ...filterPayload,
                              status: e?.target?.value,
                            })
                          }
                        >
                          <option value="">Select</option>
                          <option value={true}>Active</option>
                          <option value={false}>Inactive</option>
                        </select>
                      </div>

                   
                      <div className="col-6 mb-2">
                        <label>Role</label>
                        <select
                          className="form-control"
                          onChange={(e) =>
                            setFilterPayload({
                              ...filterPayload,
                              role: e?.target?.value,
                            })
                          }
                        >
                          <option value="">Select</option>

                          {roleList?.map((v, i) => {
                            return <option value={v?._id}>{v?.name}</option>;
                          })}
                        </select>
                      </div>

                      <div className="d-flex justify-content-end">
                        <button
                          className="btn btn-danger me-2"
                          onClick={() =>
                            setFilterPayload({
                              show: false,
                              status: "",
                            
                              role: "",
                              searchKey: "",
                            })
                          }
                        >
                          Cancel
                        </button>
                        <button
                          className="btn bgThemePrimary px-3"
                          onClick={() =>
                            setPayload({ ...payload, ...filterPayload })
                          }
                        >
                          Apply
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      {filterPayload.show && <div className="modal-backdrop fade show"></div>}

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

export default AdminList;
