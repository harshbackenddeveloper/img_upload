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
import { useParams } from 'react-router-dom'

const Create_Edit_form = () => {
    const { names } = useParams()
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [selectedDate, setSelectedDate] = useState(null);
    const [slaExpiryDate, setSlaExpiryDate] = useState("");
    const [departmentList, setDepartmentList] = useState([]);
    const [selectedDepartment, setSelectedDepartment] = useState('');
    const [userDetails, setUserDetails] = useState({
        surveyor_or_Firm_name: "",
        last_name: "",
        client_id: "",
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

    //function to get user department list 
    const getDepartmentList = async () => {
        setLoading(true)
        try {
            const response = await makeApi("get", "/v1/departmentlist");
            if (response.hasError === true) {
                toast.error(response.error.message)
            } else {
                setDepartmentList(response.data)
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const getDetailsById = async () => {
        setLoading(true)
        try {
            console.log("namess", names)
            const response = await makeApi('post', "/v1/get/getuserbyid", { user_id: names });
            console.log("user response", response.data)
            if (response.hasError === true) {
                toast.error(response.error.message)
            } else {
                const user = response.data[0];
                setUserDetails({
                    surveyor_or_Firm_name: user.surveyor_or_Firm_name || "",
                    last_name: user.last_name || "",
                    client_id: user.client_id || "",
                    password: "",
                    sla_number: user.sla_number || "",
                    iiisla_number: user.iiisla_number || "",
                    link_limit: user.link_limit || "",
                    space: user.space || "",
                    email: user.email || "",
                    mobile: user.mobile || "",
                    address: user.address || "",
                    remark: user.remark || "",
                });
                setSlaExpiryDate(dayjs(user.sla_expiry_date));
                setSelectedDate(dayjs(user.expiry_date));
                setSelectedDepartment(user.department);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const user_expiry_date = dayjs(selectedDate).format('YYYY-MM-DD');
            const sla_expiry_date = dayjs(slaExpiryDate).format('YYYY-MM-DD');
            const formData = { ...userDetails, expiry_date: user_expiry_date, department: selectedDepartment, sla_expiry_date: sla_expiry_date };

            const endpoint = names === "create" ? '/v1/createUser' : '/v1/updateUser';
            const response = await makeApi('post', endpoint, formData);

            if (response.hasError) {
                toast.error(response.error.message);
            } else {
                const successMessage = names === "create" ? 'Registered successfully' : 'User details updated successfully';
                toast.success(successMessage);
                navigate('/alluserlist');
            }
        } catch (error) {
            console.error(error);
            toast.error(error.response ? error.response.data.message : 'An error occurred');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getDepartmentList();
        getDetailsById();
    }, []);

    return (
        <>
            {loading ? <Loader /> : (<div className="container-fluid mgulmnbg"  >
                <div className="container logign-main-creating" >
                    <div className="col-lg-8  col-xl-6 col-xxl-6 mx-auto">
                        <div className="card p-5 ">
                            <form onSubmit={handleSubmit}>
                                <div className="card-body p-0 ">
                                    {names === "create" ? (<h3 className=" text-center mb-4 text-primary">Create User </h3>
                                    ) : (<h3 className=" text-center mb-4 text-primary">Edit User </h3>)}
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
                                            <TextField variant="outlined" className='w-100' label="Address" placeholder='Address'
                                                name='address'
                                                id="address"
                                                value={userDetails.address}
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
                                            <TextField variant="outlined" className='w-100' label="Email" placeholder='Email address' disabled={names !== 'create'}
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

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-1 mt-2">
                                            <TextField variant="outlined" className='w-100' label="Client Id" placeholder='Client Id'
                                                name='client_id'
                                                id="client_id"
                                                value={userDetails.client_id}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-1 ">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                    <DatePicker label="Expiry Date" variant="outlined" className=' w-100 mb-4' format="DD-MM-YYYY"
                                                        name='selectedDate'
                                                        id="selectedDate"
                                                        value={selectedDate ? selectedDate : null}
                                                        onChange={(newValue) => setSelectedDate(newValue)}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </div>


                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-1 mt-2">
                                            <TextField variant="outlined" className='w-100' label="SLA Number" placeholder='SLA Number eg.SLA-12562'
                                                name='sla_number'
                                                id="sla_number"
                                                value={userDetails.sla_number}
                                                onChange={handleChange}
                                            />
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-1">
                                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                                <DemoContainer components={['DatePicker', 'DatePicker']}>
                                                    <DatePicker label="SLA Expiry" variant="outlined" className=' w-100 mb-4' format="DD-MM-YYYY"
                                                        name='slaExpiryDate'
                                                        id="slaExpiryDate"
                                                        value={slaExpiryDate ? slaExpiryDate : null}
                                                        onChange={(newValue) => setSlaExpiryDate(newValue)}
                                                    />
                                                </DemoContainer>
                                            </LocalizationProvider>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <TextField variant="outlined" className='w-100' label="Storage Size Limit" placeholder='Size in mb eg.35mb'
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
                                            <FormControl fullWidth>
                                                <InputLabel >Department</InputLabel>
                                                <Select
                                                    id="demo-simple-select"
                                                    value={selectedDepartment}
                                                    label="Department"
                                                    onChange={(e) => setSelectedDepartment(e.target.value)}
                                                >
                                                    {loading ? <Loader /> : (
                                                        Array.isArray(departmentList) && departmentList.map((item) => (
                                                            <MenuItem value={item.d_name} key={item.id}>{item.d_name}</MenuItem>
                                                        ))
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </div>

                                        <div className="col-lg-6 col-md-6 col-sm-12 mb-3">
                                            <TextField variant="outlined" className='w-100' label="IIISLA Member Number" placeholder='eg.F/S/A/00252'
                                                name='iiisla_number'
                                                id="iiisla_number"
                                                value={userDetails.iiisla_number}
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

                                        <div className="col-12 d-flex justify-content-center">
                                            {names === "create" ? (
                                                loading ? (<Loader />) : (<button className="btn btn-primary btn-md btn-block" type="submit">Create User</button>)
                                            ) : (
                                                loading ? (<Loader />) : (<button className="btn btn-primary btn-md btn-block" type="submit">Update</button>)
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div >
            )}
        </>
    )
}

export default Create_Edit_form
