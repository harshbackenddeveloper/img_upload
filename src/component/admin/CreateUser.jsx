import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { makeApi } from '../../helper/MakeApi';
import Loader from '../Loader';
import { TextField } from '@mui/material';
const CreateUser = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        user_name: '',
        first_name: '',
        last_name: '',
        space: "",
        link_limit: '',
        email: '',
        password: '',
        mobile: '',
        expiry_date: ''
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
        setLoading(true)
        try {
            const registerUser = await makeApi('post', '/v1/createUser', formData);
            console.log("registerUser", registerUser);
            if (registerUser.hasError == true) {
                toast.error(registerUser.error.message)
            }
            else {
                toast.success('Register successfully')
                navigate('/alluserlist')
            }
        } catch (error) {
            console.log(error);
            toast.error(error.response)
        } finally {
            setLoading(false)
        }
    }
    return (
        <>

<div className="container-fluid  vh-75 " style={{ backgroundColor: "#508bfc" }}>
        <div className="container login-main-creating ">
          <div className="col-lg-8  col-xl-8 col-xxl-8">
            <div className="card p-5">
             <form onSubmit={handleSubmit}>
                                    <div className="card-body p-0 ">
                                        <h3 className=" text-center mb-4 text-primary">Create User </h3>

                                        <div className="row">

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="First name" variant="outlined" className='w-100'
                                                    name='first_name'
                                                    id="first_name"
                                                    placeholder='First name'
                                                    value={formData.first_name}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="Last name" variant="outlined" className='w-100'
                                                    name='last_name'
                                                    id="last_name"
                                                    placeholder='Last name'
                                                    value={formData.last_name}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="User name" variant="outlined" className='w-100'
                                                    name='user_name'
                                                    id="user_name"
                                                    placeholder='User name'
                                                    value={formData.user_name}
                                                    onChange={handleChange}
                                                />
                                            </div>


                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="Mobile number" variant="outlined" className='w-100'
                                                    name='mobile'
                                                    id="mobile"
                                                    placeholder='Mobile number'
                                                    value={formData.mobile}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="Size" variant="outlined" className='w-100'
                                                    name='space'
                                                    id="space"
                                                    placeholder='Size in mb eg.100mb'
                                                    value={formData.space}
                                                    onChange={handleChange}
                                                />
                                            </div>


                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="Limit" variant="outlined" className='w-100'
                                                    name='link_limit'
                                                    id="link_limit"
                                                    placeholder='Limit'
                                                    value={formData.link_limit}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="Email" variant="outlined" className='w-100'
                                                    name='email'
                                                    id="email"
                                                    placeholder='Email address'
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="Password" variant="outlined" className='w-100'
                                                    name='password'
                                                    id="password"
                                                    placeholder='Password'
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="expiry date" variant="outlined" className='w-100'
                                                    name='expiry_date'
                                                    id="expiry_date"
                                                    placeholder='eg. 2024-05-20'
                                                    value={formData.expiry_date}
                                                    onChange={handleChange}
                                                />
                                            </div>


                                            <div className="col-12 d-flex justify-content-center">
                                                {loading ? (<Loader />) : (<button className="btn btn-primary btn-lg btn-block" type="submit">Create User</button>)}
                                            </div>
                                        </div>

                                    </div>
                                </form>
            </div>
          </div>
         </div>
        </div>
            {/* <section className="vh-100" style={{ backgroundColor: "#508bfc" }}>
                <div className="container py-1 h-100">
                    <div className="row d-flex justify-content-center align-items-center h-100">
                        <div className="col-12 col-md-8 col-lg-6 col-xl-8">
                            <div className="card shadow-2-strong p-4" style={{ borderRadius: "1rem" }}>
                                <form onSubmit={handleSubmit}>
                                    <div className="card-body p-0 ">
                                        <h3 className=" text-center mb-4 text-primary">Create User </h3>

                                        <div className="row">

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="First name" variant="outlined" className='w-100'
                                                    name='first_name'
                                                    id="first_name"
                                                    placeholder='First name'
                                                    value={formData.first_name}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="Last name" variant="outlined" className='w-100'
                                                    name='last_name'
                                                    id="last_name"
                                                    placeholder='Last name'
                                                    value={formData.last_name}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="User name" variant="outlined" className='w-100'
                                                    name='user_name'
                                                    id="user_name"
                                                    placeholder='User name'
                                                    value={formData.user_name}
                                                    onChange={handleChange}
                                                />
                                            </div>


                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="Mobile number" variant="outlined" className='w-100'
                                                    name='mobile'
                                                    id="mobile"
                                                    placeholder='Mobile number'
                                                    value={formData.mobile}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="Size" variant="outlined" className='w-100'
                                                    name='space'
                                                    id="space"
                                                    placeholder='Size in mb eg.100mb'
                                                    value={formData.space}
                                                    onChange={handleChange}
                                                />
                                            </div>


                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="Limit" variant="outlined" className='w-100'
                                                    name='link_limit'
                                                    id="link_limit"
                                                    placeholder='Limit'
                                                    value={formData.link_limit}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="Email" variant="outlined" className='w-100'
                                                    name='email'
                                                    id="email"
                                                    placeholder='Email address'
                                                    value={formData.email}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="Password" variant="outlined" className='w-100'
                                                    name='password'
                                                    id="password"
                                                    placeholder='Password'
                                                    value={formData.password}
                                                    onChange={handleChange}
                                                />
                                            </div>

                                            <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                                <TextField label="expiry date" variant="outlined" className='w-100'
                                                    name='expiry_date'
                                                    id="expiry_date"
                                                    placeholder='eg. 2024-05-20'
                                                    value={formData.expiry_date}
                                                    onChange={handleChange}
                                                />
                                            </div>


                                            <div className="col-12 d-flex justify-content-center">
                                                {loading ? (<Loader />) : (<button className="btn btn-primary btn-lg btn-block" type="submit">Create User</button>)}
                                            </div>
                                        </div>

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

export default CreateUser