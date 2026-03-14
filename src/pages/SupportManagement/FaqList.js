import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getFaqListServ,
  deleteFaqServ,
  addFaqServ,
  updateFaqServ,
} from "../../services/faq.service";
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
function FaqList() {
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
      let response = await getFaqListServ(payload);
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
    question: "",
    answer: "",
    category: "",
    status: "",
    show: false,
  });
  const [editFormData, setEditFormData] = useState({
    question: "",
    answer: "",
    category: "",
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
      label: "Total FAQ'S",
      icon: "bi bi-diagram-3",
      count: documentCount?.totalCount,

      iconColor: "#010a2d",
    },
    {
      label: "Active FAQ'S",
      icon: "bi bi-diagram-3",
      count: documentCount?.activeCount,

      iconColor: "green",
    },
    {
      label: "Inactive FAQ'S",
      icon: "bi bi-diagram-3",
      count: documentCount?.inactiveCount,

      iconColor: "red",
    },
  ];
  const handleDeleteFunc = async (id) => {
    try {
      let response = await deleteFaqServ(deleteId);
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
  const FaqSchema = Yup.object().shape({
    question: Yup.string().trim().required("Question is required"),
    answer: Yup.string().trim().required("Answer is required"),
    category: Yup.string().trim().required("Category is required"),
    status: Yup.string().trim().required("Status is required"),
  });
  const handleAddFaq = async (value) => {
    try {
      let response = await addFaqServ(value);
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
  const handleUpdateFaq = async (value) => {
    try {
      let response = await updateFaqServ({
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
      toast?.error("Internal Server Error!");
    }
  };
  const [loanTypeList, setLoanTypeList] = useState([]);
  const getLoanTypeListFunc = async () => {
    try {
      let response = await loanTypeListServ();
      if (response?.data?.statusCode == "200") {
        setLoanTypeList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getLoanTypeListFunc();
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
        <h4 className="mb-0">FAQ'S</h4>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center px-2 user-search">
            <form className="input-group search ms-2 d-none d-md-flex">
              <span className="input-group-text input-span">
                <i className="bi bi-search" />
              </span>
              <input
                type="search"
                className="form-control search-input"
                placeholder="Search ..."
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
              {payload?.category ? payload?.category : "Select Category"}
            </button>
            <ul className="dropdown-menu">
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, category: "" })}
                >
                  Select Category
                </button>
              </li>
              {loanTypeList?.map((v, i) => {
                return (
                  <li>
                    <button
                      className="dropdown-item"
                      onClick={() =>
                        setPayload({ ...payload, category: v?.name })
                      }
                    >
                      {v?.name}
                    </button>
                  </li>
                );
              })}
              <li>
                <button
                  className="dropdown-item"
                  onClick={() => setPayload({ ...payload, category: "Other" })}
                >
                  Other
                </button>
              </li>
            </ul>
          </div>
          {permissions?.includes("FAQ'S-Create") && (
            <button
              className="btn  bgThemePrimary shadow-sm"
              onClick={() => setAddFormData({ ...addFormData, show: true })}
            >
              + Add FAQ
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
                  <th>Question</th>
                  <th style={{ width: "500px" }}>Answer</th>
                  <th>Category</th>
                  <th className="text-center">Status</th>
                   {(permissions?.includes("FAQ'S-Edit") ||
                    permissions?.includes("FAQ'S-Delete")) && (
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
                            <Skeleton width={500} />
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
                          <td>{v?.question}</td>

                          <td>{v?.answer}</td>
                          <td>{v?.category}</td>
                          <td className="text-center">
                            {renderProfile(v?.status)}
                          </td>

                          
                          <td style={{ textAlign: "center" }}>
                            {permissions?.includes("FAQ'S-Edit") && (
                               <a
                              onClick={() =>
                                setEditFormData({
                                  question: v?.question,
                                  answer: v?.answer,
                                  category: v?.category,
                                  status: v?.status,
                                  _id: v?._id,
                                })
                              }
                              className="text-primary text-decoration-underline me-2"
                            >
                              <i class="bi bi-pencil fs-6"></i>
                            </a>
                            )}
                            {permissions?.includes("FAQ'S-Delete") && (
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
                      <h5 className="">Add FAQ</h5>
                      <img
                        onClick={() =>
                          setAddFormData({
                            question: "",
                            answer: "",
                            category: "",
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
                        phone: "",
                        contactPerson: "",
                        status: "",
                        address: "",
                        city: "",
                        state: "",
                        pincode: "",
                        description: "",
                      }}
                      validationSchema={FaqSchema}
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          await handleAddFaq(values);
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
                            <div className="col-12">
                              <label className="mt-3">
                                Question<span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="text"
                                name="question"
                              />
                              <ErrorMessage
                                name="question"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            <div className="col-12">
                              <label className="mt-3">
                                Answer
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="text"
                                name="answer"
                                rows={3}
                                as="textarea"
                              />
                              <ErrorMessage
                                name="answer"
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
                            <div className="col-6">
                              <label className="mt-3">
                                Category<span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className="form-control"
                                name="category"
                              >
                                <option value="">Select Category</option>
                                {loanTypeList?.map((v, i) => {
                                  return (
                                    <option value={v?.name}>{v?.name}</option>
                                  );
                                })}
                                <option value="Other">Other</option>
                              </Field>
                              <ErrorMessage
                                name="category"
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
                      <h5 className="">Update FAQ</h5>
                      <img
                        onClick={() =>
                          setEditFormData({
                            question: "",
                            answer: "",
                            category: "",
                            status: "",
                            _id: "",
                          })
                        }
                        src="https://cdn-icons-png.flaticon.com/128/2734/2734822.png"
                        style={{ height: "20px", cursor: "pointer" }}
                      />
                    </div>

                    {/* ✅ Formik Form Start */}
                    <Formik
                      initialValues={{
                        question: editFormData?.question,
                        answer: editFormData?.answer,
                        category: editFormData?.category,
                        status: editFormData?.status,
                      }}
                      validationSchema={FaqSchema}
                      
                      onSubmit={async (values, { setSubmitting }) => {
                        try {
                          await  handleUpdateFaq(values);
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
                            {/* Name */}
                            <div className="col-12">
                              <label className="mt-3">
                                Question<span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="text"
                                name="question"
                              />
                              <ErrorMessage
                                name="question"
                                component="div"
                                className="text-danger"
                              />
                            </div>

                            <div className="col-12">
                              <label className="mt-3">
                                Answer
                                <span className="text-danger">*</span>
                              </label>
                              <Field
                                className="form-control"
                                type="text"
                                name="answer"
                                rows={3}
                                as="textarea"
                              />
                              <ErrorMessage
                                name="answer"
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
                            <div className="col-6">
                              <label className="mt-3">
                                Category<span className="text-danger">*</span>
                              </label>
                              <Field
                                as="select"
                                className="form-control"
                                name="category"
                              >
                                <option value="">Select Category</option>
                                {loanTypeList?.map((v, i) => {
                                  return (
                                    <option value={v?.name}>{v?.name}</option>
                                  );
                                })}
                                <option value="Other">Other</option>
                              </Field>
                              <ErrorMessage
                                name="category"
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
        title="FAQ Delete"
        body="Do you really want to delete this FAQ?"
      />
    </div>
  );
}

export default FaqList;
