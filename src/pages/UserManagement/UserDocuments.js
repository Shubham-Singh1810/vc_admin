import React, { useEffect, useState } from "react";
import Sidebar from "../../components/Sidebar";
import TopNav from "../../components/TopNav";
import { useNavigate, useParams } from "react-router-dom";
import { getUserDetailsServ } from "../../services/user.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../../components/NoDataScreen";
import { toast } from "react-toastify";
import TableNavItems from "../../components/TableNavItems";
function UserDocuments() {
  const [details, setDetails] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const [showSkelton, setShowSkelton] = useState(false);
  const [formData, setFormData] = useState({
    panNumber: "",
    aadharNumber: "",
  });
  const getUserDetailsFunc = async (id) => {
    setShowSkelton(true);
    try {
      let response = await getUserDetailsServ(id);
      if (response?.data?.statusCode == "200") {
        setDetails(response?.data?.data);
        let userDetails = response?.data?.data;
        setFormData({
          panNumber: userDetails?.panNumber,
          aadharNumber: userDetails?.aadharNumber,
        });
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };
  useEffect(() => {
    getUserDetailsFunc(params?.id);
  }, [params?.id]);

  const navItems = [
    {
      name: "Personal",
      path: `/user-details/${params?.id}`,
      img: "https://cdn-icons-png.flaticon.com/128/1077/1077114.png",
    },
    {
      name: "Employement Details",
      path: `/user-employemt-details/${params?.id}`,
      img: "https://cdn-icons-png.flaticon.com/128/5078/5078214.png",
    },
    {
      name: "Documents Details",
      path: `/user-documents/${params?.id}`,
      img: "https://cdn-icons-png.flaticon.com/128/2991/2991106.png",
    },
    {
      name: "Loan History",
      path: `/user-loan-history/${params?.id}`,
      img: "https://cdn-icons-png.flaticon.com/128/6619/6619116.png",
    },
    // {
    //   name: "Scheduled EMIs",
    //   path: `/user-emis/${params?.id}`,
    //   img: "https://cdn-icons-png.flaticon.com/128/15233/15233273.png",
    // },
    {
      name: "Transaction History",
      path: `/user-transection-history/${params?.id}`,
      img: "https://cdn-icons-png.flaticon.com/128/879/879890.png",
    },
  ];
  const [isEditable, setIsEditable] = useState(false);
  return (
    <div className="container-fluid py-3">
      {/* User Header */}
      <div className="d-flex justify-content-between align-items-center mb-2">
        <div className="d-flex align-items-center">
          <img
            src="https://cdn-icons-png.flaticon.com/128/3135/3135715.png"
            className="img-fluid rounded-circle"
            width={50}
            alt="User"
          />
          <div className="ms-3">
            <h5 className="mb-1">
              {details?.firstName ? details?.firstName + " " + details?.lastName :"- -"}
            </h5>
            <h6 className="text-secondary">ID: {details?.code}</h6>
          </div>
        </div>
        {/* <div>
          <select className="form-select">
            <option value="">Update Status</option>
            <option value="registered">Registered</option>
            <option value="verified">Verified</option>
            <option value="active">Active</option>
            <option value="blocked">Block</option>
          </select>
        </div> */}
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
                    (v?.name == "Documents Details" ? " active" : " ")
                  }
                  onClick={() => navigate(v?.path)}
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

      {/* Tab Content */}
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
              <div className="col-md-6">
                <label className="form-label">PAN Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData?.panNumber}
                  readOnly={!isEditable}
                  style={{ background: !isEditable ? "whitesmoke" : "white" }}
                  onChange={(e) =>
                    setFormData({ ...formData, panNumber: e?.target?.value })
                  }
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Aadhar Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData?.aadharNumber}
                  readOnly={!isEditable}
                  style={{ background: !isEditable ? "whitesmoke" : "white" }}
                  onChange={(e) =>
                    setFormData({ ...formData, aadharNumber: e?.target?.value })
                  }
                />
              </div>

              {/* <div className="d-flex justify-content-end">
                <div
                  className="btn btn-secondary mx-2"
                  onClick={() => {
                    setIsEditable(!isEditable);
                    isEditable
                      ? toast.info("Fields are set to be readonly")
                      : toast.info("You can now start editing the fields");
                  }}
                >
                  Enable Editing
                </div>
                <div
                  className="btn bgThemePrimary"
                  onClick={() => toast.info("Work in progress")}
                >
                  Submit
                </div>
              </div> */}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default UserDocuments;
