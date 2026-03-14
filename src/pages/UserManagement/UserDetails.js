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
function UserDetails() {
  const [details, setDetails] = useState([]);
  const navigate = useNavigate();
  const params = useParams();
  const [showSkelton, setShowSkelton] = useState(false);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    pincode: "",
    address: "",
    state: "",
    city: "",
    dob: "",
    gender: "",
    profilePic: "",
  });
  const getUserDetailsFunc = async (id) => {
    setShowSkelton(true);
    try {
      let response = await getUserDetailsServ(id);
      if (response?.data?.statusCode == "200") {
        setDetails(response?.data?.data);
        let userDetails = response?.data?.data;
        setFormData({
          firstName: userDetails?.firstName,
          lastName: userDetails?.lastName,
          email: userDetails?.email,
          phone: userDetails?.phone,
          pincode: userDetails?.pincode,
          address: userDetails?.address,
          state: userDetails?.state,
          city: userDetails?.city,
          dob: userDetails?.dob,
          gender: userDetails?.gender,
          profilePic: "",
          profilePrev: userDetails?.profilePrev,
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
                    (v?.name == "Personal" ? " active" : " ")
                  }
                  onClick={()=>navigate(v?.path)}
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
                <label className="form-label">First Name</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly={!isEditable}
                  value={formData?.firstName}
                  style={{background: !isEditable? "whitesmoke":"white"}}
                  onChange={(e)=>setFormData({...formData, firstName:e?.target?.value})}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Last Name</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData?.lastName}
                  readOnly={!isEditable}
                  style={{background: !isEditable? "whitesmoke":"white"}}
                  onChange={(e)=>setFormData({...formData, lastName:e?.target?.value})}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Email</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData?.email}
                  readOnly={!isEditable}
                  style={{background: !isEditable? "whitesmoke":"white"}}
                  onChange={(e)=>setFormData({...formData, email:e?.target?.value})}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Phone Number</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData?.phone}
                  readOnly={!isEditable}
                  style={{background: !isEditable? "whitesmoke":"white"}}
                  onChange={(e)=>setFormData({...formData, phone:e?.target?.value})}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Date Of Birth</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData?.dob}
                  readOnly={!isEditable}
                  style={{background: !isEditable? "whitesmoke":"white"}}
                  onChange={(e)=>setFormData({...formData, dob:e?.target?.value})}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Gender</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData?.gender}
                  readOnly={!isEditable}
                  style={{background: !isEditable? "whitesmoke":"white"}}
                  onChange={(e)=>setFormData({...formData, gender:e?.target?.value})}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">City</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData?.city}
                  readOnly={!isEditable}
                  style={{background: !isEditable? "whitesmoke":"white"}}
                  onChange={(e)=>setFormData({...formData, city:e?.target?.value})}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Pincode</label>
                <input
                  type="text"
                  className="form-control"
                  value={formData?.pincode}
                 readOnly={!isEditable}
                  style={{background: !isEditable? "whitesmoke":"white"}}
                  onChange={(e)=>setFormData({...formData, pincode:e?.target?.value})}
                />
              </div>
              <div className="col-12">
                <label className="form-label">Address</label>
                <textarea
                  className="form-control"
                  rows={2}
                  value={formData?.address}
                 readOnly={!isEditable}
                  style={{background: !isEditable? "whitesmoke":"white"}}
                  onChange={(e)=>setFormData({...formData, address:e?.target?.value})}
                />
              </div>
              {/* <div className="d-flex justify-content-end">
                <div className="btn btn-secondary mx-2" onClick={()=>{setIsEditable(!isEditable); isEditable ? toast.info("Fields are set to be readonly"): toast.info("You can now start editing the fields")}}>Enable Editing</div>
                <div className="btn bgThemePrimary" onClick={()=>toast.info("Work in progress")}>Submit</div>
              </div> */}
            </div>
          </div>
        </div>
        {/* Employment Tab */}
        <div
          className="tab-pane fade show"
          id="employment"
          role="tabpanel"
          aria-labelledby="employment-tab"
        >
          <div className="card shadow-sm border-0 p-4 mb-4 bg-light">
            <div className="row g-3">
              <div className="col-md-6">
                <label className="form-label">Employment Type</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly=""
                  defaultValue="Shubham"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Monthly Income</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly=""
                  defaultValue="Singh"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Annual Income</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly=""
                  defaultValue="hittheshubham1810@gmail.com"
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">KYC Status</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly=""
                  defaultValue={7762042085}
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Credit Score</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly=""
                  defaultValue=""
                />
              </div>
              <div className="col-md-6">
                <label className="form-label">Dept To Income Ratio</label>
                <input
                  type="text"
                  className="form-control"
                  readOnly=""
                  defaultValue=""
                />
              </div>
              <div className="btn btn-primary">Submit</div>
            </div>
          </div>
        </div>
        {/* Documents Tab */}
        <div
          className="tab-pane fade show"
          id="documents"
          role="tabpanel"
          aria-labelledby="documents-tab"
        >
          <div className="table-container">
            <table id="usersTable" className="table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Document Name</th>
                  <th>Image</th>
                  <th>View</th>
                  <th>Download</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Aadhar Card</td>
                  <td>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/11976/11976729.png"
                      style={{ height: 50 }}
                    />
                  </td>
                  <td>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/535/535193.png"
                      style={{ height: 25 }}
                    />
                  </td>
                  <td>
                    <button className="btn btn-success">Download</button>
                  </td>
                  <td>
                    <span className="status-badge status-primary">
                      Approved
                    </span>
                  </td>
                  <td>
                    <select className="p-2 border rounded">
                      <option>Action</option>
                      <option>Approve</option>
                      <option>Reject</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>PAN Card</td>
                  <td>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/11976/11976729.png"
                      style={{ height: 50 }}
                    />
                  </td>
                  <td>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/535/535193.png"
                      style={{ height: 25 }}
                    />
                  </td>
                  <td>
                    <button className="btn btn-success">Download</button>
                  </td>
                  <td>
                    <span className="status-badge status-pending">Pending</span>
                  </td>
                  <td>
                    <select className="p-2 border rounded">
                      <option>Action</option>
                      <option>Approve</option>
                      <option>Reject</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>DL</td>
                  <td>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/11976/11976729.png"
                      style={{ height: 50 }}
                    />
                  </td>
                  <td>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/535/535193.png"
                      style={{ height: 25 }}
                    />
                  </td>
                  <td>
                    <button className="btn btn-success">Download</button>
                  </td>
                  <td>
                    <span className="status-badge status-primary">
                      Approved
                    </span>
                  </td>
                  <td>
                    <select className="p-2 border rounded">
                      <option>Action</option>
                      <option>Approve</option>
                      <option>Reject</option>
                    </select>
                  </td>
                </tr>
                <tr>
                  <td>Voter Card</td>
                  <td>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/11976/11976729.png"
                      style={{ height: 50 }}
                    />
                  </td>
                  <td>
                    <img
                      src="https://cdn-icons-png.flaticon.com/128/535/535193.png"
                      style={{ height: 25 }}
                    />
                  </td>
                  <td>
                    <button className="btn btn-success">Download</button>
                  </td>
                  <td>
                    <span className="status-badge status-pending">Pending</span>
                  </td>
                  <td>
                    <select className="p-2 border rounded">
                      <option>Action</option>
                      <option>Approve</option>
                      <option>Reject</option>
                    </select>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Loan History Tab */}
        <div
          className="tab-pane fade show"
          id="loanhistory"
          role="tabpanel"
          aria-labelledby="loanhistory-tab"
        >
          <div className="table-container">
            <table id="usersTable" className="table" style={{ width: "100%" }}>
              <thead>
                <tr>
                  <th>Application ID</th>
                  <th>Loan Type</th>
                  <th>Amount</th>
                  <th>Start Date</th>
                  <th>End Date</th>
                  <th>Duration</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>001</td>
                  <td>Personal loan</td>
                  <td>30000</td>
                  <td>12 Sep, 2025</td>
                  <td>12 Oct, 2025</td>
                  <td>12 months</td>
                  <td>
                    <span className="status-badge status-primary">
                      Approved
                    </span>
                  </td>
                </tr>
                <tr>
                  <td>002</td>
                  <td>Gold loan</td>
                  <td>50000</td>
                  <td>12 Oct, 2025</td>
                  <td>12 Oct, 2026</td>
                  <td>12 months</td>
                  <td>
                    <span className="status-badge status-pending">Pending</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        {/* Other tabs can be structured similarly */}
      </div>
    </div>
  );
}

export default UserDetails;
