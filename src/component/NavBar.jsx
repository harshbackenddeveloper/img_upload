import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { userlocalStorageData } from '../helper/UserToken';
import { toast } from 'react-toastify';

const NavBar = () => {
    const navigate = useNavigate();
    const { userToken, Role_User } = userlocalStorageData();
    const redirectToNotFound = () => {
        navigate('/NotFound');
    };

    useEffect(() => {
        const checkAccess = () => {
            if ((Role_User === "User" && window.location.pathname.startsWith("/alluserlist")) ||
                (Role_User === "SuperAdmin" && window.location.pathname.startsWith("/createlink"))) {
                redirectToNotFound();
            }
        };
        checkAccess();
    }, [Role_User]);

    const LogoutUser = () => {
        sessionStorage.removeItem("token");
        sessionStorage.removeItem("User_Role");
        toast.success('logout successfully')
        navigate('/');
    };

    if (!userToken) return null;

    const superAdminLinks = (
        <>
            <li className="nav-item">
                <Link className="nav-link fw-bold fs-6 text-dark" to="/alluserlist">User List</Link>
            </li>
            
            <li className="nav-item">
                <Link className="nav-link fw-bold fs-6 text-dark" to="/department">Create Department</Link>
            </li>
        </>
    );

    const adminLinks = (
        <li className="nav-item">
            <Link className="nav-link fw-bold fs-6 text-dark" to="/createlink">Create Link</Link>
        </li>
    );

    const renderLinks = () => {
        if (Role_User === "SuperAdmin") {
            return superAdminLinks;
        } else if (Role_User === "User") {
            return adminLinks;
        } else {
            return null;
        }
    };

    return (
        <div className="containter-fluid bg-warning">
            <div className="container">
                <nav className="navbar navbar-expand-lg navbar-light">
                    <div className="collapse navbar-collapse" id="navbarSupportedContent">
                        <ul className="navbar-nav mr-auto">
                            {renderLinks()}
                        </ul>
                    </div>
                    <button className="nav-link fw-bold fs-5" style={{ marginRight: '20px' }} onClick={LogoutUser}>Logout</button>
                    <span className="btn btn-outline-success" type="submit">{Role_User}</span>
                </nav>
            </div>
        </div>
    );
};

export default NavBar;