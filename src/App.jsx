import React, { useEffect } from 'react';
import { Route, Routes } from 'react-router-dom';
import { useNavigate } from "react-router-dom";
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NavBar from './component/NavBar';
import Home from './component/Home';
import AllUserList from './component/admin/AllUserList';
import CreateLink from './component/user/CreateLink';
import UploadDetails from './component/UploadDetails';
import ThankYou from './component/UploadImg/ThankYou';
import CreateDepartment from './component/admin/CreateDepartment';
import ForgetPassword from './component/ForgetPassword';
import Conframp from './component/Conframp';
import Create_Edit_form from './component/admin/Create_Edit_form';
import NotFound from './component/NotFound';

function App() {

  const isAuthenticated = () => {
    const localData = sessionStorage.getItem("token")
    const userToken = JSON.parse(localData)
    return userToken;
  };

  // Modified ProtectedRoute component
  const ProtectedRoute = ({ element, ...props }) => {
    const navigate = useNavigate();
    useEffect(() => {
      if (!isAuthenticated()) {
        navigate("/", { replace: true, state: { from: props.location } });
      }
    }, [navigate, props.location]);

    return isAuthenticated() ? element : null;
  };

  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* admin route */}
        <Route path="/alluserlist" element={<ProtectedRoute element={<AllUserList />} />} />
        <Route path="/department" element={<ProtectedRoute element={<CreateDepartment />} />} />
        <Route path="/form/:names" element={<ProtectedRoute element={<Create_Edit_form />} />} />

        {/* User route*/}
        <Route path="/createlink" element={<ProtectedRoute element={<CreateLink />} />} />

        {/* common route  */}
        <Route path="/thankyou" element={<ThankYou />} />
        <Route path="/forgetpassword" element={<ForgetPassword />} />
        <Route path="/confirmpassword/:token" element={<Conframp />} />
        <Route path="/uploadDetails/:key" element={<UploadDetails />} />
        <Route path="/notfound" element={<NotFound />} />

      </Routes>

      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default App;
