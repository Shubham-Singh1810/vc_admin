import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getCouponServ,
  addCouponServ,
  deleteCouponServ,
  updateCouponServ,
} from "../../services/coupon.service";
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
function CouponList() {
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
      let response = await getCouponServ(payload);
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
    code: "",
    message: "",
    discountType: "percentage",
    discountValue: 0,
    validFrom: "",
    validTo: "",
    usageLimit: 0,
    status: "active",
    image: "",
    show: false, // Modal control ke liye
  });

  const [editFormData, setEditFormData] = useState({
    code: "",
    message: "",
    discountType: "percentage",
    discountValue: 0,
    validFrom: "",
    validTo: "",
    usageLimit: 0,
    status: "active",
    image: "",
    _id: "", // Update karne ke liye unique ID
  });
  const renderProfile = (status) => {
    if (status == "active") {
      return (
        <span className="status-badge bg-success-subtle text-success">
          Active
        </span>
      );
    } else if (status == "inactive") {
      return (
        <span className="status-badge bg-warning-subtle text-warning">
          Inactive
        </span>
      );
    } else {
      return (
        <span className="status-badge bg-danger-subtle text-danger">
          Expired
        </span>
      );
    }
  };
  const staticsData = [
    {
      label: "Total Coupon",
      icon: "bi bi-diagram-3",
      count: documentCount?.totalCount,

      iconColor: "#010a2d",
    },
    {
      label: "Active Coupon",
      icon: "bi bi-diagram-3",
      count: documentCount?.activeCount,
      iconColor: "green",
    },
    {
      label: "Inactive Coupon",
      icon: "bi bi-diagram-3",
      count: documentCount?.inactiveCount,
      iconColor: "red",
    },
  ];
  const handleDeleteFunc = async (id) => {
    try {
      let response = await deleteCouponServ(deleteId);
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
  const CouponSchema = Yup.object().shape({
    code: Yup.string().trim().uppercase().required("Coupon code is required"),

    message: Yup.string().trim().required("Description/Message is required"),

    discountType: Yup.string()
      .oneOf(["percentage", "flat"], "Invalid discount type")
      .required("Discount type is required"),

    discountValue: Yup.number()
      .typeError("Must be a number")
      .positive("Value must be greater than 0")
      .required("Discount value is required")
      .when("discountType", {
        is: "percentage",
        then: (schema) => schema.max(100, "Percentage cannot be more than 100"),
      }),

    validFrom: Yup.date().required("Start date is required").nullable(),

    validTo: Yup.date()
      .required("Expiry date is required")
      .min(Yup.ref("validFrom"), "Expiry date must be after start date")
      .nullable(),

    usageLimit: Yup.number()
      .typeError("Must be a number")
      .min(0, "Limit cannot be negative"),

    status: Yup.string()
      .oneOf(["active", "inactive", "expired"], "Invalid status")
      .required("Status is required"),

    image: Yup.mixed().nullable(),
  });
  const handleAddCoupon = async (values, setSubmitting) => {
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
      const response = await addCouponServ(formData);

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
    } finally {
      setSubmitting(false);
    }
  };

  const handleUpdateCoupon = async (values, setSubmitting) => {
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
      let response = await updateCouponServ(formData);
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
  const [filterPayload, setFilterPayload] = useState({
    show: false,
    searchKey: "",
    status: "",
  });

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
        <h4 className="mb-0">Coupon</h4>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center px-2 user-search">
            <form className="input-group search ms-2 d-none d-md-flex">
              <span className="input-group-text input-span">
                <i className="bi bi-search" />
              </span>
              <input
                type="search"
                className="form-control search-input"
                placeholder="Search by code..."
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
              {payload?.status == "active"
                ? "Active"
                : payload?.status == "inactive"
                  ? "Inactive"
                  : payload?.status == "expired"
                  ? "Expired"
                  :"Select Status"}
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
                  onClick={() => setPayload({ ...payload, status: "active" })}
                >
                  Active
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, status: "inactive" })}
                >
                  Inactive
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, status: "expired" })}
                >
                  Expired
                </button>
              </li>
            </ul>
          </div>
          {permissions?.includes("Categories-Create") && (
            <button
              className="btn  bgThemePrimary shadow-sm"
              onClick={() => setAddFormData({ ...addFormData, show: true })}
            >
              + Add Coupon
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
                  <th>Icon</th>
                  <th>Code</th>
                  <th>Message</th>
                  <th>Discount</th>

                  <th>Validity</th>
                  <th>Uses</th>
                  <th>Status</th>
                  <th className="text-center">Action</th>
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
                          <td>
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
                                  v?.image ||
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
                              <div>{v?.code}</div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <small className="text-muted">{v?.message}</small>
                            </div>
                          </td>
                          <td>
                            {v?.discountType} || {v?.discountValue}
                          </td>
                          <td>
                            {v?.validFrom
                              ? moment(v.validFrom).format("DD-MMM-YYYY")
                              : "N/A"}
                            <span className="mx-1">to</span>
                            {v?.validTo
                              ? moment(v.validTo).format("DD-MMM-YYYY")
                              : "N/A"}
                          </td>
                          <td>
                            {v?.usedCount}
                            <span className="mx-1">/</span>
                            {v?.usageLimit}
                          </td>
                          <td>{renderProfile(v?.status)}</td>
                          <td className="text-center">
                            {permissions?.includes("Staff/Agent-Edit") && (
                              <a
                                onClick={() =>
                                  setEditFormData({
                                    code: v?.code,
                                    validFrom: v?.validFrom,
                                    validTo: v?.validTo,
                                    usageLimit: v?.usageLimit,
                                    message: v?.message,
                                    status: v?.status,
                                    image: v?.image,
                                    discountType:v?.discountType,
                                    discountValue:v?.discountValue,
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
      {/* ==================== 1. ADD COUPON MODAL ==================== */}
      {addFormData?.show && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div className="modal-dialog modal-lg">
            <div
              className="modal-content"
              style={{ borderRadius: "8px", width: "700px" }}
            >
              <div className="modal-body p-4">
                <div className="d-flex justify-content-between align-items-center mb-4">
                  <h5 className="mb-0">Add New Coupon</h5>
                  <img
                    onClick={() =>
                      setAddFormData({ ...addFormData, show: false })
                    }
                    src="https://cdn-icons-png.flaticon.com/128/2734/2734822.png"
                    style={{ height: "20px", cursor: "pointer" }}
                    alt="close"
                  />
                </div>

                <Formik
                  initialValues={{
                    code: "",
                    message: "",
                    discountType: "percentage",
                    discountValue: 0,
                    validFrom: "",
                    validTo: "",
                    usageLimit: 0,
                    status: "active",
                    image: "",
                  }}
                  validationSchema={CouponSchema}
                  onSubmit={(values, { setSubmitting }) =>
                    handleAddCoupon(values, setSubmitting)
                  }
                >
                  {({ setFieldValue, isSubmitting, values }) => (
                    <Form>
                      <div className="row">
                        {/* Image Upload */}
                        <div className="col-12  mb-3">
                          <input
                            type="file"
                            id="couponImgAdd"
                            accept="image/*"
                            style={{ display: "none" }}
                            onChange={(e) =>
                              setFieldValue("image", e.target.files[0])
                            }
                          />
                          <label
                            htmlFor="couponImgAdd"
                            className="cursor-pointer"
                          >
                            <img
                              src={
                                values.image
                                  ? URL.createObjectURL(values.image)
                                  : "https://cdn-icons-png.flaticon.com/128/3263/3263403.png"
                              }
                              style={{
                                width: "120px",
                                height: "80px",
                                borderRadius: "8px",
                                objectFit: "cover",
                                border: "1px dashed #ccc",
                              }}
                              alt="coupon"
                            />
                          </label>
                          <div>
                            <label>Upload Image</label>
                          </div>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label>
                            Coupon Code <span className="text-danger">*</span>
                          </label>
                          <Field name="code" className="form-control" />
                          <ErrorMessage
                            name="code"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label>
                            Discount Type <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="select"
                            name="discountType"
                            className="form-control"
                          >
                            <option value="percentage">Percentage (%)</option>
                            <option value="flat">Flat Amount</option>
                          </Field>
                        </div>

                        <div className="col-md-6 mb-3">
                          <label>
                            Discount Value{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            name="discountValue"
                            type="number"
                            className="form-control"
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label>Usage Limit</label>
                          <Field
                            name="usageLimit"
                            type="number"
                            className="form-control"
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label>Valid From</label>
                          <Field
                            name="validFrom"
                            type="date"
                            className="form-control"
                          />
                        </div>

                        <div className="col-md-6 mb-3">
                          <label>Valid To</label>
                          <Field
                            name="validTo"
                            type="date"
                            className="form-control"
                          />
                        </div>
                        <div className="col-md-6 mb-3">
                          <label>
                            Status <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="select"
                            name="status"
                            className="form-control"
                          >
                            <option value="active">Active</option>
                            <option value="inactive">Inactive</option>
                          </Field>
                        </div>

                        <div className="col-12 mb-3">
                          <label>
                            Message <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="textarea"
                            name="message"
                            className="form-control"
                            rows="2"
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn bgThemePrimary w-100 mt-2"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Submit"}
                      </button>
                    </Form>
                  )}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}
      {addFormData?.show && <div className="modal-backdrop fade show"></div>}
      {editFormData?._id && (
  <div className="modal fade show d-flex align-items-center justify-content-center" tabIndex="-1">
    <div className="modal-dialog modal-lg">
      <div className="modal-content" style={{ borderRadius: "8px", width: "700px" }}>
        <div className="modal-body p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Update Coupon: <span className="text-primary">{editFormData?.code}</span></h5>
            <img
              onClick={() => setEditFormData({})}
              src="https://cdn-icons-png.flaticon.com/128/2734/2734822.png"
              style={{ height: "20px", cursor: "pointer" }}
              alt="close"
            />
          </div>

          <Formik
            enableReinitialize
            initialValues={{
              code: editFormData?.code || "",
              message: editFormData?.message || "",
              discountType: editFormData?.discountType || "percentage",
              discountValue: editFormData?.discountValue || 0,
              validFrom: editFormData?.validFrom ? new Date(editFormData.validFrom).toISOString().split("T")[0] : "",
              validTo: editFormData?.validTo ? new Date(editFormData.validTo).toISOString().split("T")[0] : "",
              usageLimit: editFormData?.usageLimit || 0,
              status: editFormData?.status || "active",
              image: editFormData?.image || "",
            }}
            validationSchema={CouponSchema}
            onSubmit={(values, { setSubmitting }) => handleUpdateCoupon(values, setSubmitting)}
          >
            {({ setFieldValue, isSubmitting, values, dirty }) => (
              <Form>
                <div className="row">
                  {/* Image Upload for Edit */}
                  <div className="col-12 mb-3">
                    <input
                      type="file"
                      id="couponImgEdit"
                      accept="image/*"
                      style={{ display: "none" }}
                      onChange={(e) => setFieldValue("image", e.target.files[0])}
                    />
                    <label htmlFor="couponImgEdit" className="cursor-pointer">
                      <img
                        src={
                          typeof values.image === "string" && values.image
                            ? values.image
                            : values.image instanceof File
                            ? URL.createObjectURL(values.image)
                            : "https://cdn-icons-png.flaticon.com/128/3263/3263403.png"
                        }
                        style={{
                          width: "120px",
                          height: "80px",
                          borderRadius: "8px",
                          objectFit: "cover",
                          border: "1px dashed #ccc",
                        }}
                        alt="coupon"
                      />
                    </label>
                    <div>
                      <label>Update Image</label>
                    </div>
                  </div>

                  {/* Coupon Code */}
                  <div className="col-md-6 mb-3">
                    <label>Coupon Code <span className="text-danger">*</span></label>
                    <Field name="code" className="form-control" />
                    <ErrorMessage name="code" component="div" className="text-danger small" />
                  </div>

                  {/* Discount Type */}
                  <div className="col-md-6 mb-3">
                    <label>Discount Type <span className="text-danger">*</span></label>
                    <Field as="select" name="discountType" className="form-control">
                      <option value="percentage">Percentage (%)</option>
                      <option value="flat">Flat Amount</option>
                    </Field>
                  </div>

                  {/* Discount Value */}
                  <div className="col-md-6 mb-3">
                    <label>Discount Value <span className="text-danger">*</span></label>
                    <Field name="discountValue" type="number" className="form-control" />
                    <ErrorMessage name="discountValue" component="div" className="text-danger small" />
                  </div>

                  {/* Usage Limit */}
                  <div className="col-md-6 mb-3">
                    <label>Usage Limit</label>
                    <Field name="usageLimit" type="number" className="form-control" />
                  </div>

                  {/* Valid From */}
                  <div className="col-md-6 mb-3">
                    <label>Valid From</label>
                    <Field name="validFrom" type="date" className="form-control" />
                  </div>

                  {/* Valid To */}
                  <div className="col-md-6 mb-3">
                    <label>Valid To</label>
                    <Field name="validTo" type="date" className="form-control" />
                  </div>

                  {/* Status */}
                  <div className="col-md-12 mb-3">
                    <label>Status <span className="text-danger">*</span></label>
                    <Field as="select" name="status" className="form-control">
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                      <option value="expired">Expired</option>
                    </Field>
                  </div>

                  {/* Message */}
                  <div className="col-12 mb-3">
                    <label>Message <span className="text-danger">*</span></label>
                    <Field as="textarea" name="message" className="form-control" rows="2" />
                    <ErrorMessage name="message" component="div" className="text-danger small" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="btn bgThemePrimary w-100 mt-2"
                  disabled={isSubmitting || !dirty}
                >
                  {isSubmitting ? "Updating..." : "Update Coupon"}
                </button>
              </Form>
            )}
          </Formik>
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
        title="Coupon Delete"
        body="Do you really want to delete this coupon?"
      />
    </div>
  );
}

export default CouponList;
