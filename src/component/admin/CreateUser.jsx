import React, { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { makeApi } from '../../helper/MakeApi';
import Loader from '../Loader';
import { FormControl, InputLabel, MenuItem, Select, TextField } from '@mui/material';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
const CreateUser = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [departmentList, setDepartmentList] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [userDetails, setUserDetails] = useState({
        surveyor_or_Firm_name: "",
        last_name: "",
        user_name: "",
        password: "",
        sla_number: "",
        iiisla_number: "",
        link_limit: "",
        space: "",
        email: "",
        mobile: "",
        address: "",
        remark: "",
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUserDetails((oldVal) => ({
            ...oldVal,
            [name]: value

        }))
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
            const formData = { ...userDetails, expiry_date: formattedDate, department: selectedDepartment }
            console.log("formData", formData)
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


    //function to get user department list 
    const getDepartmentList = async () => {
        try {
            const response = await makeApi("get", "/v1/departmentlist");
            if (response.hasError === true) {
                toast.error(response.error.message)
            } else {
                setDepartmentList(response.data)
            }
        } catch (error) {
            console.log(error)
        }
    }

    useEffect(() => {
        getDepartmentList()
    }, []);

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
                                            <TextField variant="outlined" className='w-100' label="Surveyor name/Firm name" placeholder='Surveyor name/ Firm name'
                                                name='surveyor_or_Firm_name'
                                                id="surveyor_or_Firm_name"
                                                value={userDetails.surveyor_or_Firm_name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <TextField variant="outlined" className='w-100' label="Last name" placeholder='Last name'
                                                name='last_name'
                                                id="last_name"
                                                value={userDetails.last_name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <TextField variant="outlined" className='w-100' label="User name" placeholder='User name'
                                                name='user_name'
                                                id="user_name"
                                                value={userDetails.user_name}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <TextField variant="outlined" className='w-100' label="Mobile number" placeholder='Mobile number'
                                                name='mobile'
                                                id="mobile"
                                                value={userDetails.mobile}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <TextField variant="outlined" className='w-100' label="Storage Size Limit" placeholder='Size in kb eg.3500kb'
                                                name='space'
                                                id="space"
                                                value={userDetails.space}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <TextField variant="outlined" className='w-100' label="Links Count/Limit" placeholder='Links Count/Limit'
                                                name='link_limit'
                                                id="link_limit"
                                                value={userDetails.link_limit}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <TextField variant="outlined" className='w-100' label="Email" placeholder='Email address'
                                                name='email'
                                                id="email"
                                                value={userDetails.email}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <TextField variant="outlined" className='w-100' label="Password" placeholder='Password'
                                                name='password'
                                                id="password"
                                                value={userDetails.password}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <TextField variant="outlined" className='w-100' label="SLA Number" placeholder='SLA Number'
                                                name='sla_number'
                                                id="sla_number"
                                                value={userDetails.sla_number}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <TextField variant="outlined" className='w-100' label="IIISLA  Number" placeholder='IIISLA  Number'
                                                name='iiisla_number'
                                                id="iiisla_number"
                                                value={userDetails.iiisla_number}
                                                onChange={handleChange}
                                            />
                                        </div>



                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <FormControl fullWidth>
                                                <InputLabel >Department</InputLabel>
                                                <Select
                                                    labelId="demo-simple-select-label"
                                                    id="demo-simple-select"
                                                    value={selectedDepartment}
                                                    label="Department"
                                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                                >
                                                    {departmentList.map((item) => (
                                                        <MenuItem value={item.d_name} key={item.id}>{item.d_name}</MenuItem>
                                                    ))}
                                                </Select>
                                            </FormControl>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <TextField variant="outlined" className='w-100' label="Address" placeholder='Address'
                                                name='address'
                                                id="address"
                                                value={userDetails.address}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <TextField variant="outlined" className='w-100' label="Remark" placeholder='Remark'
                                                name='remark'
                                                id="remark"
                                                value={userDetails.remark}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                    <DatePicker label="Expiry Date" variant="outlined" className=' w-100 mb-4 me-3'
                                                        name='selectedDate'
                                                        id="selectedDate"
                                                        value={selectedDate ? selectedDate : null}
                                                        onChange={(newValue) => setSelectedDate(newValue)}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
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

        </>
    )
}

export default CreateUser