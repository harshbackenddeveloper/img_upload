import { Box, Fade, Modal, TextField } from '@mui/material'
import React, { useState } from 'react'
import { makeApi } from '../../helper/MakeApi';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import '../../assets/css/modal.css'

const ShareLinkModal = ({ open, handleCloseShare, id }) => {
    const [loading, setLoading] = useState(false);
    //state for sharing details form
    const [details, stDetails] = useState({
        email: "",
        receiver_name: ""
    })

    //handleChange function for sharing link 
    const handleShareLink = (e) => {
        const { name, value } = e.target;
        stDetails((oldVal) => ({
            ...oldVal,
            [name]: value
        }))
    }

    //handleSubmit form for sharing details
    const submitShareForm = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const data = {
                id: id,
                email: details.email,
                name: details.receiver_name
            }
            const shareData = await makeApi('post', '/v1/user/sendemail', data);
            console.log("shareData", shareData);
            if (shareData.hasError == true) {
                toast.error(shareData.error.message)
            } else {
                stDetails(" ");
                toast.success("link share successfully")
                handleCloseShare(false);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Modal open={open} onClose={handleCloseShare} closeAfterTransition >
                <Fade in={open}>
                    <Box className="boxStyle shadow border-0 rounded">
                        <form onSubmit={submitShareForm}>
                            <h5 className='text-center fw-bold mb-2'>Share By Email</h5>

                            <TextField label="Email" variant="outlined" className='w-100 mb-4 pt-2'
                                name='email'
                                id="email"
                                value={details.email}
                                onChange={handleShareLink}
                            />
                            <TextField label="Receiver name" variant="outlined" className='w-100 mb-4'
                                name='receiver_name'
                                id="receiver_name"
                                value={details.receiver_name}
                                onChange={handleShareLink}
                            />

                            <div style={{ textAlign: 'center' }}>
                                {loading ? <Loader /> : <button className='btn btn-success' type='submit'>Share</button>}
                            </div>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default ShareLinkModal