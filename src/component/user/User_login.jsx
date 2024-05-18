import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { makeApi } from '../../helper/MakeApi';
import Loader from '../Loader';
import { TextField } from '@mui/material';

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
    return (
        <>

<div className="container-fluid  vh-75 " style={{ backgroundColor: "#508bfc" }}>
        <div className="container login-main ">
          <div className="col-lg-6  col-xl-5 col-xxl-5">
            <div className="card p-2">
            <form onSubmit={handleSubmit}>
                                    <div className="card-body text-center">
                                        <h3 className="mb-4 fw-bold">User Sign in</h3>

                                        <TextField label=" Email" variant="outlined" className='w-100 mb-3'
                                            name='email'
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        <TextField label="Password" variant="outlined" className='w-100 mb-4'
                                            id="password"
                                            name='password'
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        {loading ? (<Loader />) : (<button className="btn btn-primary btn-lg btn-block" type="submit">Login</button>)}
                                    </div>
                                </form>

            </div>
          </div>
        </div>
      </div>


            {/* <section className="vh-100" style={{ backgroundColor: "#508bfc" }}>
                <div className="container py-5 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-5">
                            <div className="card shadow-2-strong" style={{ borderRadius: "1rem" }}>
                                <form onSubmit={handleSubmit}>
                                    <div className="card-body p-5 text-center">
                                        <h3 className="mb-3 fw-bold">User Sign in</h3>

                                        <TextField label=" Email" variant="outlined" className='w-100 mb-3'
                                            name='email'
                                            id="email"
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                        <TextField label="Password" variant="outlined" className='w-100 mb-3'
                                            id="password"
                                            name='password'
                                            value={formData.password}
                                            onChange={handleChange}
                                        />
                                        {loading ? (<Loader />) : (<button className="btn btn-primary btn-lg btn-block" type="submit">Login</button>)}
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                </div>
            </section> */}
        </>
    )
}

export default Userlogin