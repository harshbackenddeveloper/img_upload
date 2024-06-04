import React from "react";
import { Navigate } from "react-router-dom";
function GuestRoute({ children }) {
    const user = JSON.parse(sessionStorage.getItem("token"));
    return user ? <Navigate to="/agent/dashboard" /> : children;
}
export default GuestRoute;
