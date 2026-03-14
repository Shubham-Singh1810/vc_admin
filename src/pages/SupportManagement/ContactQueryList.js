import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getContactListServ,
  updateContactListServ,
} from "../../services/support.service";
import { loanTypeListServ } from "../../services/loan.services";
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
function ContactQuesryList() {
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
      let response = await getContactListServ(payload);
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
      label: "Total Queries",
      icon: "bi bi-diagram-3",
      count: documentCount?.totalCount,

      iconColor: "#010a2d",
    },
    {
      label: "Replied Queries",
      icon: "bi bi-diagram-3",
      count: documentCount?.activeCount,

      iconColor: "green",
    },
    {
      label: "Pending Queries",
      icon: "bi bi-diagram-3",
      count: documentCount?.inactiveCount,

      iconColor: "red",
    },
  ];
  const [editFormData, setEditFormData] = useState({
    firstName: "",
    lastName: "",
    contactNumber: "",
    email: "",
    subject: "",
    message: "",
    _id: "",
    isResponded: false,
    respondedVia: "",
    note: "",
  });
  const ContactSchema = Yup.object().shape({
    firstName: Yup.string()
      .trim()
      .required("First Name is required"), // "Question" hata kar "First Name" kiya
      
    lastName: Yup.string()
      .trim()
      .required("Last Name is required"), // "Answer" hata kar "Last Name" kiya
      
    email: Yup.string()
      .trim()
      .email("Invalid email format") // Email format check bhi add kar diya
      .required("Email is required"), // "Category" hata kar "Email" kiya
      
    contactNumber: Yup.string()
      .trim()
      .required("Contact Number is required"),
      
    subject: Yup.string()
      .trim()
      .required("Subject is required"),
      
    message: Yup.string()
      .trim()
      .required("Message is required"),
      
    isResponded: Yup.boolean(),
    
    respondedVia: Yup.string()
      .trim()
      .nullable(), 
      
    note: Yup.string()
      .trim()
      .nullable(),
  });
  const handleUpdateContact = async (value) => {
    try {
      let response = await updateContactListServ({
        ...value,
        _id: editFormData?._id,
      });
      if (response?.data?.statusCode == "200") {
        setEditFormData({
          firstName: "",
          lastName: "",
          contactNumber: "",
          email: "",
          subject: "",
          message: "",
          _id: "",
          isResponded: false,
          respondedVia: "",
          note: "",
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
        <h4 className="mb-0">Contact Query</h4>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center px-2 user-search">
            <form className="input-group search ms-2 d-none d-md-flex">
              <span className="input-group-text input-span">
                <i className="bi bi-search" />
              </span>
              <input
                type="search"
                className="form-control search-input"
                placeholder="Subject, message, email ..."
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
              {payload?.isResponded === true
                ? "Replied"
                : payload?.isResponded === false
                ? "Pending"
                : "Select Status"}
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, isResponded: "" })}
                >
                  Select Status
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() =>
                    setPayload({ ...payload, isResponded: "true" })
                  }
                >
                  Replied
                </button>
              </li>
              <li>
                <button
                  className="dropdown-item"
                  onClick={() =>
                    setPayload({ ...payload, isResponded: "false" })
                  }
                >
                  Pending
                </button>
              </li>
            </ul>
          </div>
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
                  <th>User Name</th>
                  <th>Phone</th>
                  <th>Email</th>
                  <th>Subject</th>
                  <th style={{ width: "300px" }}>Message</th>
                  {permissions?.includes("Contact Queries-Update") && <th className="text-center">Action</th>}
                  
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
                            <Skeleton width={300} />
                          </td>
                          {permissions?.includes("Contact Queries-Update") && (<td className="text-center">
                            <Skeleton width={100} />
                          </td>)}
                          
                        </tr>
                      );
                    })
                  : list?.map((v, i) => {
                      return (
                        <tr>
                          <td className="text-center">
                            {i + 1 + (payload?.pageNo - 1) * payload?.pageCount}
                          </td>
                          <td>{v?.firstName + " " + v?.lastName}</td>

                          <td>{v?.contactNumber}</td>
                          <td>{v?.email}</td>
                          <td>{v?.subject}</td>
                          <td>{v?.message}</td>
                          {permissions?.includes("Contact Queries-Update") && (
                            <td style={{ textAlign: "center" }}>
                              {v?.isResponded ? (
                                <button
                                  className="btn btn-sm btn-info"
                                  onClick={() =>
                                    setEditFormData({
                                      firstName: v?.firstName,
                                      lastName: v?.lastName,
                                      contactNumber: v?.contactNumber,
                                      email: v?.email,
                                      subject: v?.subject,
                                      message: v?.message,
                                      _id: v?._id,
                                      isResponded: v?.isResponded,
                                      respondedVia: v?.respondedVia,
                                      note: v?.note,
                                    })
                                  }
                                >
                                  Replied
                                </button>
                              ) : (
                                <button
                                  className="btn btn-sm btn-warning"
                                  onClick={() =>
                                    setEditFormData({
                                      firstName: v?.firstName,
                                      lastName: v?.lastName,
                                      contactNumber: v?.contactNumber,
                                      email: v?.email,
                                      subject: v?.subject,
                                      message: v?.message,
                                      _id: v?._id,
                                    })
                                  }
                                >
                                  Pending
                                </button>
                              )}
                            </td>
                          )}
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
                      <h5 className="">Query</h5>
                      <img
                        onClick={() =>
                          setEditFormData({
                            firstName: "",
                            lastName: "",
                            contactNumber: "",
                            email: "",
                            subject: "",
                            message: "",
                            _id: "",
                            isResponded: "",
                            note: "",
                            respondedVia: "",
                          })
                        }
                        src="https://cdn-icons-png.flaticon.com/128/2734/2734822.png"
                        style={{ height: "20px", cursor: "pointer" }}
                      />
                    </div>

                    {/* ✅ Formik Form Start */}
                    <Formik
                      initialValues={{
                        firstName: editFormData?.firstName,
                        lastName: editFormData?.lastName,
                        contactNumber: editFormData?.contactNumber,
                        email: editFormData?.email,
                        subject: editFormData?.subject,
                        message: editFormData?.message,
                        _id: editFormData?._id,
                        isResponded: editFormData?.isResponded || "",
                        respondedVia: editFormData?.respondedVia,
                        note: editFormData?.note,
                      }}
                      validationSchema={ContactSchema}
                      
                       onSubmit={async (values, { setSubmitting }) => {
                        try {
                          await handleUpdateContact(values);
                        } catch (error) {
                          console.error("Add failed", error);
                        } finally {
                          setSubmitting(false); 
                        }
                      }}
                      enableReinitialize
                    >
                      {({ isSubmitting, dirty }) => (
                        <Form>
                          <div className="row">
                            {/* ✅ First Name */}
                            <div className="col-6">
                              <label className="mt-3">First Name</label>
                              <Field
                                className="form-control"
                                type="text"
                                name="firstName"
                                disabled
                                style={{ background: "whitesmoke" }}
                              />
                              <ErrorMessage
                                name="firstName"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* ✅ Last Name */}
                            <div className="col-6">
                              <label className="mt-3">Last Name</label>
                              <Field
                                className="form-control"
                                type="text"
                                name="lastName"
                                disabled
                                style={{ background: "whitesmoke" }}
                              />
                              <ErrorMessage
                                name="lastName"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* ✅ Contact Number */}
                            <div className="col-6">
                              <label className="mt-3">Contact Number</label>
                              <Field
                                className="form-control"
                                type="text"
                                name="contactNumber"
                                disabled
                                style={{ background: "whitesmoke" }}
                              />
                              <ErrorMessage
                                name="contactNumber"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* ✅ Email */}
                            <div className="col-6">
                              <label className="mt-3">Email</label>
                              <Field
                                className="form-control"
                                type="email"
                                name="email"
                                disabled
                                style={{ background: "whitesmoke" }}
                              />
                              <ErrorMessage
                                name="email"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* ✅ Subject */}
                            <div className="col-12">
                              <label className="mt-3">Subject</label>
                              <Field
                                className="form-control"
                                type="text"
                                name="subject"
                                disabled
                                style={{ background: "whitesmoke" }}
                              />
                              <ErrorMessage
                                name="subject"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* ✅ Message */}
                            <div className="col-12">
                              <label className="mt-3">Message</label>
                              <Field
                                as="textarea"
                                rows={3}
                                className="form-control"
                                name="message"
                                disabled
                                style={{ background: "whitesmoke" }}
                              />
                              <ErrorMessage
                                name="message"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* ✅ Is Responded */}
                            <div className="col-6">
                              <label className="mt-3">Responded?</label>
                              <Field
                                as="select"
                                className="form-control"
                                name="isResponded"
                              >
                                <option value="">Select</option>
                                <option value="true">Yes</option>
                                <option value="false">No</option>
                              </Field>
                              <ErrorMessage
                                name="isResponded"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* ✅ Responded Via */}
                            <div className="col-6">
                              <label className="mt-3">Responded Via</label>
                              <Field
                                className="form-control"
                                type="text"
                                name="respondedVia"
                                placeholder="e.g. Email, Phone"
                              />
                              <ErrorMessage
                                name="respondedVia"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            {/* ✅ Note */}
                            <div className="col-12">
                              <label className="mt-3">Note</label>
                              <Field
                                as="textarea"
                                rows={2}
                                className="form-control"
                                name="note"
                              />
                              <ErrorMessage
                                name="note"
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
    </div>
  );
}

export default ContactQuesryList;
