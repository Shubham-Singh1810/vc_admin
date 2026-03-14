import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import { useNavigate, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../../components/NoDataScreen";
import { toast } from "react-toastify";
import TableNavItems from "../../components/TableNavItems";
import { getCourseDetailsServ } from "../../services/course.services";
import UserList from "../../components/UserList";
import BatchStudentList from "../../components/BatchStudentList";
import TopicList from "../../components/TopicList";
import CourseTopicList from "../../components/CourseTopicList";

function CourseDetails() {
  const navigate = useNavigate();
  const params = useParams();
  const [showSkelton, setShowSkelton] = useState(false);
  const navItems = [
    {
      name: "Details",
      img: "https://cdn-icons-png.flaticon.com/128/2991/2991106.png",
    },
    {
      name: "Students",
      img: "https://cdn-icons-png.flaticon.com/128/9051/9051433.png",
    },
    {
      name: "Topics",
      img: "https://cdn-icons-png.flaticon.com/128/2875/2875830.png",
    },
    {
      name: "Instructor",
      img: "https://cdn-icons-png.flaticon.com/128/11028/11028601.png",
    },
  ];
  const [details, setDetails] = useState(null);
  const getBatchDetailsFunc = async () => {
    setShowSkelton(true);
    try {
      let response = await getCourseDetailsServ(params?.id);
      if (response?.data?.statusCode == "200") {
        setDetails(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };
  useEffect(() => {
    getBatchDetailsFunc();
  }, [params?.id]);
  const batchSection = [
    {
      title: "Basic Information",
      fields: [
        // { label: "Batch Image", name: "image", value:details?.image },
        { label: "Batch Name", name: "name", value:details?.name },
        {
          label: "Status",
          name: "status",
          value:details?.status?.toUpperCase()
        },
        {
          label: "Category",
          name: "categoryId",
          value:details?.categoryId?.name
        },
        {
          label: "Sub Category",
          name: "subCategoryId",
          value:details?.subCategoryId?.name
        },
      ],
    },
    {
      title: "Schedule & Pricing",
      fields: [
        
        { label: "Duration (e.g. 3 Months)", name: "duration", value:details?.duration },
        { label: "Price", name: "price", value:details?.price },
        {
          label: "Discounted Price",
          name: "discountedPrice",
          value:details?.discountedPrice
        },
        {
          label: "Instructor",
          name: "instructorId",
          value:details?.instructorId?.firstName+ " "+details?.instructorId?.lastName
        },
      ],
    },
    {
      title: "Additional Details",
      fields: [
        { label: "Is course certified?", name: "isCertified", value : details?.isCertified ? "Yes":"No" },
      ],
    },
  ];
  
  const [selectedTab, setSelectedTab] = useState("Details");
  
  const renderTabFunc = () => {
    if (selectedTab == "Details") {
      return (
        <div className="tab-content user-detail-page bg-light">
          {/* Personal Tab */}
          <div
            className="tab-pane fade show active"
            id="personal"
            role="tabpanel"
            aria-labelledby="personal-tab"
          >
            <div className="card  border-0 p-2 mb-4 bg-white">
              <div className="row g-3">
                {batchSection.map((section, idx) => (
                  <div className="form-section shadow-sm mb-4" key={idx}>
                    <div className="form-section-header fw-bold mb-3">
                      {section.title}
                    </div>
                    <div className="form-section-body row g-3">
                      {section.fields.map((f, i) => (
                        <div className="col-md-6" key={i}>
                          <label className="form-label">{f.label}</label>
                          <input
                            className="form-control"
                            readOnly
                            value={f?.value}
                          />
                        </div>
                      ))}
                      
                      
                    </div>
                  </div>
                ))}
                <div className="col-md-12">
                        <label className="form-label">Description</label>
                          <textarea
                            className="form-control"
                            readOnly
                            value={details?.description}
                          />
                      </div>
              </div>
            </div>
          </div>
        </div>
      );
    } else if (selectedTab == "Students") {
      return (
        <BatchStudentList/>
      );
    } else if (selectedTab == "Topics") {
      return (
        <CourseTopicList/>
      );
    } else if (selectedTab == "Instructor") {
      return (
        <div className="tab-content user-detail-page bg-light">
          {/* Personal Tab */}
          <div
            className="tab-pane fade show active"
            id="personal"
            role="tabpanel"
            aria-labelledby="personal-tab"
          >
            <div className="card  border-0 p-2 mb-4 bg-white">
              <div className="row g-3">
               
                  <div className="form-section shadow-sm mb-4" >
                    <div className="form-section-header fw-bold mb-3">
                      Details
                    </div>
                    <div className="form-section-body row g-3">
                      <div className="col-md-12">
                        <div>
                          <img style={{height:"100px", width:"100px", borderRadius:"50%"}} src={details?.instructorId?.profilePic  || "https://cdn-icons-png.flaticon.com/128/149/149071.png"}/>
                        </div>
                      </div>
                      <div className="col-md-6">
                          <label className="form-label">Name</label>
                          <input
                            className="form-control"
                            readOnly
                            value={details?.instructorId?.firstName+" "+details?.instructorId?.lastName}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Phone</label>
                          <input
                            className="form-control"
                            readOnly
                            value={details?.instructorId?.phone}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Email</label>
                          <input
                            className="form-control"
                            readOnly
                            value={details?.instructorId?.email}
                          />
                        </div>
                        <div className="col-md-6">
                          <label className="form-label">Status</label>
                          <input
                            className="form-control"
                            readOnly
                            value={details?.instructorId?.status ? "Active":"Inactive"}
                          />
                        </div>
                    </div>
                  </div>
               
              </div>
            </div>
          </div>
        </div>
      );
    } else {
      return <NoDataScreen />;
    }
  };
  return (
    <div className="container-fluid py-3">
      {/* User Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center">
          <img
            src={
              details?.name
                ? details?.image
                : "https://cdn-icons-png.flaticon.com/128/17919/17919876.png"
            }
            className="img-fluid rounded-circle"
            style={{ width: "50px", height: "50px" }}
            alt="Batch"
          />
          <div className="ms-3">
            <h5 className="mb-1">Course : {details?.name}</h5>
            <h6 className="text-secondary">Duration: {details?.duration}</h6>
          </div>
        </div>
      </div>
      {/* Tabs */}
      <div className="d-flex justify-content-between align-items-center w-100">
        <ul
          className="nav nav-tabs mb-4 bg-white  w-100 "
          id="loanTabs"
          role="tablist"
        >
          {navItems?.map((v, i) => {
            return (
              <li className="nav-item   " role="presentation">
                <button
                  className={
                    "nav-link  d-flex align-items-center" +
                    (v?.name == "Details" ? " active" : " ")
                  }
                  onClick={() => setSelectedTab(v?.name)}
                  id="personal-tab"
                  data-bs-toggle="tab"
                  data-bs-target="#personal"
                  type="button"
                  role="tab"
                >
                  <img src={v?.img} className="me-2" width={18} />
                  {v?.name}
                </button>
              </li>
            );
          })}
        </ul>
      </div>
      {showSkelton ? (
        <div className="tab-content user-detail-page bg-light">
          {/* Personal Tab */}
          <div
            className="tab-pane fade show active"
            id="personal"
            role="tabpanel"
            aria-labelledby="personal-tab"
          >
            <div className="card  border-0 p-2 mb-4 bg-white">
              <div className="row g-3">
                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]?.map(
                  (v, i) => {
                    return (
                      <div className="col-md-6">
                        <Skeleton height={20} width={100} />
                        <div className="my-1">
                          <Skeleton height={30} />
                        </div>
                      </div>
                    );
                  }
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        renderTabFunc()
      )}
    </div>
  );
}

export default CourseDetails;
