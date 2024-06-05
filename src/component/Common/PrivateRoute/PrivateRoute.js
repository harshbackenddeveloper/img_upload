import React from "react";

function PrivateRoute({ children, navigate }) {
  console.log("children", children)
  const user = JSON.parse(sessionStorage.getItem("token"));
  console.log("jfdklfdfdfd", user)
  
  return user ? children : <navigate to="/" />;
}

export default PrivateRoute;
