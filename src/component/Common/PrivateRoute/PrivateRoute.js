import React from "react";
import { Navigate } from "react-router-dom";

function PrivateRoute({children}) {
  const user = JSON.parse(localStorage.getItem('userData')) ;
  return user ? children  : <Navigate to="/" />;
}

export default PrivateRoute;
