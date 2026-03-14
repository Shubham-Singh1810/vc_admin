import React, { useState } from "react";
import { toast } from "react-toastify";
import { addRoleServ } from "../../services/commandCenter.services";
import {useNavigate} from "react-router-dom"
function AssignRole() {
  const navigate = useNavigate()
  const [rolePermissions, setRolePermissions] = useState({});
  const [openSections, setOpenSections] = useState({});
  const [roleName, setRoleName] = useState("");
  const navItemsPermissions = [
    {
      title: "Dashboard",
      list: [
        {
          menu: "Dashboard",
          permissions: ["View"],
        },
        {
          menu: "Analytics",
          permissions: ["View"],
        },
      ],
    },
    {
      title: "Batch Management",
      list: [
        {
          menu: "Batches",
          permissions: ["View", "Create", "Edit", "Delete"],
        },
      ],
    },
    {
      title: "Command Center",
      list: [
        {
          menu: "Staff/Agent",
          permissions: ["View", "Create", "Edit", "Delete"],
        },
        {
          menu: "Role Management",
          subMenu: [
            {
              name: "Roles",
              permissions: ["View", "Edit", "Delete"],
            },
            {
              name: "Assign Role",
              permissions: ["Create"],
            },
          ],
        },
      ],
    },
    {
      title: "User Management",
      list: [
        {
          menu: "Users",
          permissions: ["View", "Create", "Edit", "Delete", "Approve"],
          
        },
      ],
    },
    {
      title: "Instructor Management",
      list: [
        {
          menu: "Instructors",
          permissions: ["View", "Create", "Edit", "Delete", "Approve"],
          
        },
      ],
    },
    {
      title: "Content Management",
      list: [
        {
          menu: "Categories",
          permissions: ["View", "Create", "Edit", "Delete"],
        },
        {
          menu: "Subcategories",
          permissions: ["View", "Create", "Edit", "Delete"],
        },
      ],
    },
    {
      title: "Fund Management",
      list: [
        {
          menu: "Transactions",
          subMenu: [
            {
              name: "Deposit List",
              permissions: ["View", "Edit", "Delete"],
            },
            {
              name: "Withdraw List",
              permissions: ["View", "Edit", "Delete"],
            },
          ],
        },
      ],
    },
    {
      title: "System Management",
      list: [
        {
          menu: "System Configration",
          permissions: ["View",  "Edit"],
        },
        
        {
          menu: "Policies",
          permissions: ["View", "Edit"],
          
        },
        {
          menu: "Notify",
          permissions: ["View", "Create", "Edit", "Delete"],
        },
        
      ],
    },
    {
      title: "Support Management",
      list: [
        {
          menu: "Contact Queries",
          permissions: ["View", "Update"],
        },
        {
          menu: "Tickets",
          subMenu: [
            {
              name: "All Ticket",
              permissions: ["View", "Edit", "Delete"],
            },
            {
              name: "Ticket Category",
              permissions: ["View", "Create", "Edit", "Delete"],
            },
          ],
        },
        {
          menu: "FAQ'S",
          permissions: ["View", "Create", "Edit", "Delete"],
        },
      ],
    },
  ];

  const toggleSection = (title) => {
    setOpenSections((prev) => ({ ...prev, [title]: !prev[title] }));
  };
  const handleTitlePermissionChange = (title, list) => {
    setRolePermissions((prev) => {
      const current = { ...prev };
      if (current[title]?.includes("View")) {
        delete current[title];
        list.forEach((menu) => {
          delete current[menu.menu];
          menu.subMenu?.forEach((sm) => {
            delete current[sm.name];
          });
        });
      } else {
        current[title] = ["View"];
        list.forEach((menu) => {
          if (menu.permissions) current[menu.menu] = [...menu.permissions];
          menu.subMenu?.forEach((sm) => {
            current[sm.name] = [...sm.permissions];
          });
        });
      }
      return current;
    });
  };
  const handlePermissionChange = (menu, permission, title) => {
    setRolePermissions((prev) => {
      const current = { ...prev };
      const menuPermissions = current[menu] || [];

      // toggle permission
      if (menuPermissions.includes(permission)) {
        current[menu] = menuPermissions.filter((p) => p !== permission);
        if (current[menu].length === 0) delete current[menu];
      } else {
        current[menu] = [...menuPermissions, permission];
      }

      // 👉 अब check करो कि title के अंदर कुछ selected है या नहीं
      const parent = navItemsPermissions.find((x) => x.title === title);
      let anySelected = false;

      parent?.list.forEach((m) => {
        if (current[m.menu]?.length) anySelected = true;
        m.subMenu?.forEach((sm) => {
          if (current[sm.name]?.length) anySelected = true;
        });
      });

      if (anySelected) {
        current[title] = ["View"];
      } else {
        delete current[title];
      }

      return current;
    });
  };
  const [submitLoader, setSubmitLoader] = useState();
  const handleSubmit = async () => {
    setSubmitLoader(true);
    let permissionsArray = [];

    Object.entries(rolePermissions).forEach(([menu, perms]) => {
      perms.forEach((perm) => {
        permissionsArray.push(`${menu}-${perm}`);
      });
    });

    const payload = {
      name: roleName,
      permissions: permissionsArray,
    };

    console.log("🚀 Final Payload:", payload);
    try {
      let response = await addRoleServ(payload);
      if (response?.data?.statusCode == "200") {
        toast.success(response?.data?.message);
        navigate("/role-list")
      } else {
        toast.error("Something went wrong");
      }
    } catch (error) {
      toast.error("Something went wrong");
    }
    setSubmitLoader(false);
  };

  return (
    <div className="container-fluid">
      <div className="row">
        <div className="col-lg-12 p-4">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="ms-1 mb-0">Create Role And Permissions</h5>
          </div>

          <div className="bg-white p-3 border my-1 rounded">
            <div className="mb-3">
              <label>Role Title</label>
              <input
                className="form-control"
                placeholder="Enter role title"
                value={roleName}
                onChange={(e) => setRoleName(e?.target?.value)}
              />
            </div>

            {navItemsPermissions?.map((v, i) => (
              <div key={i} className="mb-3 border rounded">
                {/* Title Row */}
                <div
                  className="d-flex justify-content-between align-items-center p-2 bg-light cursor-pointer"
                  onClick={() => toggleSection(v?.title)}
                >
                  <div className="d-flex align-items-center">
                    <input
                      type="checkbox"
                      className="me-2"
                      checked={
                        rolePermissions[v?.title]?.includes("View") || false
                      }
                      onChange={(e) => {
                        e.stopPropagation();
                        handleTitlePermissionChange(v?.title, v?.list);
                      }}
                    />
                    <label className="fw-bold mb-0">{v?.title}</label>
                  </div>
                  <span>
                    {openSections[v?.title] ? (
                      <i className="bi bi-chevron-up" />
                    ) : (
                      <i className="bi bi-chevron-down" />
                    )}
                  </span>
                </div>

                {/* Expand/Collapse */}
                {openSections[v?.title] && (
                  <div className="ms-2 p-2">
                    {v?.list?.map((value, j) => (
                      <div key={j} className="m-2 border-bottom p-2 rounded">
                        <label className="fw-semibold">{value?.menu}</label>

                        {/* Menu Permissions */}
                        <div>
                          {value?.permissions?.map((perm) => (
                            <label key={perm} className="me-3">
                              <input
                                type="checkbox"
                                className="me-1"
                                checked={
                                  rolePermissions[value?.menu]?.includes(
                                    perm
                                  ) || false
                                }
                                onChange={() =>
                                  handlePermissionChange(
                                    value?.menu,
                                    perm,
                                    v?.title
                                  )
                                }
                              />
                              {perm}
                            </label>
                          ))}
                        </div>

                        {/* Submenu */}
                        {value?.subMenu?.map((submenu, k) => (
                          <div key={k} className="ms-2 mt-2">
                            <label>{submenu?.name}</label>
                            <div className="d-flex flex-wrap">
                              {submenu?.permissions?.map((perm) => (
                                <label key={perm} className="me-3">
                                  <input
                                    type="checkbox"
                                    className="me-1"
                                    checked={
                                      rolePermissions[submenu?.name]?.includes(
                                        perm
                                      ) || false
                                    }
                                    onChange={() =>
                                      handlePermissionChange(
                                        submenu?.name,
                                        perm,
                                        v?.title
                                      )
                                    }
                                  />
                                  {perm}
                                </label>
                              ))}
                            </div>
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}

            <div className="d-flex justify-content-end">
              {roleName && rolePermissions ? (
                submitLoader ? (
                  <button
                    className="btn bgThemePrimary"
                    style={{ opacity: "0.5" }}
                  >
                    Submiting ...
                  </button>
                ) : (
                  <button className="btn bgThemePrimary" onClick={handleSubmit}>
                    Save
                  </button>
                )
              ) : (
                <button
                  className="btn bgThemePrimary"
                  style={{ opacity: "0.5" }}
                >
                  Save
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AssignRole;
