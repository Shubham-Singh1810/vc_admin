import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserListServ, getUserStatsServ } from "../../services/user.service";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import NoDataScreen from "../../components/NoDataScreen";
import { toast } from "react-toastify";
import Pagination from "../../components/Pagination";
import moment from "moment";
function BalanceUsers() {
  const [list, setList] = useState([]);
  const navigate = useNavigate();
  const [showSkelton, setShowSkelton] = useState(false);
  const [showStatsSkelton, setShowStatsSkelton] = useState(false);
  const [payload, setPayload] = useState({
    searchKey: "",
    pageNo: 1,
    pageCount: 20,
  });
  const [documentCount, setDocumentCount] = useState();
  const [totalCount, setTotalCount] = useState(0);
  const getListFunc = async () => {
    if (list?.length == 0) {
      setShowSkelton(true);
    }

    try {
      let response = await getUserListServ(payload);
      if (response?.data?.statusCode == "200") {
        setList(response?.data?.data);
        setTotalCount(response?.data?.documentCount?.totalCount);
      }
    } catch (error) {
      console.log(error);
    }
    setShowSkelton(false);
  };
  const getUserStatsFunc = async () => {
    setShowStatsSkelton(true);
    try {
      let response = await getUserStatsServ();
      if (response?.data?.statusCode == 200) {
        setDocumentCount(response?.data?.stats);
      }
    } catch (error) {
      console.log(error);
    }
    setShowStatsSkelton(false);
  };
  useEffect(() => {
    getUserStatsFunc();
  }, []);
  useEffect(() => {
    getListFunc();
  }, [payload]);
  const renderProfile = (status) => {
    if (status == "registered") {
      return (
        <span className="status-badge bg-info-subtle text-info">
          Registered
        </span>
      );
    }
    if (status == "verified") {
      return (
        <span className="status-badge bg-warning-subtle text-warning">
          Verified
        </span>
      );
    }
    if (status == "active") {
      return (
        <span className="status-badge bg-success-subtle text-success">
          Active
        </span>
      );
    }
    if (status == "blocked") {
      return (
        <span className="status-badge bg-danger-subtle text-danger">
          Blocked
        </span>
      );
    }
  };
  const staticsData = [
    {
      label: "Total Users",
      icon: "bi bi-people",
      count: documentCount?.totalCount,
      percent: documentCount?.trends?.totalTrend?.percent,
      isTrendPositive: documentCount?.trends?.totalTrend?.isTrendPositive,
      iconColor: "#010a2d",
    },
    {
      label: "Active Users",
      icon: "bi bi-people",
      count: documentCount?.activeCount,
      percent: documentCount?.trends?.activeTrend?.percent,
      isTrendPositive: documentCount?.trends?.activeTrend?.isTrendPositive,
      iconColor: "green",
    },
    {
      label: "Registered Users",
      icon: "bi bi-people",
      count: documentCount?.registeredCount,
      percent: documentCount?.trends?.registeredTrend?.percent,
      isTrendPositive: documentCount?.trends?.registeredTrend?.isTrendPositive,
      iconColor: "blue",
    },
    {
      label: "Blocked Users",
      icon: "bi bi-people",
      count: documentCount?.blockedCount,
      percent: documentCount?.trends?.blockedTrend?.percent,
      isTrendPositive: documentCount?.trends?.blockedTrend?.isTrendPositive,
      iconColor: "red",
    },
  ];
  return (
    <div className="container-fluid user-table py-3">
      {/* KPIs */}
      <div className="row g-3">
        {/* Loan Applications */}
        {showStatsSkelton
          ? [1, 2, 3, 4]?.map((v, i) => {
              return (
                <div className="col-12 col-sm-6 col-lg-3">
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
                        <div>
                          <Skeleton height={15} width={200} />
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
                        <div
                          className={
                            "delta " +
                            (v?.isTrendPositive
                              ? " text-success"
                              : " text-danger")
                          }
                        >
                          {v?.isTrendPositive ? "+" : "-"}
                          {v?.percent}% from last month
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
      </div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center my-4">
        <h4 className="mb-0">User With Balance </h4>
        <div className="d-flex align-items-center">
          <div className="d-flex align-items-center px-2 user-search">
            <form className="input-group search ms-2 d-none d-md-flex">
              <span className="input-group-text input-span">
                <i className="bi bi-search" />
              </span>
              <input
                type="search"
                className="form-control search-input"
                placeholder="Name, Email, Phone Number..."
                value={payload?.searchKey}
                onChange={(e) =>
                  setPayload({ ...payload, searchKey: e?.target?.value })
                }
              />
            </form>
          </div>
          <button className="btn bgThemePrimary shadow-sm" onClick={()=>navigate("/create-user")}>+ Add User</button>
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
                  <th>Email / Mobile</th>
                  <th>Joined At</th>

                  <th className="text-center">Status</th>
                  <th className="text-center">Last Login</th>
                  <th style={{ textAlign: "center" }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {showSkelton
                  ? [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]?.map((v, i) => {
                      return (
                        <tr key={i}>
                          <td>
                            <Skeleton width={50} />
                          </td>
                          <td>
                            <Skeleton width={50} />
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
                            {/* {i+1} */}
                            {i + 1 + (payload?.pageNo - 1) * payload?.pageCount}
                          </td>
                          <td>
                            <div className="d-flex align-items-center">
                              <img
                                src={
                                  v?.profilePic ||
                                  "https://cdn-icons-png.flaticon.com/128/149/149071.png"
                                }
                                alt="User"
                                className="rounded-circle me-2"
                                width={40}
                                height={40}
                              />
                              <div>
                                <h6
                                  className="mb-0"
                                  style={{ fontSize: "14px" }}
                                >
                                  {v?.firstName + " " + v?.lastName}
                                </h6>
                                <small className="text-muted">
                                  ID: {v?.code || "N/A"}
                                </small>
                              </div>
                            </div>
                          </td>
                          <td>
                            <div>
                              <div>{v?.email}</div>
                              <small className="text-muted">
                                +{v?.countryCode} {v?.phone}
                              </small>
                            </div>
                          </td>
                          <td>{moment(v?.createdAt).format("DD MMM, YYYY")}</td>

                          <td className="text-center">
                            {renderProfile(v?.profileStatus)}
                          </td>
                          <td className="text-center">
                            {moment(v?.lastLogin).format("DD MMM, YYYY")}
                          </td>
                          <td style={{ textAlign: "center" }}>
                            <a
                              onClick={() =>
                                navigate("/user-details/" + v?._id)
                              }
                              className="text-primary text-decoration-underline"
                            >
                              <i
                                class="bi bi-eye fs-5"
                                style={{ fontSize: "14px" }}
                              ></i>
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
    </div>
  );
}

export default BalanceUsers;
