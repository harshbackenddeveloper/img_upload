import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { makeApi } from '../../helper/MakeApi';
import Loader from '../Loader';
import { TextField } from '@mui/material';
import '../../assets/css/Loader.css';

const Userlogin = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        email: '',
        password: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((oldVal) => ({
            ...oldVal,
            [name]: value

        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const UserLogin = await makeApi('post', '/v1/Userlogin', formData);
            console.log("login", UserLogin);

            if (UserLogin.hasError == true) {
                toast.error(UserLogin.error.message)
            } else {
                sessionStorage.setItem("token", JSON.stringify(UserLogin.data.token));
                sessionStorage.setItem("User_Role", JSON.stringify(UserLogin.data.role));

                toast.success('login successfully')
                navigate('/createlink')
            }

        } catch (error) {
            console.log(error);
            toast.error(error.response.data.message)
        } finally {
            setLoading(false);
        }
    }

    const ForgetPassword = () => {
        navigate('/forgetpassword');
    }
    return (
        <>
            <div className="container-fluid  mgulmnbg " >
                <div className="container login-main ">
                    <div className="col-lg-6  col-xl-5 col-xxl-5">
                        <div className="card p-2">
                            <form onSubmit={handleSubmit}>
                                <div className="card-body text-center">
                                    <h3 className="mb-4 fw-bold">User Sign in</h3>

                                    <TextField  variant="outlined" className='w-100 mb-3' placeholder='Email'
                                        name='email'
                                        id="email"
                                        value={formData.email}
                                        onChange={handleChange}
                                        autoComplete="current-email"
                                    />
                                    <TextField placeholder="Password" variant="outlined" className='w-100 mb-4'  type='password'
                                        id="password"
                                        name='password'
                                        value={formData.password}
                                        onChange={handleChange}
                                        autoComplete="current-password"
                                    />
                                    <div className='d-flex justify-content-end align-items-center flex-wrap'>

                                        <Link className='fw-bold' to='/forgetpassword'>Forgot password?</Link>

                                    </div>
                                    {loading ? (<Loader />) : (<button className="btn btn-primary btn-md btn-block mt-3" type="submit">Login</button>)}
                                </div>
                            </form>

                        </div>
                    </div>
                </div>
            </div>
        </>
    )
}

export default Userlogin