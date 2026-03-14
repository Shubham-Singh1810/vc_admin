import React from "react";
import { useNavigate } from "react-router-dom";
function TableNavItems({ navItems, selectedItem }) {
  const navigate = useNavigate()
  return (
    <ul className="nav nav-tabs mb-4" id="loanTabs" role="tablist">
      {navItems?.map((v, i) => {
        return (
          <li className="nav-item tableNavItem" role="presentation" onClick={()=>navigate(v?.path)}>
            <button
              className={"nav-link "+(v?.name==selectedItem ? " active":" ")}
              id="pending-tab"
              data-bs-toggle="tab"
              data-bs-target="#pending"
              type="button"
              role="tab"
            >
              <img src={v?.img} /> {v?.name}
            </button>
          </li>
        );
      })}
    </ul>
  );
}

export default TableNavItems;
