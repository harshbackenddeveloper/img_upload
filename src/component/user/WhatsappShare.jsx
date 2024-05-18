import { Box, Fade, Modal, TextField } from '@mui/material'
import React, { useState } from 'react'
import { makeApi } from '../../helper/MakeApi';
import Loader from '../Loader';
import '../../assets/css/modal.css'
import { toast } from 'react-toastify';

const WhatsappShare = ({ open, handleCloseWhatsapp, id }) => {
    //state for sharing details form
    const [loading, setLoading] = useState(false)
    const [mobile, setMobile] = useState('')

    //handleSubmit form for sharing details
    const submitShareForm = async (e) => {
        e.preventDefault();

        const trimmedMobile = mobile.trim();
        if(trimmedMobile.length !== 10){
            toast.error("please enter a valid number")
            return;
        }
        setLoading(true)
        try {
            const data = { id: id, mobile: mobile }
            const whatsapp = await makeApi('post', '/v1/user/generateWhatsAppLink', data)
            console.log("shareData", whatsapp);

            const decodedLink = decodeURIComponent(whatsapp);
            window.open(decodedLink, '_blank');
            setMobile(" ")
            handleCloseWhatsapp(false);
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    }

    return (
        <>
            <Modal open={open} onClose={handleCloseWhatsapp} closeAfterTransition>
                <Fade in={open}>
                    <Box className="boxStyle  shadow border-0 rounded">
                        <form onSubmit={submitShareForm}>
                            <h5 className='text-center fw-bold mb-3'>Share By WhatSsap</h5>
                            <TextField label="Mobile" variant="outlined" className='w-100 '
                                name='mobile'
                                id="mobile"
                                value={mobile}
                                onChange={(e) => setMobile(e.target.value)}
                            />

                            <div className="row g-3 align-items-center mt-1">
                                <div style={{ textAlign: 'center' }}>
                                    {loading ? <Loader /> : <button className='btn btn-success' type='submit'>Share</button>}
                                </div>
                            </div>
                        </form>
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default WhatsappShare