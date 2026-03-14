import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
getBulkBooking,
addBulkBookingServ,
updateBulkBookingServ,
deleteBulkBookingServ
} from "../../services/bulkBooking.services"
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
import Select from "react-select";
function BulkBooking() {
  const { globalState } = useGlobalState();
  const permissions = globalState?.user?.role?.permissions || [];
  const [batches, setBatches] = useState([]); 
const [allUsers, setAllUsers] = useState([]);
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
      let response = await getBulkBooking(payload);
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
    organisation: "",
    userIds: [],
    batchId: [],
    finalAmount:"",
    show: false,
  });
  const [editFormData, setEditFormData] = useState({
    organisation: "",
    userIds: [],
    batchId: [],
    finalAmount:"",
    show: false,
    _id: "",
  });
  
  const staticsData = [
    {
      label: "Total Bulk Booking",
      icon: "bi bi-diagram-3",
      count: documentCount?.totalCount,

      iconColor: "#010a2d",
    },
    
  ];
  const handleDeleteFunc = async (id) => {
    try {
      let response = await deleteBulkBookingServ(deleteId);
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
  
  const BookingSchema = Yup.object().shape({
  organisation: Yup.string().trim().required("Organisation name is required"),
  batchId: Yup.string().required("Batch is required"),
  finalAmount: Yup.number().positive().required("Amount is required"),
  noOfStudent: Yup.number().min(1, "At least 1 student required").required("Required"),
  UserIds: Yup.array().min(1, "At least one user must be selected"),
});
  const handleAddBooking = async (values) => {
  try {
   
    let response = await addBulkBookingServ(values); 
    if (response?.data?.statusCode == "200") {
      setAddFormData({ ...addFormData, show: false });
      toast.success(response?.data?.message);
      getListFunc();
    }
  } catch (error) {
    toast.error("Error creating booking");
  }
};

// Update Form Logic
const handleUpdateBooking = async (values) => {
  try {
    let response = await updateBulkBookingServ({
      ...values,
      _id: editFormData?._id,
    });
    if (response?.data?.statusCode == "200") {
      setEditFormData({ ...editFormData, _id: "" });
      toast.success(response?.data?.message);
      getListFunc();
    }
  } catch (error) {
    toast.error("Error updating booking");
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
        <h4 className="mb-0">Bulk Booking</h4>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center px-2 user-search">
            <form className="input-group search ms-2 d-none d-md-flex">
              <span className="input-group-text input-span">
                <i className="bi bi-search" />
              </span>
              <input
                type="search"
                className="form-control search-input"
                placeholder="Search by organisation..."
                value={payload?.searchKey}
                onChange={(e) =>
                  setPayload({ ...payload, searchKey: e?.target?.value })
                }
              />
            </form>
          </div>
          
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
                  <th className="">Sr No.</th>
                  <th className="">Organisation</th>
                  <th className="">Batch</th>
                  <th>Amount</th>
                  <th className="text-center">No. Of Student</th>

                  <th className="text-center">Created By</th>
                  <th className="text-center">Users</th>

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
                          <td className="text-center">
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
                          <td>
                            {i + 1 + (payload?.pageNo - 1) * payload?.pageCount}
                          </td>
                          <td>
                            {v?.organisation}
                          </td>
                           <td>
                            {v?.batchId?.name}
                          </td>
                          <td>
                            {v?.finalAmount}
                          </td>
                          <td className="text-center">
                            {v?.noOfStudent || 0}
                          </td>

                          <td className="text-center">
                            {v?.createdBy?.firstName + v?.createdBy?.lastName}
                          </td>
                          <td className="text-center">
                            <u onClick={()=>toast.warning("Work in progress")}>View Users</u>
                          </td>

                          <td style={{ textAlign: "center" }}>
                            {permissions?.includes("Categories-Edit") && (
                              <a
                                onClick={() =>
                                  setEditFormData({
                                    name: v?.name,
                                    image:v?.image,
                                    coverImage:v?.coverImage,
                                    status: v?.status,
                                    specialApperence:v?.specialApperence,
                                    _id: v?._id,
                                  })
                                }
                                className="text-primary text-decoration-underline me-2"
                              >
                                <i class="bi bi-pencil fs-6"></i>
                              </a>
                            )}
                            {permissions?.includes("Categories-Delete") && (
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
              style={{ borderRadius: "8px", width: "500px" }}
            >
              <div className="modal-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="m-0">Add New Booking</h5>
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
                    name: "",
                    status: "",
                    specialApperence: "",
                    image: null,
                    coverImage: null,
                  }}
                  validationSchema={BookingSchema}
                  onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                      await handleAddBooking(values);
                      resetForm();
                      setAddFormData({ ...addFormData, show: false });
                    } catch (error) {
                      console.error("Add failed", error);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                >
                  {({ isSubmitting, setFieldValue, values }) => (
                   <Form>
  <div className="row">
    {/* Organisation */}
    <div className="col-12 mb-2">
      <label className="small mb-1">Organisation</label>
      <Field name="organisation" className="form-control" />
      <ErrorMessage name="organisation" component="div" className="text-danger small" />
    </div>

    {/* Batch Dropdown */}
    <div className="col-12 mb-2">
      <label className="small mb-1">Select Batch</label>
      <Field as="select" name="batchId" className="form-control">
        <option value="">-- Select Batch --</option>
        {batches.map((b) => (
          <option key={b._id} value={b._id}>{b.name}</option>
        ))}
      </Field>
      <ErrorMessage name="batchId" component="div" className="text-danger small" />
    </div>

    {/* Multi-Select Users */}
    <div className="col-12 mb-2">
      <label className="small mb-1">Select Users</label>
      <Select
        isMulti
        options={allUsers} // Format: [{value: 'id', label: 'name'}]
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={(opt) => {
          setFieldValue("UserIds", opt);
          setFieldValue("noOfStudent", opt ? opt.length : 0); // Automatic count update
        }}
      />
      <ErrorMessage name="UserIds" component="div" className="text-danger small" />
    </div>

    {/* Final Amount */}
    <div className="col-6 mb-2">
      <label className="small mb-1">Final Amount</label>
      <Field name="finalAmount" type="number" className="form-control" />
    </div>

    {/* No Of Students (Read Only kyunki users se calculate ho raha hai) */}
    <div className="col-6 mb-2">
      <label className="small mb-1">No. Of Students</label>
      <Field name="noOfStudent" type="number" className="form-control" readOnly />
    </div>
  </div>

  <button className="btn bgThemePrimary w-100 mt-3" type="submit">
    Submit Booking
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
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{ borderRadius: "8px", width: "500px" }}
            >
              <div className="modal-body">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <h5 className="m-0">Update Booking</h5>
                  <img
                    onClick={() => setEditFormData({ show: false })}
                    src="https://cdn-icons-png.flaticon.com/128/2734/2734822.png"
                    style={{ height: "20px", cursor: "pointer" }}
                    alt="close"
                  />
                </div>

                <Formik
                  initialValues={{
                    name: editFormData?.name || "",
                    status: editFormData?.status?.toString() || "",
                    specialApperence: editFormData?.specialApperence || "",
                    image: editFormData?.image || "",
                    coverImage: editFormData?.coverImage || "",
                  }}
                  validationSchema={BookingSchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      await handleUpdateBooking(values);
                    } catch (error) {
                      console.error("Update failed", error);
                    } finally {
                      setSubmitting(false);
                    }
                  }}
                  enableReinitialize
                >
                  {({ isSubmitting, dirty, setFieldValue, values }) => (
                    <Form>
  <div className="row">
    {/* Organisation */}
    <div className="col-12 mb-2">
      <label className="small mb-1">Organisation</label>
      <Field name="organisation" className="form-control" />
      <ErrorMessage name="organisation" component="div" className="text-danger small" />
    </div>

    {/* Batch Dropdown */}
    <div className="col-12 mb-2">
      <label className="small mb-1">Select Batch</label>
      <Field as="select" name="batchId" className="form-control">
        <option value="">-- Select Batch --</option>
        {batches.map((b) => (
          <option key={b._id} value={b._id}>{b.name}</option>
        ))}
      </Field>
      <ErrorMessage name="batchId" component="div" className="text-danger small" />
    </div>

    {/* Multi-Select Users */}
    <div className="col-12 mb-2">
      <label className="small mb-1">Select Users</label>
      <Select
        isMulti
        options={allUsers} // Format: [{value: 'id', label: 'name'}]
        className="basic-multi-select"
        classNamePrefix="select"
        onChange={(opt) => {
          setFieldValue("UserIds", opt);
          setFieldValue("noOfStudent", opt ? opt.length : 0); // Automatic count update
        }}
      />
      <ErrorMessage name="UserIds" component="div" className="text-danger small" />
    </div>

    {/* Final Amount */}
    <div className="col-6 mb-2">
      <label className="small mb-1">Final Amount</label>
      <Field name="finalAmount" type="number" className="form-control" />
    </div>

    {/* No Of Students (Read Only kyunki users se calculate ho raha hai) */}
    <div className="col-6 mb-2">
      <label className="small mb-1">No. Of Students</label>
      <Field name="noOfStudent" type="number" className="form-control" readOnly />
    </div>
  </div>

  <button className="btn bgThemePrimary w-100 mt-3" type="submit">
    Submit Booking
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
        title="Booking Delete"
        body="Do you really want to delete this Booking?"
      />
    </div>
  );
}

export default BulkBooking;
