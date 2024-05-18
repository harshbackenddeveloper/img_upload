import React, { useEffect, useState } from 'react';
import { makeApi } from '../../helper/MakeApi';
import { Box, Fade, Modal, TextField } from '@mui/material';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import '../../assets/css/modal.css'

const AllUserList = () => {
  const [open, setOpen] = useState(false);
  const handleClose = () => setOpen(false);
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false)

  const [userDetails, setUserDetails] = useState({
    first_name: "",
    last_name: "",
    email: "",
    mobile: "",
    space: "",
    link_limit: ""
  })

  //handlechange function for edit user details 
  const handleEditDetails = (e) => {
    const { name, value } = e.target;
    setUserDetails((oldVal) => ({
      ...oldVal,
      [name]: value
    }))
  }

  const getUserList = async () => {
    try {
      setLoading(true)
      const userList = await makeApi('get', '/v1/get/users')
      console.log("userlist", userList)
      if (userList.hasError == true) {
        toast.error(userList.error.message)
      } else {
        setUser(userList.data)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  //Delete user function
  const DeleteUser = async (email) => {
    try {
      const deleteUser = await makeApi('post', "/v1/destoryUser", { email: email });
      console.log("delete user ", deleteUser);
      toast.success('user deleted successfully');
      getUserList();
    } catch (error) {
      console.log(error)
    }
  }

  //edit user function 
  const EditUser = async (user) => {
    setUserDetails(user)
    setOpen(true)
  }

  //submit edit user details
  const submitEditForm = async (e) => {
    e.preventDefault();
    const trimmedMobile = userDetails.mobile.trim();
    if (trimmedMobile.length !== 10) {
      toast.error("please enter a valid number")
      return;
    }
    try {
      const Updateuser = await makeApi('post', "/v1/updateUser", userDetails);
      console.log("user updated successfully", Updateuser);
      if (Updateuser.hasError == true) {
        toast.error(Updateuser.error.message)
      } else {
        toast.success("user details updated successfully");
        getUserList();
        setOpen(false);
      }
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getUserList()
  }, [])

  return (
    <>
      {loading ? <Loader /> : (user.length > 0 ? (
        <div className="container ">
          <div className="card p-3   mt-5  shadow-lg border-1 ">
            <h4 className='fw-bold mb-3'>All User List</h4>
            <div className='imulcrtlist table-responsive'>
              <table className="table table-hover  table-bordered">
                <thead className='table-dark'>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">First name</th>
                    <th scope="col">Last name</th>
                    <th scope="col">Mobile Number</th>
                    <th scope="col">Link limit</th>
                    <th scope="col">Space</th>
                    <th scope="col">Edit</th>
                    <th scope="col">Delete</th>
                  </tr>
                </thead>
                <tbody>
                  {user.map((item, index) => (
                    <tr key={item.id}>
                      <th scope="row" >{index + 1}</th>
                      <td>{item.first_name}</td>
                      <td>{item.last_name}</td>
                      <td>{item.mobile}</td>
                      <td>{item.link_limit}</td>
                      <td>{item.space}</td>
                      <td><button className='btn btn-warning' onClick={() => EditUser(item)}>Edit</button></td>
                      <td><button className='btn btn-danger' onClick={() => DeleteUser(item.email)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      ) : (<h1 style={{ color: "red", textAlign: 'center' }}>No Data available</h1>))}

      <div>
        <Modal
          open={open}
          onClose={handleClose}
          closeAfterTransition
          slotProps={{ backdrop: { TransitionComponent: Fade } }}>
          <Fade in={open}>
            <Box className="boxStyle showdow border-0 rounded">
              <h4 className='mb-4  fw-bold'>Edit User Details</h4>
              <form onSubmit={submitEditForm}>

                <TextField label="First name" variant="outlined" className='w-100 mb-3'
                  name='first_name'
                  id="first_name"
                  value={userDetails.first_name}
                  onChange={handleEditDetails}
                />

                <TextField label="Last name" variant="outlined" className='w-100 mb-3'
                  name='last_name'
                  id="last_name"
                  value={userDetails.last_name}
                  onChange={handleEditDetails}
                />

                <TextField label="User email" variant="outlined" className='w-100 mb-3'
                  name='email'
                  id="email"
                  value={userDetails.email}
                  onChange={handleEditDetails}
                />

                <TextField label="Mobile" variant="outlined" className='w-100 mb-3'
                  name='mobile'
                  id="mobile"
                  value={userDetails.mobile}
                  onChange={handleEditDetails}
                />
                <TextField label="Space" variant="outlined" className='w-100 mb-3'
                  name='space'
                  id="space"
                  value={userDetails.space}
                  onChange={handleEditDetails}
                />

                <TextField label="Link limit" variant="outlined" className='w-100 mb-3'
                  name='link_limit'
                  id="link_limit"
                  value={userDetails.link_limit}
                  onChange={handleEditDetails}
                />

                <div className="row g-3 align-items-center mt-1">
                  <div style={{ textAlign: 'center' }}>
                    {loading ? <Loader /> : <button className='btn btn-success' type='submit'>Update</button>}
                  </div>
                </div>
              </form>
            </Box>
          </Fade>
        </Modal>
      </div>
    </>
  )
}

export default AllUserList