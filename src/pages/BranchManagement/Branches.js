import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
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
import { useGlobalState } from "../../GlobalProvider";
function Branches() {
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
  });
  const [documentCount, setDocumentCount] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const getListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }

    try {
      let response = await getBranchListServ(payload);
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
    name: "",
    phone: "",
    contactPerson: "",
    status: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    description: "",
    show: false,
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    phone: "",
    contactPerson: "",
    status: "",
    address: "",
    city: "",
    state: "",
    pincode: "",
    description: "",
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
      label: "Total Branches",
      icon: "bi bi-diagram-3",
      count: documentCount?.totalCount,

      iconColor: "#010a2d",
    },
    {
      label: "Active Branches",
      icon: "bi bi-diagram-3",
      count: documentCount?.activeCount,

      iconColor: "green",
    },
    {
      label: "Inactive Branches",
      icon: "bi bi-diagram-3",
      count: documentCount?.inactiveCount,

      iconColor: "red",
    },
  ];
  const handleDeleteFunc = async (id) => {
    try {
      let response = await handleDeleteBranchServ(deleteId);
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
  const BranchSchema = Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    phone: Yup.string().trim()
      .matches(/^[0-9]{10}$/, "Must be a valid 10-digit number")
      .required("Contact Number is required"),
    contactPerson: Yup.string().trim().required("Contact Person is required"),
    status: Yup.string().trim().required("Status is required"),
    description: Yup.string().trim(),
    address: Yup.string().trim().required("Address is required"),
    state: Yup.string().trim().required("State is required"),
    city: Yup.string().trim().required("City is required"),
    pincode: Yup.string().trim()
      .matches(/^[0-9]{6}$/, "Enter valid 6-digit pincode")
      .required("Pincode is required"),
  });
  const handleAddBranch = async (value) => {
    try {
      let response = await handleCreateBranchServ(value);
      if (response?.data?.statusCode == "200") {
        setAddFormData({
          name: "",
          phone: "",
          contactPerson: "",
          status: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          description: "",
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
  const handleUpdateBranch = async (value) => {
    try {
      let response = await handleUpdateBranchServ({
        ...value,
        _id: editFormData?._id,
      });
      if (response?.data?.statusCode == "200") {
        setEditFormData({
          name: "",
          phone: "",
          contactPerson: "",
          status: "",
          address: "",
          city: "",
          state: "",
          pincode: "",
          description: "",
          _id: "",
        });
        toast.success(response?.data?.message);
        getListFunc();
      } else {
        toast?.error("Something went wrong!");
      }
    } catch (error) {
      toast?.error(error?.response?.data?.message);
    }
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
        <h4 className="mb-0">Branches</h4>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center px-2 user-search">
            <form className="input-group search ms-2 d-none d-md-flex">
              <span className="input-group-text input-span">
                <i className="bi bi-search" />
              </span>
              <input
                type="search"
                className="form-control search-input"
                placeholder="Name, Location, Phone Number..."
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
                width: "150px",
                fontSize: "14px",
              }}
            >
              {payload?.status === true
                ? "Active"
                : payload?.status === false
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
          {permissions?.includes("Branches-Create") && (
            <button
              className="btn  bgThemePrimary shadow-sm"
              onClick={() => setAddFormData({ ...addFormData, show: true })}
            >
              + Add Branch
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
                  <th>Name</th>
                  <th>Location</th>

                  <th>Contact Person</th>
                  <th className="text-center">Contact</th>
                  <th>Description</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Agents</th>
                  {(permissions?.includes("Branches-Edit") ||
                    permissions?.includes("Branches-Delete")) && (
                    <th style={{ textAlign: "center" }}>Action</th>
                  )}
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
                          {(permissions?.includes("Branches-Edit") ||
                            permissions?.includes("Branches-Delete")) && (
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
                            <h6 style={{ fontSize: "14px" }}>{v?.name}</h6>{" "}
                          </td>

                          <td>
                            <div
                              className=" d-flex    p-1"
                              style={{ width: "200px" }}
                            >
                              <i className="bi bi-geo-alt me-2 mt-1"></i>
                              <div>
                                {v?.address}
                                <br />
                                <small>
                                  {v?.state}, {v?.city}, {v?.pincode}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>{v?.contactPerson}</td>
                          <td className="text-center">{v?.phone}</td>
                          <td style={{ width: "180px" }}>{v?.description}</td>
                          <td className="text-center">
                            {renderProfile(v?.status)}
                          </td>
                          <td className="text-center">
                            <a
                              className="cursor"
                              onClick={() => navigate("/view-staff/" + v?._id)}
                            >
                              <u
                                style={{
                                  color: "#010a2d",
                                  fontWeight: "500",
                                  fontSize: "13px",
                                }}
                              >
                                View Staff
                              </u>
                            </a>
                          </td>
                          {/* <td className="text-center">{moment(v?.lastLogin).format("DD MMM, YYYY")}</td> */}
                          <td style={{ textAlign: "center" }}>
                            {permissions?.includes("Branches-Edit") && (
                              <a
                                onClick={() =>
                                  setEditFormData({
                                    name: v?.name,
                                    phone: v?.phone,
                                    contactPerson: v?.contactPerson,
                                    status: v?.status,
                                    address: v?.address,
                                    city: v?.city,
                                    state: v?.state,
                                    pincode: v?.pincode,
                                    description: v?.description,
                                    _id: v?._id,
                                  })
                                }
                                className="text-primary text-decoration-underline me-2"
                              >
                                <i class="bi bi-pencil fs-6"></i>
                              </a>
                            )}
                            {permissions?.includes("Branches-Delete") && (
                              <a
                                // onClick={() => handleDeleteFunc(v?._id)}
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
                      <h5 className="">Add Branch</h5>
                      <img
                        onClick={() =>
                          setAddFormData({
                            name: "",
                            phone: "",
                            contactPersonId: "",
                            status: "",
                            address: "",
                            city: "",
                            state: "",
                            pincode: "",
                            description: "",
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
                        name: "",
                        phone: "",
                        contactPerson: "",
                        status: "",
                        address: "",
                        city: "",
                        state: "",
                        pincode: "",
                        description: "",
                      }}
                      validationSchema={BranchSchema}
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          await handleAddBranch(values);
                        } catch (error) {
                          console.error("Add failed", error);
                        } finally {
                          setSubmitting(false); 
                        }
                      }}
                    >
                      {({ isSubmitting }) => (
                        <Form>
                          <div className="row">
                            {/* Name */}
                            <div className="col-6">
                              <label className="mt-3">
                                Name<span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="text"
                                name="name"
                              />
                              <ErrorMessage
                                name="name"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* Contact Number */}

                            {/* Contact Person */}
                            <div className="col-6">
                              <label className="mt-3">
                                Contact Person
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="text"
                                name="contactPerson"
                              />
                              <ErrorMessage
                                name="contactPerson"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                            <div className="col-6">
                              <label className="mt-3">
                                Contact Number
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

                            {/* Status */}
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

                            {/* Description */}
                            <div className="col-12">
                              <label className="mt-3">Description</label>
                              <Field
                                as="textarea"
                                className="form-control"
                                name="description"
                              />
                            </div>

                            {/* Location Section */}
                            <p className="text-underline mt-4 mb-0">
                              <i className="bi bi-geo-alt"></i> Location
                            </p>

                            {/* Address */}
                            <div className="col-12">
                              <label className="mt-3">
                                Address<span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="text"
                                name="address"
                              />
                              <ErrorMessage
                                name="address"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* State */}
                            <div className="col-4">
                              <label className="mt-3">
                                State<span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="text"
                                name="state"
                              />
                              <ErrorMessage
                                name="state"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* City */}
                            <div className="col-4">
                              <label className="mt-3">
                                City<span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="text"
                                name="city"
                              />
                              <ErrorMessage
                                name="city"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* Pincode */}
                            <div className="col-4">
                              <label className="mt-3">
                                Pincode<span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="number"
                                name="pincode"
                              />
                              <ErrorMessage
                                name="pincode"
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
                      <h5 className="">Update Branch</h5>
                      <img
                        onClick={() =>
                          setEditFormData({
                            show: false,
                            name: "",
                            phone: "",
                            contactPerson: "",
                            status: "",
                            address: "",
                            city: "",
                            state: "",
                            pincode: "",
                            description: "",
                          })
                        }
                        src="https://cdn-icons-png.flaticon.com/128/2734/2734822.png"
                        style={{ height: "20px", cursor: "pointer" }}
                      />
                    </div>

                    {/* ✅ Formik Form Start */}
                    <Formik
                      initialValues={{
                        name: editFormData?.name || "",
                        phone: editFormData?.phone || "",
                        contactPerson: editFormData?.contactPerson || "",
                        status: editFormData?.status?.toString() || "",
                        address: editFormData?.address || "",
                        city: editFormData?.city || "",
                        state: editFormData?.state || "",
                        pincode: editFormData?.pincode || "",
                        description: editFormData?.description || "",
                      }}
                      validationSchema={BranchSchema}
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          await handleUpdateBranch(values); 
                        } catch (error) {
                          console.error("Update failed", error);
                        } finally {
                          setSubmitting(false);
                        }
                      }}
                      enableReinitialize
                    >
                      {({ isSubmitting, dirty }) => (
                        <Form>
                          <div className="row">
                            {/* Name */}
                            <div className="col-6">
                              <label className="mt-3">
                                Name <span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="text"
                                name="name"
                              />
                              <ErrorMessage
                                name="name"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* Contact Number */}
                            <div className="col-6">
                              <label className="mt-3">
                                Contact Number{" "}
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

                            {/* Contact Person */}
                            <div className="col-6">
                              <label className="mt-3">
                                Contact Person{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="text"
                                name="contactPerson"
                              />
                              <ErrorMessage
                                name="contactPerson"
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
                                <option value="">
                                  Select Status{" "}
                                  <span className="text-danger">*</span>
                                </option>
                                <option value="true">Active</option>
                                <option value="false">Inactive</option>
                              </Field>
                              <ErrorMessage
                                name="status"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* Description */}
                            <div className="col-12">
                              <label className="mt-3">Description</label>
                              <Field
                                as="textarea"
                                className="form-control"
                                name="description"
                              />
                            </div>

                            {/* Location Section */}
                            <p className="text-underline mt-4 mb-0">
                              <i className="bi bi-geo-alt"></i> Location
                            </p>

                            {/* Address */}
                            <div className="col-12">
                              <label className="mt-3">
                                Address <span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="text"
                                name="address"
                              />
                              <ErrorMessage
                                name="address"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* State */}
                            <div className="col-4">
                              <label className="mt-3">
                                State <span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="text"
                                name="state"
                              />
                              <ErrorMessage
                                name="state"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* City */}
                            <div className="col-4">
                              <label className="mt-3">
                                City <span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="text"
                                name="city"
                              />
                              <ErrorMessage
                                name="city"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* Pincode */}
                            <div className="col-4">
                              <label className="mt-3">
                                Pincode <span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="number"
                                name="pincode"
                              />
                              <ErrorMessage
                                name="pincode"
                                component="div"
                                className="text-danger"
                              />
                            </div>
                          </div>

                          {/* Submit */}
                          <button
                            className="btn bgThemePrimary  w-100 mt-3"
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
        title="Branch Delete"
        body="Do you really want to delete this branch?"
      />
    </div>
  );
}

export default Branches;
