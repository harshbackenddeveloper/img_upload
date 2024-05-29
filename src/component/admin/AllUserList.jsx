import React, { useEffect, useState } from 'react';
import { makeApi } from '../../helper/MakeApi';
import { Button } from '@mui/material';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import '../../assets/css/modal.css'
import { useNavigate } from 'react-router-dom';

const AllUserList = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false)

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
      if (deleteUser.hasError == true) {
        toast.error(deleteUser.error.message)
      } else {
        console.log("delete user ", deleteUser);
        toast.success('user deleted successfully');
        getUserList();
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
      {loading ? <Loader /> : (
        <div className="container pt-3">
          <div className="card p-3   mt-5  shadow border-1 ">
            <div className='d-flex justify-content-between align-items-center mb-4'>
              <h4 className='fw-bold '>All User List</h4>
              <Button sx={{ textAlign: 'end' }} variant="contained" className='text-cend' onClick={() => navigate('/form/create')} >Create_User</Button>
            </div>

            {user.length > 0 ? (<div className='imulcrtlist table-responsive'>
              <table className="table table-hover  table-bordered">
                <thead className='table-dark'>
                  <tr>
                    <th scope="col">S.No</th>
                    <th scope="col">Surveyor Or Firm Name</th>
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
                      <td>{item.surveyor_or_Firm_name}</td>
                      <td>{item.last_name}</td>
                      <td>{item.mobile}</td>
                      <td>{item.link_limit}</td>
                      <td>{item.space}</td>
                      <td><button className='btn btn-warning' onClick={() => navigate(`/form/${item.id}`)}>Edit</button></td>
                      <td><button className='btn btn-danger' onClick={() => DeleteUser(item.email)}>Delete</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>) : (<h1 style={{ color: "red", textAlign: 'center' }}> User list is Empty</h1>)}


          </div>
        </div>

      )}
    </>
  )
}

export default AllUserList