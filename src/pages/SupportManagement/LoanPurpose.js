import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getLoanPurposeServ,
  addLoanPurposeServ,
  updateLoanPurposeServ,
  deleteLoanPurposeServ,
} from "../../services/loanPurpose.service";
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
function LoanPurpose() {
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
      let response = await getLoanPurposeServ(payload);
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
    description: "",
    img: "",
    imgPrev: "",
    status: "",
    show: false,
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    description: "",
    img: "",
    imgPrev: "",
    status: "",
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
      label: "Total Loan Purpose",
      icon: "bi bi-diagram-3",
      count: documentCount?.totalCount,

      iconColor: "#010a2d",
    },
    {
      label: "Active Loan Purpose",
      icon: "bi bi-diagram-3",
      count: documentCount?.activeCount,

      iconColor: "green",
    },
    {
      label: "Inactive Loan Purpose",
      icon: "bi bi-diagram-3",
      count: documentCount?.inactiveCount,

      iconColor: "red",
    },
  ];
  const handleDeleteFunc = async (id) => {
    try {
      let response = await deleteLoanPurposeServ(deleteId);
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
  const LoanPurposeSchema = Yup.object().shape({
    img: Yup.mixed()
      .test("img-required", "Icon is required", function (value) {
        const { imgPrev } = this.parent;
        if (!value && !imgPrev) return false;
        return true;
      })
      .test("fileType", "Only JPG, PNG, WEBP allowed", (value) => {
        if (!value) return true;
        return ["image/jpeg", "image/png", "image/webp"].includes(value.type);
      })
      .test("fileSize", "Image must be less than 2MB", (value) => {
        if (!value) return true;
        return value.size <= 2 * 1024 * 1024;
      }),

    name: Yup.string().trim().required("Name is required"),
    description: Yup.string().trim().required("Description is required"),
    status: Yup.string().trim().required("Status is required"),
  });

  const handleAddLoanPurpose = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "img") {
          if (values.img instanceof File) {
            formData.append("img", values.img);
          }
        } else {
          formData.append(key, values[key]);
        }
      });
      let response = await addLoanPurposeServ(formData);
      if (response?.data?.statusCode == "200") {
        setAddFormData({
          name: "",
          status: "",
          description: "",
          img: "",
          show: false,
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
  const handleUpdateLoanPurpose = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "img") {
          if (values.img instanceof File) {
            formData.append("img", values.img);
          }
        } else {
          formData.append(key, values[key]);
        }
      });
      formData.append("_id", editFormData?._id);
      let response = await updateLoanPurposeServ(formData);
      if (response?.data?.statusCode == "200") {
        setEditFormData({
          name: "",
          description: "",
          status: "",
          img: "",
          _id: "",
        });
        toast.success(response?.data?.message);
        getListFunc();
      } else {
        toast?.error(response?.data?.message);
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
        <h4 className="mb-0">Loan Purpose</h4>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center px-2 user-search">
            <form className="input-group search ms-2 d-none d-md-flex">
              <span className="input-group-text input-span">
                <i className="bi bi-search" />
              </span>
              <input
                type="search"
                className="form-control search-input"
                placeholder="Search by name..."
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
          {permissions?.includes("Documents-Create") && (
            <button
              className="btn  bgThemePrimary shadow-sm"
              onClick={() => setAddFormData({ ...addFormData, show: true })}
            >
              + Add Loan Purpose
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
                  <th className="">Sr No.</th>
                  <th className="">Icon</th>
                  <th>Name</th>
                  <th>Description</th>
                  <th className="text-center">Status</th>
                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {showSkelton
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td className="">
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
                        </tr>
                      );
                    })
                  : list?.map((v, i) => {
                      return (
                        <tr>
                          <td>
                            {i + 1 + (payload?.pageNo - 1) * payload?.pageCount}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  v?.img ||
                                  "https://cdn-icons-png.flaticon.com/128/10446/10446694.png"
                                }
                                alt="User"
                                className="rounded-circle me-2"
                                width={40}
                                height={40}
                              />
                            </div>
                          </td>
                          <td>
                            <h6 style={{ fontSize: "14px" }}>{v?.name}</h6>{" "}
                          </td>
                          <td style={{ width: "600px" }}>{v?.description}</td>
                          <td className="text-center">
                            {renderProfile(v?.status)}
                          </td>

                          <td style={{ textAlign: "center" }}>
                            {permissions?.includes("Documents-Edit") && (
                              <a
                                onClick={() =>
                                  setEditFormData({
                                    name: v?.name,
                                    img: v?.img,
                                    status: v?.status,
                                    description: v?.description,
                                    _id: v?._id,
                                  })
                                }
                                className="text-primary text-decoration-underline me-2"
                              >
                                <i class="bi bi-pencil fs-6"></i>
                              </a>
                            )}
                            {permissions?.includes("Documents-Delete") && (
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
                          <td style={{ textAlign: "center" }}></td>
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

                width: "380px",
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
                      <h5 className="">Add Loan Purpose</h5>
                      <img
                        onClick={() =>
                          setAddFormData({
                            name: "",
                            description: "",
                            status: "",
                            show: false,
                            img: "",
                            imgPrev: "",
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
                        description: "",
                        img: "",
                        status: "",
                        imgPrev: "",
                      }}
                      validationSchema={LoanPurposeSchema}
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          await handleAddLoanPurpose(values);
                        } finally {
                          setSubmitting(false); // 🔥 MOST IMPORTANT
                        }
                      }}
                    >
                      {({ isSubmitting, values, setFieldValue }) => (
                        <Form>
                          <div className="row">
                            <div className="col-md-12 text-center my-auto">
                              <input
                                type="file"
                                id="img"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) =>
                                  setFieldValue("img", e.target.files[0])
                                }
                              />
                              <label htmlFor="img" className="cursor-pointer">
                                <img
                                  src={
                                    values.img
                                      ? URL.createObjectURL(values.img)
                                      : "https://cdn-icons-png.flaticon.com/128/10446/10446694.png"
                                  }
                                  alt="img"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                />
                              </label>
                              <div>
                                <small>
                                  Upload Icon
                                  <span className="text-danger">*</span>
                                </small>
                              </div>
                              <ErrorMessage
                                name="img"
                                component="div"
                                className="text-danger small"
                              />
                            </div>
                            <div className="col-12">
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
                            <div className="col-12">
                              <label className="mt-3">
                                Description{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="textarea"
                                className="form-control"
                                name="description"
                                rows="3"
                              />
                              <ErrorMessage
                                name="description"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* Status */}
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

                width: "380px",
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
                      <h5 className="">Update Loan Purpose</h5>
                      <img
                        onClick={() =>
                          setEditFormData({
                            show: false,
                            name: "",

                            status: "",
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
                        description: editFormData?.description || "",
                        status: editFormData?.status?.toString() || "",
                        img: "",
                        imgPrev: editFormData?.img || "",
                      }}
                      validationSchema={LoanPurposeSchema}
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          await handleUpdateLoanPurpose(values);
                        } finally {
                          setSubmitting(false); // 🔥 MOST IMPORTANT
                        }
                      }}
                      enableReinitialize
                    >
                      {({ isSubmitting, dirty, values, setFieldValue }) => (
                        <Form>
                          <div className="row">
                            <div className="col-md-12 text-center my-auto">
                              <input
                                type="file"
                                id="img"
                                accept="image/*"
                                style={{ display: "none" }}
                                onChange={(e) =>
                                  setFieldValue("img", e.target.files[0])
                                }
                              />
                              <label htmlFor="img" className="cursor-pointer">
                                <img
                                  src={
                                    values.img
                                      ? URL.createObjectURL(values.img)
                                      : values?.imgPrev
                                      ? values?.imgPrev
                                      : "https://cdn-icons-png.flaticon.com/128/10446/10446694.png"
                                  }
                                  alt="img"
                                  style={{
                                    width: "100px",
                                    height: "100px",
                                    borderRadius: "50%",
                                    objectFit: "cover",
                                  }}
                                />
                              </label>
                              <div>
                                <small>
                                  Upload Icon
                                  <span className="text-danger">*</span>
                                </small>
                              </div>
                              <ErrorMessage
                                name="img"
                                component="div"
                                className="text-danger small"
                              />
                            </div>
                            <div className="col-12">
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
                            <div className="col-12">
                              <label className="mt-3">
                                Description{" "}
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                as="textarea"
                                className="form-control"
                                name="description"
                                rows="3"
                              />
                              <ErrorMessage
                                name="description"
                                component="div"
                                className="text-danger"
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
        title="Loan purpose Delete"
        body="Do you really want to delete this loan purpose?"
      />
    </div>
  );
}

export default LoanPurpose;
