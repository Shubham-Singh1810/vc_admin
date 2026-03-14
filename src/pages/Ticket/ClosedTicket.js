import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
  getTicketListServ,
  ticketCategoryUpdateServ,
  ticketCategoryAddServ,
  ticketCategoryDeleteServ,
} from "../../services/ticker.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../../components/NoDataScreen";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import { Formik, Form, Field, ErrorMessage } from "formik";
import * as Yup from "yup";
import moment from "moment";
import ConfirmDeleteModal from "../../components/ConfirmDeleteModal";
function ClosedTicket() {
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
    status: "close",
  });
  const [documentCount, setDocumentCount] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const getListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getTicketListServ(payload);
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
    if (status == "open") {
      return (
        <span className="status-badge bg-success-subtle text-success">
          Opened
        </span>
      );
    } else {
      return (
        <span className="status-badge bg-danger-subtle text-danger">
          Closed
        </span>
      );
    }
  };
  const staticsData = [
    {
      label: "Total Ticket",
      icon: "bi bi-diagram-3",
      count: documentCount?.totalCount,

      iconColor: "#010a2d",
    },
    {
      label: "Opened Ticket",
      icon: "bi bi-diagram-3",
      count: documentCount?.activeCount,

      iconColor: "green",
    },
    {
      label: "Closed Ticked",
      icon: "bi bi-diagram-3",
      count: documentCount?.inactiveCount,

      iconColor: "red",
    },
  ];
  const handleDeleteFunc = async (id) => {
    try {
      let response = await ticketCategoryDeleteServ(deleteId);
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
  const CategorySchema = Yup.object().shape({
    name: Yup.string().trim().required("Name is required"),
    status: Yup.boolean().required("Status is required"),
  });
  const handleAddCategory = async (value) => {
    try {
      let response = await ticketCategoryAddServ(value);
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
  const handleUpdateCategory = async (value) => {
    try {
      let response = await ticketCategoryUpdateServ({
        ...value,
        _id: editFormData?._id,
      });
      if (response?.data?.statusCode == "200") {
        setEditFormData({
          name: "",
          status: "",
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
        <h4 className="mb-0">Tickets</h4>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center px-2 user-search">
            <form className="input-group search ms-2 d-none d-md-flex">
              <span className="input-group-text input-span">
                <i className="bi bi-search" />
              </span>
              <input
                type="search"
                className="form-control search-input"
                placeholder="Subject..."
                value={payload?.searchKey}
                onChange={(e) =>
                  setPayload({ ...payload, searchKey: e?.target?.value })
                }
              />
            </form>
            
          </div>
          <button
              className="btn  bgThemePrimary shadow-sm"
              // onClick={() => setAddFormData({ ...addFormData, show: true })}
            >
              + Add Ticket
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
                  <th>User</th>
                  <th>Subject</th>
                  <th>Assigned To</th>
                  <th>Category</th>
                  <th className="text-center">Created At</th>

                

                  <th style={{ textAlign: "center" }}>Chat</th>
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
                                  v?.userId?.profilePic
                                    ? v?.userId?.profilePic
                                    : "https://cdn-icons-png.flaticon.com/128/149/149071.png"
                                }
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  borderRadius: "50%",
                                }}
                              />
                              <div className="ms-2">
                                <h6
                                  style={{ fontSize: "12px" }}
                                  className="mb-0"
                                >
                                  {v?.userId?.firstName +
                                    " " +
                                    v?.userId?.lastName}
                                </h6>{" "}
                                <p  style={{ fontSize: "11px" }} className="mb-0">{v?.userId?.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td>{v?.subject}</td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  v?.assignedTo?.profilePic
                                    ? v?.assignedTo?.profilePic
                                    : "https://cdn-icons-png.flaticon.com/128/149/149071.png"
                                }
                                style={{
                                  height: "30px",
                                  width: "30px",
                                  borderRadius: "50%",
                                }}
                              />
                              <div className="ms-2">
                                <h6
                                  style={{ fontSize: "12px" }}
                                  className="mb-0"
                                >
                                  {v?.assignedTo?.firstName +
                                    " " +
                                    v?.assignedTo?.lastName}
                                </h6>{" "}
                                <p  style={{ fontSize: "11px" }} className="mb-0">{v?.assignedTo?.phone}</p>
                              </div>
                            </div>
                          </td>
                          <td>{v?.ticketCategoryId?.name}</td>
                          <td className="text-center">
                            {moment(v?.createdAt).format("DD-MM-YYYY")}

                          </td>
                          <td style={{ textAlign: "center" }}>
                            <a
                              onClick={() => toast.info("Coming Soon")}
                              className="text-primary text-decoration-underline me-2"
                            >
                              <i class="bi bi-chat fs-6"></i>
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

                width: "400px",
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
                      <h5 className="">Add Category</h5>
                      <img
                        onClick={() =>
                          setAddFormData({
                            name: "",

                            status: "",

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

                        status: "",
                      }}
                      validationSchema={CategorySchema}
                      onSubmit={(values) => {
                        handleAddCategory(values);
                      }}
                    >
                      {({ isSubmitting }) => (
                        <Form>
                          <div className="row">
                            {/* Name */}
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
                                <option value={true}>Active</option>
                                <option value={false}>Inactive</option>
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
                width: "400px",
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

                        status: editFormData?.status?.toString() || "",
                      }}
                      validationSchema={CategorySchema}
                      onSubmit={(values) => {
                        handleUpdateCategory(values);
                      }}
                      enableReinitialize
                    >
                      {({ isSubmitting, dirty }) => (
                        <Form>
                          <div className="row">
                            <div className="col-12">
                              <label className="mt-3">Name</label>
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
                              <label className="mt-3">Status</label>
                              <Field
                                as="select"
                                className="form-control"
                                name="status"
                              >
                                <option value="">Select Status</option>
                                <option value={true}>Active</option>
                                <option value={false}>Inactive</option>
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
        title="Support Ticket Delete"
        body="Do you really want to delete this Support Ticket?"
      />
    </div>
  );
}

export default ClosedTicket;
