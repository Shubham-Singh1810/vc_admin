import React from 'react'
import { Routes, Route } from "react-router-dom";
import Login from '../pages/Authentication/Login';
import UpdatePassword from '../pages/Authentication/UpdatePassword';
function UnAuthenticatedRoutes() {
  return (
    <Routes>
        <Route path="/" element={<Login/>}/>
        <Route path="/update-password/:token" element={<UpdatePassword/>}/>
    </Routes>
  )
}

export default UnAuthenticatedRoutes