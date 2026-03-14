import React, { useEffect, useState } from "react";
import { useGlobalState } from "../GlobalProvider";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import LogoutConfirmationModal from "./LogoutConfirmationModal";
import { globalSearchServ } from "../services/commandCenter.services";
function TopNav({ setIsCollapsed, isCollapsed }) {
  const { globalState, setGlobalState } = useGlobalState();
  const navigate = useNavigate();
  const handleLogoutFunc = () => {
    setGlobalState({
      user: null,
      token: null,
      permissions: null,
    });
    toast.success("Admin logged out successfully");
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("permissions");
    navigate("/");
  };
  const [showConfirm, setShowConfirm] = useState(false);
  const [searchKey, setSearchKey] = useState("");
  const [searchResult, setSearchResult] = useState([]);
  const globalSearchFunc = async () => {
    try {
      let response = await globalSearchServ({ searchKey });
      console.log(response?.data?.data);
      if (response?.data?.statusCode == "200") {
        setSearchResult(response?.data?.data);
      }
    } catch (error) {}
  };
  useEffect(() => {
    globalSearchFunc();
  }, [searchKey]);
  return (
    <>
      <div className="topbar">
        {/* ye mobile view ka menu button hai */}
        <button
          id="hamburger"
          className="btn btn-light d-lg-none"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <i className="bi bi-list" />
        </button>
        {/* ye desktop view ke liye hai */}
        <button
          id="toggleCollapse"
          className="btn btn-sm menuBtn d-none d-lg-inline-flex"
          onClick={() => setIsCollapsed(!isCollapsed)}
        >
          <i className="bi bi-justify " />
        </button>
        {/* <form className="input-group search ms-2 d-none d-md-flex">
          <span className="input-group-text input-span">
            <i className="bi bi-search" />
          </span>
          
        </form> */}
        <div className="position-relative">
          <form className="input-group search ms-2 d-none d-md-flex">
            <span className="input-group-text input-span">
              <i className="bi bi-search" />
            </span>
            <input
              type="search"
              className="form-control search-input"
              placeholder="Search user, staff, branch, ticket ..."
              style={{ width: "300px" }}
              onChange={(e) => setSearchKey(e?.target?.value)}
              value={searchKey}
            />
          </form>

          {searchKey && (
            <div className="search-dropdown shadow-lg">
              {/* USERS */}
              {searchResult?.users?.length > 0 && (
                <div className="search-section">
                  <div className="search-heading">Users</div>

                  {searchResult.users.map((item) => (
                    <div
                      key={item._id}
                      className="search-row"
                      onClick={() => {
                        navigate(`/users/${item._id}`);
                        setSearchKey("");
                      }}
                    >
                      <img
                        src={
                          item.profilePic ||
                          "https://cdn-icons-png.flaticon.com/512/847/847969.png"
                        }
                        alt="user"
                        className="search-avatar"
                      />
                      <div>
                        <div className="search-title">
                          {item.firstName} {item.lastName}
                        </div>
                        <div className="search-subtitle">{item.email}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {/* STAFF */}
              {searchResult?.staff?.length > 0 && (
                <div className="search-section">
                  <div className="search-heading">Staff</div>

                  {searchResult.staff.map((item) => (
                    <div
                      key={item._id}
                      className="search-row"
                      onClick={() => {
                        navigate(`/staff/${item._id}`);
                        setSearchKey("");
                      }}
                    >
                      <i className="bi bi-person-badge search-icon" />
                      <div className="search-title">{item.firstName}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* BRANCHES */}
              {searchResult?.branches?.length > 0 && (
                <div className="search-section">
                  <div className="search-heading">Branches</div>

                  {searchResult.branches.map((item) => (
                    <div
                      key={item._id}
                      className="search-row"
                      onClick={() => {
                        navigate(`/branches/${item._id}`);
                        setSearchKey("");
                      }}
                    >
                      <i className="bi bi-building search-icon" />
                      <div className="search-title">{item.name}</div>
                    </div>
                  ))}
                </div>
              )}

             

              {/* TICKETS */}
              {searchResult?.tickets?.length > 0 && (
                <div className="search-section">
                  <div className="search-heading">Tickets</div>

                  {searchResult.tickets.map((item) => (
                    <div
                      key={item._id}
                      className="search-row"
                      onClick={() => {
                        navigate(`/tickets/${item._id}`);
                        setSearchKey("");
                      }}
                    >
                      <i className="bi bi-ticket-detailed search-icon" />
                      <div className="search-title">{item.subject}</div>
                    </div>
                  ))}
                </div>
              )}

              {/* NO DATA */}
              {Object.values(searchResult || {}).every(
                (arr) => arr.length === 0
              ) && <div className="search-empty">No results found</div>}
            </div>
          )}

          {/* ❌ No result */}
          {searchKey && searchResult?.length === 0 && (
            <div className="search-dropdown shadow text-center text-muted p-2">
              No results found
            </div>
          )}
        </div>

        <div className="ms-auto d-flex align-items-center gap-2">
          {/* ye theme toggle button hai */}
          {/* <button id="themeToggle" className="btn btn-light"  onClick={()=>alert("Dark Mode is in progress")}>
              <i className="bi bi-moon" />
            </button> */}
          <button
            className="btn btn-light"
            onClick={() => alert("Dark Mode is in progress")}
          >
            <i className="bi bi-moon" />
          </button>
          {/* Notifications */}
          <div className="dropdown" data-hover="dropdown">
            <button
              className="btn btn-light position-relative"
              data-bs-toggle="dropdown"
            >
              <i className="bi bi-bell" />
              <span className="position-absolute top-0 start-100 translate-middle p-1 bg-danger border border-light rounded-circle" />
            </button>
            <div
              className="dropdown-menu dropdown-menu-end p-0 shadow"
              style={{ minWidth: 340 }}
            >
              <div
                className="p-3 border-bottom"
                style={{ borderColor: "var(--border)" }}
              >
                <strong>Notifications</strong>
              </div>
              <div className="p-2">
                <a
                  className="dropdown-item d-flex gap-2 align-items-start rounded"
                  href="#"
                >
                  <span className="circle-8 bg-success mt-2" />
                  <span>
                    <div className="fw-semibold">Order #T12563 completed</div>
                    <small className="text-muted">2m ago</small>
                  </span>
                </a>
                <a
                  className="dropdown-item d-flex gap-2 align-items-start rounded"
                  href="#"
                >
                  <span className="circle-8 bg-warning mt-2" />
                  <span>
                    <div className="fw-semibold">Server load high</div>
                    <small className="text-muted">18m ago</small>
                  </span>
                </a>
              </div>
            </div>
          </div>
          {/* Profile */}
          <div className="dropdown" data-hover="dropdown">
            <button
              className="btn btn-light d-flex align-items-center gap-2"
              data-bs-toggle="dropdown"
            >
              <img
                src={
                  globalState?.user?.profilePic ||
                  "https://static.vecteezy.com/system/resources/previews/051/718/888/non_2x/3d-cartoon-boy-avatar-with-open-mouth-and-eyes-free-png.png"
                }
                className="rounded-circle"
                width={28}
                height={28}
                alt="avatar"
              />
            </button>
            <div className="dropdown-menu dropdown-menu-end shadow card-soft">
              <a
                className="dropdown-item cursor"
                onClick={() => navigate("/my-profile")}
              >
                <i className="bi bi-person me-2" /> Profile
              </a>
              <a
                className="dropdown-item cursor"
                onClick={() => navigate("/permissions")}
              >
                <i className="bi bi-grid me-2" /> Permissions
              </a>

              <div className="dropdown-divider" />
              <a
                className="dropdown-item text-danger cursor"
                onClick={() => setShowConfirm(true)}
              >
                <i className="bi bi-box-arrow-right me-2" />
                Logout
              </a>
            </div>
          </div>
        </div>
      </div>
      <LogoutConfirmationModal
        show={showConfirm}
        handleClose={() => setShowConfirm(false)}
        handleConfirm={handleLogoutFunc}
        title="Logout"
        body="Are you sure you want to logout?"
      />
    </>
  );
}

export default TopNav;
