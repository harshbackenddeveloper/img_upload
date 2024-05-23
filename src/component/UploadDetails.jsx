import React, { useEffect, useState } from 'react'
import { Box } from '@mui/material';
import CaptureCamera from './UploadImg/CaptureCamera';
import SystemImages from './UploadImg/SystemImages';
import { makeApi } from '../helper/MakeApi';
import { useParams } from 'react-router-dom';
import Loader from './Loader';

const UploadDetails = () => {
    //function for checkbox
    const { key } = useParams()
    const [isValid, setIsValid] = useState();
    const [loading, setLoading] = useState(false)


    //function to check link is valid is or not
    const CheckValid = async () => {
        setLoading(true)
        try {
            const response = await makeApi('post', "/v1/user/checkvalidurl", { key: key })
            console.log("valid data at upload details component  ", response)
            if (response.data.status == 1) {
                setIsValid(true)
            } else {
                setIsValid(false);
            }
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        CheckValid()
    }, [])

    return (
        <>
            {loading ? <Loader /> : (
                isValid ? (
                    <div className="container">
                        <div className="row">
                            <div className="col-lg-5 col-md-12 col-12">
                                <SystemImages />
                            </div>
                            <div className="col-lg-7 col-md-12 col-12">
                                <CaptureCamera />
                            </div>
                        </div>
                    </div>

                ) : (<h1 style={{ color: 'red', textAlign: 'center' }}>"link is expired"</h1>)
            )}
        </>
    );
};

export default UploadDetails;