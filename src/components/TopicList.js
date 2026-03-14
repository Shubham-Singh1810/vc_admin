import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getTopicListServ, deleteTopicServ, updateTopicServ } from "../services/topic.services";
import { studentListServ } from "../services/batch.services";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../components/NoDataScreen";
import { toast } from "react-toastify";
import Pagination from "../components/Pagination";
import ConfirmDeleteModal from "../components/ConfirmDeleteModal";
import { useGlobalState } from "../GlobalProvider";
import { useParams } from "react-router-dom";
function TopicList({ profileStatus, title }) {
  const { globalState } = useGlobalState();
  const params = useParams();
  const permissions = globalState?.user?.role?.permissions || [];
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [showSkelton, setShowSkelton] = useState(false);
  const [showStatsSkelton, setShowStatsSkelton] = useState(false);
  const [payload, setPayload] = useState({
    searchKey: "",
    pageNo: 1,
    pageCount: 20,
    profileStatus,
    batchId: params?.id,
  });
  const [documentCount, setDocumentCount] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const getTopicFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }
    try {
      let response = await getTopicListServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
        setTotalCount(response?.data?.documentCount?.totalCount);
        setDocumentCount(response?.data?.documentCount);
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };

  useEffect(() => {
    getTopicFunc();
  }, [payload]);
  const renderProfile = (status) => {
    if (status == "upcoming") {
      return (
        <span className="status-badge bg-info-subtle text-info">Upcoming</span>
      );
    }
    if (status == "completed") {
      return (
        <span className="status-badge bg-warning-subtle text-warning">
          Completed
        </span>
      );
    }
  };

  const staticsData = [
    {
      label: "Total Topics",
      icon: "bi bi-grid-fill",
      count: documentCount?.totalCount,

      iconColor: "#010a2d",
    },
    {
      label: "Active Topics",
      icon: "bi bi-grid-fill",
      count: documentCount?.completedCount,

      iconColor: "green",
    },
    {
      label: "Upcoming Topics",
      icon: "bi bi-grid-fill",
      count: documentCount?.upcomingCount,

      iconColor: "blue",
    },
  ];
  const [showConfirm, setShowConfirm] = useState(false);
  const [deleteId, setDeleteId] = useState(null);
  const handleDeleteFunc = async (id) => {
    try {
      let response = await deleteTopicServ(deleteId);
      if (response?.data?.statusCode == "200") {
        getTopicFunc();
        toast.success(response?.data?.message);
        setShowConfirm(false);
        setDeleteId("");
      }
    } catch (error) {
      toast.error(error?.response?.data?.message);
    }
  };
  const [studentList, setStudentList] = useState([]);
  const getBatchStudents = async () => {
    try {
      let response = await studentListServ(params?.id);
      if (response?.data?.statusCode == "200") {
        setStudentList(response?.data?.data);
      }
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getBatchStudents();
  }, []);
const [attendenceLoader, setAttendenceLoader]=useState(false);
const [attendence, setAttendence]=useState([])
  const markAttendenceFunc =async ()=>{
    setAttendenceLoader(true)
    try {
      let response = await updateTopicServ({_id:selectedTopic?._id, attendence});
      if(response?.data?.statusCode=="200"){
        toast.success(response?.data.message);
        setSelectedTopic(null);
        setAttendence([])
      }
    } catch (error) {
      toast.error(error?.response?.data?.message)
    }
    setAttendenceLoader(false)
  }
  const [selectedTopic, setSelectedTopic]=useState();
  const handleCheckboxChange = (studentId) => {
  setAttendence((prev) => {
    if (prev.includes(studentId)) {
      
      return prev.filter((id) => id !== studentId);
    } else {
      
      return [...prev, studentId];
    }
  });
};
useEffect(() => {
  if (selectedTopic && selectedTopic.attendence) {
    
    setAttendence(selectedTopic.attendence);
  } else {
    
    setAttendence([]);
  }
}, [selectedTopic]);
  return (
    <div className="container-fluid user-table py-3">
      
      <div className="d-flex justify-content-between align-items-center my-4">
        <h4 className="mb-0">{title}</h4>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center px-2 user-search">
            <form className="input-group search ms-2 d-none d-md-flex">
              <span className="input-group-text input-span">
                <i className="bi bi-search" />
              </span>
              <input
                type="search"
                className="form-control search-input"
                placeholder="Topic name"
                value={payload?.searchKey}
                onChange={(e) =>
                  setPayload({ ...payload, searchKey: e?.target?.value })
                }
              />
            </form>
          </div>

          <button
            className="btn bgThemePrimary shadow-sm"
            onClick={() => navigate("/create-topic/" + params?.id)}
          >
            + Add Topic
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
                  <th className="text-center">Day</th>

                  <th>Topic Name</th>

                  <th className="text-center">Status</th>
                  <th className="text-center">Attendence</th>
                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {showSkelton
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <Skeleton className="text-center" />
                          </td>

                          <td>
                            <Skeleton width={100} />
                          </td>

                          <td className="text-center">
                            <Skeleton width={100} />
                          </td>

                          {permissions?.includes("Users-Approve") && (
                            <td className="text-center">
                              <Skeleton width={100} />
                            </td>
                          )}
                          {(permissions?.includes("Users-Edit") ||
                            permissions?.includes("Users-Delete")) && (
                            <td className="text-center">
                              <Skeleton width={100} />
                            </td>
                          )}
                        </tr>
                      );
                    })
                  : list?.map((v, i) => {
                      return (
                        <tr>
                          <td className="text-center">
                            {/* {i+1} */}
                            {v?.srNo}
                          </td>
                          <td>{v?.topicName}</td>

                          <td className="text-center">
                            {renderProfile(v?.status)}
                          </td>
                          <td className="text-center">
                            <u style={{cursor:"pointer"}} onClick={() => setSelectedTopic(v)}>
                              View
                            </u>
                          </td>

                          <td style={{ textAlign: "center" }}>
                            {permissions?.includes("Users-Edit") && (
                              <a
                                onClick={() =>
                                  navigate("/update-topic/" + v?._id)
                                }
                                className="text-primary text-decoration-underline mx-2"
                              >
                                <i class="bi bi-pencil fs-6"></i>
                              </a>
                            )}
                            <a
                              onClick={() => {
                                setDeleteId(v?._id);
                                setShowConfirm(true);
                              }}
                              className="text-danger text-decoration-underline"
                            >
                              <i class="bi bi-trash fs-6"></i>
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
              totalCount={totalCount || 0}
            />
          </div>
        </div>
      </div>
      <ConfirmDeleteModal
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleDeleteFunc}
        title="User Delete"
        body="Do you really want to delete this Topic?"
      />
      {selectedTopic?._id && (
        <div
          className="modal fade show d-flex align-items-center justify-content-center"
          tabIndex="-1"
          // style={{ display: "block" }} 
        >
          <div className="modal-dialog">
            <div
              className="modal-content"
              style={{
                borderRadius: "8px",
                width: "500px", // Width thoda kam kiya hai for better look
              }}
            >
              <div className="modal-header d-flex justify-content-between align-items-center">
                <h5 className="modal-title">Day {selectedTopic?.srNo}, {selectedTopic?.topicName}</h5>
                <img
                  src="https://cdn-icons-png.flaticon.com/128/2734/2734822.png"
                  style={{ height: "20px", cursor: "pointer" }}
                  alt="close"
                  onClick={()=>setSelectedTopic(null)}
                />
              </div>

              <div className="modal-body">
                <h6 className="mb-3 text-primary">Mark Attendance</h6>

                <div
                  className="attendance-list"
                  style={{ maxHeight: "400px", overflowY: "auto" }}
                >
                  {studentList?.map((v, i) => {
                    const isChecked = attendence.includes(v._id);
                    return (
                      <div
                        className="form-check d-flex align-items-center mb-3"
                        key={i}
                      >
                        <input
                          className="form-check-input me-3"
                          type="checkbox"
                          value=""
                          id={`student-${i}`}
                          checked={isChecked} 
                          onChange={() => handleCheckboxChange(v._id)}
                          style={{
                            width: "22px",
                            height: "22px",
                            cursor: "pointer",
                          }}
                        />
                        <label
                          className="form-check-label flex-grow-1"
                          htmlFor={`student-${i}`}
                          style={{ cursor: "pointer", fontSize: "16px" }}
                        >
                          {v?.firstName + " " + v?.lastName}
                        </label>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="modal-footer">
               
                {attendenceLoader ?<button className="btn bgThemePrimary  " style={{opacity:"0.5"}}>
                  Updating...
                </button>:<button className="btn bgThemePrimary  " onClick={()=>markAttendenceFunc()}>
                  Save Attendance
                </button>}
                
              </div>
            </div>
          </div>
        </div>
      )}
      {selectedTopic?._id && <div className="modal-backdrop fade show"></div>}
    </div>
  );
}

export default TopicList;
