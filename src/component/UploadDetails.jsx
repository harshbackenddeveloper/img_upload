import { Tab } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { Box, Tabs, Typography } from '@mui/material';
import CaptureCamera from './UploadImg/CaptureCamera';
import SystemImages from './UploadImg/SystemImages';
import { makeApi } from '../helper/MakeApi';
import { useParams } from 'react-router-dom';

const UploadDetails = () => {
    //function for checkbox
    const { key } = useParams()
    const [value, setValue] = useState(0);
    const [isValid, setIsValid] = useState();

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    function a11yProps(index) {
        return {
            id: `tab-${index}`,
            'aria-controls': `tabpanel-${index}`,
        };
    }

    function CustomTabPanel(props) {
        const { children, value, index, ...other } = props;
        return (
            <div role="tabpanel" hidden={value !== index} id={`tabpanel-${index}`} {...other}>
                {value === index && (
                    <Box sx={{ p: 3 }}>
                        <Typography>{children}</Typography>
                    </Box>
                )}
            </div>
        );
    }

    //function to check link is valid is or not
    const CheckValid = async () => {
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
        }
    }

    useEffect(() => {
        CheckValid()
    }, [])

    return (
        <>
            {isValid ? (
                <Box sx={{ width: '100%' }}>
                    <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="d-flex justify-content-center bg-warning">
                        <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                            <Tab label="Choose from System" {...a11yProps(0)} />
                            <Tab label="Capture from Camera" {...a11yProps(1)} />
                        </Tabs>
                    </Box>
                    <CustomTabPanel value={value} index={0}>
                        <SystemImages />
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={1}>
                        <CaptureCamera />
                    </CustomTabPanel>
                </Box>
            ) : (<h1 style={{ color: 'red', textAlign: 'center' }}>"link is expired"</h1>)}
        </>
    );
};

export default UploadDetails;