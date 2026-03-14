import { useEffect, useState } from "react";
import {
  getBookingListServ,
  addBookingServ,
  updateBookingServ,
  deleteBookingServ,
} from "../../services/bookingDashboard.services";
import { getBatchServ } from "../../services/batch.services";
import { getUserListServ } from "../../services/user.service";
import {
  getCouponServ,
  checkCouponValidityServ,
} from "../../services/coupon.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../../components/NoDataScreen";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import { Formik, Form, Field, ErrorMessage, useFormikContext } from "formik";
import * as Yup from "yup";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
import { useGlobalState } from "../../GlobalProvider";

// --- Auto Calculation Helper Component ---
const BookingPriceCalculator = ({ batches }) => {
  const { values, setFieldValue } = useFormikContext();

  // Batch select hote hi price set karna
  useEffect(() => {
    if (values.batchId) {
      const selectedBatch = batches.find((b) => b._id === values.batchId);
      if (selectedBatch) {
        setFieldValue("price", selectedBatch.discountedPrice || 0);
      }
    }
  }, [values.batchId, batches, setFieldValue]);

  // Price ya Discount change hote hi Final Amount calculate karna
  useEffect(() => {
    const final = Math.max(
      0,
      (values.price || 0) - (values.couponDiscountValue || 0),
    );
    setFieldValue("finalAmount", final);
  }, [values.price, values.couponDiscountValue, setFieldValue]);

  return null;
};

function Booking() {
  const { globalState } = useGlobalState();
  const permissions = globalState?.user?.role?.permissions || [];
  const [list, setList] = useState([]);
  const [batches, setBatches] = useState([]);
  const [users, setUsers] = useState([]);
  const [coupons, setCoupons] = useState([]);

  const [showSkelton, setShowSkelton] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const [showFilter, setShowFilter] = useState(false);

  const [payload, setPayload] = useState({
    searchKey: "",
    pageNo: 1,
    pageCount: 20,
    batchId: "",
    userId: "",
    couponId: "",
  });
  const [documentCount, setDocumentCount] = useState(0);

  const [addFormData, setAddFormData] = useState({ show: false });
  const [editFormData, setEditFormData] = useState({ show: false, data: null });

  // --- Fetch Data ---
  const getListFunc = async () => {
    setShowSkelton(true);
    try {
      let response = await getBookingListServ(payload);
      if (response?.data?.statusCode == 200) {
        setList(response?.data?.data);
        setDocumentCount(response?.data?.documentCount);
      }
    } catch (error) {
      console.error(error);
    }
    setShowSkelton(false);
  };

  const fetchDropdownData = async () => {
    try {
      const [bRes, uRes, cRes] = await Promise.all([
        getBatchServ({ pageCount: 100 }),
        getUserListServ({ pageCount: 100 }),
        getCouponServ({ pageCount: 100 }),
      ]);
      setBatches(bRes?.data?.data || []);
      setUsers(uRes?.data?.data || []);
      setCoupons(cRes?.data?.data || []);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getListFunc();
  }, [payload]);
  useEffect(() => {
    fetchDropdownData();
  }, []);

  // --- Coupon Logic ---
  const handleApplyCoupon = async (code, price, userId, setFieldValue) => {
    if (!code || !price || !userId)
      return toast.warning("Select Batch, and user then Enter Coupon first");
    try {
      const response = await checkCouponValidityServ({
        code,
        orderAmount: price,
        userId,
      });
      if (response?.data?.statusCode == "200") {
        setFieldValue(
          "couponDiscountValue",
          response?.data?.data?.couponDiscountValue,
        );
        setFieldValue("couponId", response?.data?.data?._id);
        toast.success(response?.data?.message);
      } else {
        setFieldValue("couponDiscountValue", 0);
        toast.error("Invalid Coupon");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };

  // --- CRUD Handlers ---
  const handleBookingSubmit = async (values, { setSubmitting }) => {
    try {
      const action = editFormData.show ? updateBookingServ : addBookingServ;
      const res = await action({
        ...values,
        createdBy: globalState?.user?._id,
        isCreatedByAdmin: true,
      });
      if (res?.data?.statusCode === 200) {
        toast.success(res.data.message);
        setAddFormData({ show: false });
        setEditFormData({ show: false, data: null });
        getListFunc();
      }
    } catch (error) {
      toast.error(error?.response?.data?.message || "Error");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    try {
      let response = await deleteBookingServ(deleteId);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        setShowConfirm(false);
        getListFunc();
      }
    } catch (err) {
      toast.error(err?.response?.data?.message);
    }
  };

  const BookingSchema = Yup.object().shape({
    batchId: Yup.string().required("Required"),
    userId: Yup.string().required("Required"),
    modeOfPayment: Yup.string().required("Required"),
  });
  const staticsData = [
    {
      label: "Total Booking",
      icon: "bi bi-stack",
      count: documentCount?.totalCount,

      iconColor: "#010a2d",
    },
  ];

  return (
    <div className="container-fluid py-3">
      {/* KPI Section */}
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
        <h4 className="mb-0">Booking</h4>
        <div className="d-flex align-items-center">
          <button
            className="btn btn-light shadow-sm  px-3 me-3"
            // onClick={() => setFilterPayload({ ...filterPayload, show: true })}
          >
            Filter <i className="bi bi-filter ms-2" />
          </button>

          {permissions?.includes("Categories-Create") && (
            <button
              className="btn  bgThemePrimary shadow-sm"
              onClick={() => setAddFormData({ ...addFormData, show: true })}
            >
              + Add Booking
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
                  <th>Batch</th>
                  <th>User</th>
                  <th>Coupon</th>
                  <th>Price</th>
                  <th className="text-center">Mode Of Payment</th>
                  <th>Payment ID</th>
                  <th className="text-center">Created By</th>
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
                              <div>
                                <h6
                                  className="mb-0"
                                  style={{ fontSize: "14px" }}
                                >
                                  {v?.batchId?.name}
                                </h6>
                                <small className="text-muted">
                                  Duration: {v?.batchId?.duration || "N/A"}
                                </small>
                              </div>
                            </div>
                          </td>

                          <td>
                            <div className="d-flex align-items-center">
                              <div>
                                <h6
                                  className="mb-0"
                                  style={{ fontSize: "14px" }}
                                >
                                  {v?.userId?.firstName +
                                    " " +
                                    v?.userId?.lastName}
                                </h6>
                                <small className="text-muted">
                                  Phone: {v?.userId?.phone || "N/A"}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <h6 className="mb-0" style={{ fontSize: "14px" }}>
                                {v?.couponId?.code}
                              </h6>
                              <small className="text-muted">
                                Discount :{v?.couponDiscountValue} INR
                              </small>
                            </div>
                          </td>
                          <td>
                            <s>{v?.price}</s> {v?.finalAmount} INR
                          </td>
                          <td className="text-center">
                            {v?.modeOfPayment.toUpperCase()}
                          </td>
                          <td>{v?.paymentId || "N/A"}</td>
                          <td className="text-center">
                            {v?.isCreatedByAdmin ? "Admin" : "Self"}
                          </td>

                          <td className="text-center">
                            {permissions?.includes("Staff/Agent-Edit") && (
                              <a
                                onClick={() =>
                                  setEditFormData({
                                    batchId: v?.batchId?._id,
                                    userId: v?.userId?._id,
                                    couponId: v?.couponId?._id,
                                    finalAmount: v?.finalAmount,
                                    price: v?.price,
                                    show: true,
                                    _id: v?._id,
                                    modeOfPayment: v?.modeOfPayment,
                                    couponDiscountValue: v?.couponDiscountValue,
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

      {(addFormData.show || editFormData.show) && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-lg modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>{editFormData.show ? "Edit" : "Create"} Booking</h5>
                <button
                  className="btn-close"
                  onClick={() => {
                    setAddFormData({ show: false });
                    setEditFormData({ show: false });
                  }}
                ></button>
              </div>
              <div className="modal-body">
                <Formik
                  initialValues={
                    editFormData || {
                      batchId: "",
                      userId: "",
                      couponCode: "",
                      price: 0,
                      couponDiscountValue: 0,
                      finalAmount: 0,
                      modeOfPayment: "online",
                      paymentId: "",
                    }
                  }
                  validationSchema={BookingSchema}
                  onSubmit={handleBookingSubmit}
                >
                  {({ values, setFieldValue, isSubmitting , errors}) => {
                    console.log("Validation Errors:", errors)
                    return(
                    <Form>
                      <BookingPriceCalculator batches={batches} />
                      <div className="row">
                        <div className="col-md-6 mb-3">
                          <label>User</label>
                          <Field
                            as="select"
                            name="userId"
                            className="form-control"
                          >
                            <option value="">Select User</option>
                            {users.map((u) => (
                              <option key={u._id} value={u._id}>
                                {u.firstName} {u.lastName}
                              </option>
                            ))}
                          </Field>
                          
                        </div>
                        <div className="col-md-6 mb-3">
                          <label>Batch</label>
                          <Field
                            as="select"
                            name="batchId"
                            className="form-control"
                          >
                            <option value="">Select Batch</option>
                            {batches.map((b) => (
                              <option key={b._id} value={b._id}>
                                {b.name} (₹{b?.discountedPrice})
                              </option>
                            ))}
                          </Field>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label>Coupon Code</label>
                          <div className="input-group">
                            <Field
                              name="couponCode"
                              as="select"
                              className="form-control"
                            >
                              <option value="">Select a Coupon</option>
                              {coupons.map((coupon) => (
                                <option key={coupon._id} value={coupon.code}>
                                  {coupon.code}
                                </option>
                              ))}
                            </Field>

                            <button
                              type="button"
                              className="btn btn-dark"
                              onClick={() =>
                                handleApplyCoupon(
                                  values.couponCode,
                                  values.price,
                                  values?.userId,
                                  setFieldValue,
                                )
                              }
                            >
                              Apply
                            </button>
                          </div>
                        </div>
                        <div className="col-md-6 mb-3">
                          <label>Payment Mode</label>
                          <Field
                            as="select"
                            name="modeOfPayment"
                            className="form-control"
                          >
                            <option value="online">Online</option>
                            <option value="offline">Offline</option>
                          </Field>
                        </div>
                        <div className="col-md-4 mb-3">
                          <label>Base Price</label>
                          <Field
                            name="price"
                            className="form-control"
                            readOnly
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label>Discount</label>
                          <Field
                            name="couponDiscountValue"
                            className="form-control"
                            readOnly
                          />
                        </div>
                        <div className="col-md-4 mb-3">
                          <label>Final Amount</label>
                          <Field
                            name="finalAmount"
                            className="form-control"
                            style={{ background: "#eee" }}
                            readOnly
                          />
                        </div>
                      </div>
                      <button
                        type="submit"
                        className="btn bgThemePrimary w-100 mt-3"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Saving..." : "Save Booking"}
                      </button>
                    </Form>)
}}
                </Formik>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* --- FILTER POPUP --- */}
      {showFilter && (
        <div
          className="modal fade show d-block"
          style={{ backgroundColor: "rgba(0,0,0,0.5)" }}
        >
          <div className="modal-dialog modal-md modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header">
                <h5>Filter Bookings</h5>
                <button
                  className="btn-close"
                  onClick={() => setShowFilter(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <label>By Batch</label>
                  <select
                    className="form-control"
                    onChange={(e) =>
                      setPayload({ ...payload, batchId: e.target.value })
                    }
                  >
                    <option value="">All Batches</option>
                    {batches.map((b) => (
                      <option key={b._id} value={b._id}>
                        {b.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="mb-3">
                  <label>By User</label>
                  <select
                    className="form-control"
                    onChange={(e) =>
                      setPayload({ ...payload, userId: e.target.value })
                    }
                  >
                    <option value="">All Users</option>
                    {users.map((u) => (
                      <option key={u._id} value={u._id}>
                        {u.firstName}
                      </option>
                    ))}
                  </select>
                </div>
                <button
                  className="btn btn-primary w-100"
                  onClick={() => {
                    getListFunc();
                    setShowFilter(false);
                  }}
                >
                  Apply Filters
                </button>
                <button
                  className="btn btn-link w-100 text-muted mt-2"
                  onClick={() =>
                    setPayload({ ...payload, batchId: "", userId: "" })
                  }
                >
                  Reset
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDeleteModal
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDelete}
        title="Booking Delete"
        body="Do you really want to delete this Booking?"
      />
    </div>
  );
}

export default Booking;
