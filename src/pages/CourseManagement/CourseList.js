import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {deleteCourseServ, getCourseServ} from "../../services/course.services"
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
function CourseList() {
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
      let response = await getCourseServ(payload);
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
    if (status=="ongoing") {
      return (
        <span className="status-badge bg-primary-subtle text-primary">
          Ongoing
        </span>
      );
    }else if (status=="upcoming") {
      return (
        <span className="status-badge bg-warning-subtle text-warning">
          Upcoming
        </span>
      );
    } else  {
      return (
        <span className="status-badge bg-success-subtle text-success">
          Completed
        </span>
      );
    }
  };
  const staticsData = [
    {
      label: "Total Courses",
      icon: "bi bi-stack",
      count: documentCount?.totalCount,

      iconColor: "#010a2d",
    },
    {
      label: "Ongoing Courses",
      icon: "bi bi-stack",
      count: documentCount?.activeCount,
      iconColor: "blue",
    },
    {
      label: "Upcoming Courses",
      icon: "bi bi-stack",
      count: documentCount?.upcomingCount,
      iconColor: "brown",
    },
    {
      label: "Completed Courses",
      icon: "bi bi-stack",
      count: documentCount?.completedCount,
      iconColor: "green",
    },
  ];
  const handleDeleteFunc = async (id) => {
    try {
      let response = await deleteCourseServ(deleteId);
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
                <div className="col-12 col-sm-6 col-lg-3">
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
        <h4 className="mb-0">Courses</h4>
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
          
          {permissions?.includes("Categories-Create") && (
            <button
              className="btn  bgThemePrimary shadow-sm"
              onClick={() => navigate("/create-course")}
            >
              + Add Course
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
                  <th>Duration</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Instructor</th>
                  <th>Status</th>
                  <th>Price</th>
               
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
                          <td>
                            
                             <div>
                              {v?.duration}
                            </div>
                          </td>
                          <td style={{width:"300px"}}>
                            {v?.description}
                          </td>
                          <td>{v?.categoryId?.name || "N/A"}</td>
                          <td>{v?.instructorId?.firstName + " "+v?.instructorId?.lastName || "N/A"}</td>
                          <td>{renderProfile(v?.status)}</td>
                          <td><s className="text-danger">{v?.price}</s> {v?.discountedPrice} INR</td>
                          

                          
                         

                          <td style={{ textAlign: "center", width:"100px" }}>
                          <a
                                onClick={() =>
                                  navigate("/course-details/"+v?._id)
                                }
                                className="text-primary text-decoration-underline me-2"
                              >
                                <i class="bi bi-eye fs-6"></i>
                              </a>
                            {permissions?.includes("Categories-Edit") && (
                              <a
                                onClick={() =>
                                  navigate("/update-course/"+v?._id)
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
      
      <ConfirmDeleteModal
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteFunc}
        title="Course Delete"
        body="Do you really want to delete this Course?"
      />
    </div>
  );
}

export default CourseList;
