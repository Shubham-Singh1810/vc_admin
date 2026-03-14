import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import TopNav from "../components/TopNav";
import { Outlet } from "react-router-dom";

function AuthenticatedLayout({ children }) {
  const [isCollapsed, setIsCollapsed]=useState(false)
  return (
    <>
    <div className="layout">
      <Sidebar isCollapsed={isCollapsed}/>
      <main id="content" className={"content "+ (isCollapsed ? " collapsed":" ")}>
        <TopNav setIsCollapsed={setIsCollapsed} isCollapsed={isCollapsed}/>
         <Outlet />
      </main>
    </div>
     
    </>
  );
}

export default AuthenticatedLayout;
