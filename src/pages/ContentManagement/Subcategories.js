import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getCategoryDetailsServ,
  getCategoryServ,
  addCategoryServ,
  updateCategoryServ,
  deleteCategoryServ,
} from "../../services/category.service";
import {
  getSubCategoryServ,
  addSubCategoryServ,
  updateSubCategoryServ,
  deleteSubCategoryServ,
} from "../../services/subCategory.service";
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
function Subcategories() {
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
      let response = await getSubCategoryServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
        setDocumentCount(response?.data?.documentCount);
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };
  const [categoryList, setCategoryList] = useState([]);
  const getCategoryFunc = async () => {
    try {
      let response = await getCategoryServ({ status: true });
      if (response?.data?.statusCode == "200") {
        setCategoryList(response?.data?.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    getListFunc();
    getCategoryFunc();
  }, [payload]);
  const [addFormData, setAddFormData] = useState({
    name: "",
    status: "",
    specialApperence: "",
    image: "",
    categoryId: "",
    show: false,
  });
  const [editFormData, setEditFormData] = useState({
    name: "",
    status: "",
    specialApperence: "",
    image: "",
    categoryId: "",
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
      label: "Total Sub-categories",
      icon: "bi bi-diagram-3",
      count: documentCount?.totalCount,
      iconColor: "#010a2d",
    },
    {
      label: "Active Sub-categories",
      icon: "bi bi-diagram-3",
      count: documentCount?.activeCount,
      iconColor: "green",
    },
    {
      label: "Inactive Sub-categories",
      icon: "bi bi-diagram-3",
      count: documentCount?.inactiveCount,
      iconColor: "red",
    },
  ];
  const handleDeleteFunc = async (id) => {
    try {
      let response = await deleteSubCategoryServ(deleteId);
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
    status: Yup.string().trim().required("Status is required"),
    categoryId: Yup.string().trim().required("Category is required"),
    specialApperence: Yup.string()
      .trim()
      .required("Special appearance field is required"),
    image: Yup.mixed().required("Main image is required"),
  });
  const handleAddSubCategory = async (values) => {
    try {
      const formData = new FormData();
      Object.keys(values).forEach((key) => {
        if (key === "image") {
          if (values.image instanceof File) {
            formData.append("image", values.image);
          }
        } else {
          formData.append(key, values[key]);
        }
      });
      let response = await addSubCategoryServ(formData);
      if (response?.data?.statusCode == "200") {
        setAddFormData({
          name: "",
          status: "",
          specialApperence: "",
          image: "",
          categoryId: "",
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
  const handleUpdateSubCategory = async (value) => {
    try {
      let response = await updateSubCategoryServ({
        ...value,
        _id: editFormData?._id,
      });
      if (response?.data?.statusCode == "200") {
        setEditFormData({
          name: "",
          status: "",
          specialApperence: "",
          image: "",
          categoryId: "",
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
        <h4 className="mb-0">Sub-categories</h4>
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
          {permissions?.includes("Categories-Create") && (
            <button
              className="btn  bgThemePrimary shadow-sm"
              onClick={() => setAddFormData({ ...addFormData, show: true })}
            >
              + Add Sub-category
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
                  <th className="">Hero Image</th>
                  <th>Name</th>
                  <th className="text-center">Status</th>
                  <th className="text-center">Special Apperence</th>
                  <th className="text-center">Category</th>
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
                            <h6 style={{ fontSize: "14px" }}>{v?.name}</h6>{" "}
                          </td>

                          <td className="text-center">
                            {renderProfile(v?.status)}
                          </td>
                          <td className="text-center">{v?.specialApperence}</td>
                          <td className="text-center">{v?.categoryId?.name}</td>

                          <td style={{ textAlign: "center" }}>
                            {permissions?.includes("Categories-Edit") && (
                              <a
                                onClick={() =>
                                  setEditFormData({
                                    name: v?.name,
                                    image:v?.image,
                                    categoryId:v?.categoryId?._id,
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
                  <h5 className="m-0">Add Sub-category</h5>
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
                    categoryId: "",
                  }}
                  validationSchema={CategorySchema}
                  onSubmit={async (values, { setSubmitting, resetForm }) => {
                    try {
                      await handleAddSubCategory(values);
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
                        {/* Name */}
                        <div className="col-12 mb-2">
                          <label className="small mb-1">
                            Name <span className="text-danger">*</span>
                          </label>
                          <Field
                            name="name"
                            className="form-control"
                            placeholder="Enter category name"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label className="small mb-1">
                            Category <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="select"
                            name="categoryId"
                            className="form-control"
                          >
                            <option value="">Select Category</option>
                            {categoryList?.map((v, i) => {
                              return <option value={v?._id}>{v?.name}</option>;
                            })}
                          </Field>
                          <ErrorMessage
                            name="categoryId"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        <div className="col-12 mb-3">
                          <label className="small mb-1">
                            Special Apperence{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="select"
                            name="specialApperence"
                            className="form-control"
                          >
                            <option value="">Select Apperence</option>
                            <option value="Home">Home</option>
                          </Field>
                          <ErrorMessage
                            name="specialApperence"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        {/* Status */}
                        <div className="col-12 mb-3">
                          <label className="small mb-1">
                            Status <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="select"
                            name="status"
                            className="form-control"
                          >
                            <option value="">Select Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </Field>
                          <ErrorMessage
                            name="status"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        {/* Image Uploads */}
                        <div className="col-6 mb-2 text-center">
                          <label className="small d-block text-start">
                            Main Image
                          </label>
                          <input
                            type="file"
                            id="addImage"
                            hidden
                            accept="image/*"
                            onChange={(e) =>
                              setFieldValue("image", e.target.files[0])
                            }
                          />
                          <label
                            htmlFor="addImage"
                            className="cursor-pointer d-block border p-2"
                            style={{ borderStyle: "dashed" }}
                          >
                            {values.image ? (
                              <img
                                src={URL.createObjectURL(values.image)}
                                style={{
                                  width: "100%",
                                  height: "80px",
                                  objectFit: "cover",
                                }}
                                alt="preview"
                              />
                            ) : (
                              <div className="small text-muted py-3">
                                Click to Upload
                              </div>
                            )}
                          </label>
                          <ErrorMessage
                            name="image"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        
                      </div>

                      <button
                        className="btn bgThemePrimary w-100 mt-3"
                        type="submit"
                        disabled={isSubmitting}
                      >
                        {isSubmitting ? "Submitting..." : "Submit Category"}
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
                  <h5 className="m-0">Update Sub-Category</h5>
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
                    categoryId: editFormData?.categoryId || "",
                  }}
                  validationSchema={CategorySchema}
                  onSubmit={async (values, { setSubmitting }) => {
                    try {
                      await handleUpdateSubCategory(values);
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
                        {/* Name Field */}
                        <div className="col-12 mb-2">
                          <label className="small mb-1">
                            Name <span className="text-danger">*</span>
                          </label>
                          <Field
                            name="name"
                            className="form-control"
                            type="text"
                          />
                          <ErrorMessage
                            name="name"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                        <div className="col-12 mb-3">
                          <label className="small mb-1">
                            Category <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="select"
                            name="categoryId"
                            className="form-control"
                          >
                            <option value="">Select Category</option>
                            {categoryList?.map((v, i) => {
                              return <option value={v?._id}>{v?.name}</option>;
                            })}
                          </Field>
                          <ErrorMessage
                            name="categoryId"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        {/* Special Appearance Field */}
                        <div className="col-12 mb-2">
                          <label className="small mb-1">
                            Special Appearance{" "}
                            <span className="text-danger">*</span>
                          </label>
                          <Field
                            name="specialApperence"
                            className="form-control"
                            type="text"
                          />
                          <ErrorMessage
                            name="specialApperence"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        {/* Status Field */}
                        <div className="col-12 mb-3">
                          <label className="small mb-1">
                            Status <span className="text-danger">*</span>
                          </label>
                          <Field
                            as="select"
                            name="status"
                            className="form-control"
                          >
                            <option value="">Select Status</option>
                            <option value="true">Active</option>
                            <option value="false">Inactive</option>
                          </Field>
                          <ErrorMessage
                            name="status"
                            component="div"
                            className="text-danger small"
                          />
                        </div>

                        {/* Images Row */}
                        <div className="col-6 mb-2 text-center">
                          <label className="small d-block text-start">
                            Main Image
                          </label>
                          <input
                            type="file"
                            id="image"
                            hidden
                            onChange={(e) =>
                              setFieldValue("image", e.target.files[0])
                            }
                          />
                          <label htmlFor="image" className="cursor-pointer">
                            <img
                              src={
                                typeof values.image === "string"
                                  ? values.image
                                  : URL.createObjectURL(values.image)
                              }
                              style={{
                                width: "80px",
                                height: "80px",
                                objectFit: "cover",
                                border: "1px solid #ddd",
                              }}
                              alt="main"
                            />
                          </label>
                          <ErrorMessage
                            name="image"
                            component="div"
                            className="text-danger small"
                          />
                        </div>
                      </div>

                      <button
                        className="btn bgThemePrimary w-100 mt-3"
                        type="submit"
                        disabled={isSubmitting || !dirty}
                      >
                        {isSubmitting ? "Updating..." : "Update Category"}
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
        title="Sub-category Delete"
        body="Do you really want to delete this Sub-category?"
      />
    </div>
  );
}

export default Subcategories;
