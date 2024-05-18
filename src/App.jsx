import React from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import NavBar from './component/NavBar';
import Home from './component/Home';
import AllUserList from './component/admin/AllUserList';
import CreateUser from './component/admin/CreateUser';
import CreateLink from './component/user/CreateLink';
import { userlocalStorageData } from './helper/UserToken';
import UploadDetails from './component/UploadDetails';

function App() {
  const isAuthenticated = () => {
    const userData = userlocalStorageData();
    return userData && userData.userToken;
  };

  // Create a custom ProtectedRoute component
  const ProtectedRoute = ({ element, ...props }) => {
    return isAuthenticated() ? (
      element
    ) : (
      <Navigate to="/" replace state={{ from: props.location }} />
    );
  };

  return (
    <>
      <NavBar />

      <Routes>
        <Route path="/" element={<Home />} />

        {/* super admin */}
        <Route path="/createlink" element={<ProtectedRoute element={<CreateLink />} />} />

        {/* admin route */}
        <Route path="/alluserlist" element={<ProtectedRoute element={<AllUserList />} />} />
        <Route path="/createuser" element={<ProtectedRoute element={<CreateUser />} />} />

        <Route path="/uploadDetails/:key" element={<UploadDetails />} />

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
      <ToastContainer />
    </>
  );
}

export default App;