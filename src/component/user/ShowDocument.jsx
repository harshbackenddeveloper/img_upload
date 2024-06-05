import { Box, Checkbox, Fade, IconButton, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { makeApi } from '../../helper/MakeApi';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { toast } from 'react-toastify';
import Loader from '../Loader';
import '../../assets/css/modal.css'
import '../../assets/css/ShowImg.css';
import CloseIcon from '@mui/icons-material/Close';

const ShowDocument = ({ open, handleClose, id }) => {
    const [loading, setLoading] = useState(false)
    const [docImg, setDocImg] = useState([]);
    const [selectedImages, setSelectedImages] = useState([]);
    const [selectAll, setSelectAll] = useState(false);
    const [downloadMessage, setDownloadMessage] = useState(false)


    const getDocumentByLinkId = async () => {
        try {
            setLoading(true)
            const link_id = { link_id: id };
            const response = await makeApi('post', '/v1/user/showDoc', link_id);
            console.log("response of img", response);
            if (response.hasError == true) {
                toast.error(response.error.message);
                setDocImg([]);
            } else {
                setDocImg(response?.data || []);
            }
        } catch (error) {
            console.log(error);
        } finally {
            setLoading(false)
        }
    };

    useEffect(() => {
        if (open) {
            getDocumentByLinkId();
        }
    }, [open, id]);


    const handleImageSelection = (imageId) => {
        if (selectedImages.includes(imageId)) {
            setSelectedImages(selectedImages.filter(id => id !== imageId));
        } else {
            setSelectedImages([...selectedImages, imageId]);
        }
    };

    const handleSelectAll = () => {
        setSelectAll(!selectAll);
        if (!selectAll) {
            const allImageIds = docImg.map(item => item.id);
            setSelectedImages(allImageIds);
        } else {
            setSelectedImages([]);
        }
    };



    const handleDeleteImages = async () => {
        console.log("Deleting images:", selectedImages);
        if (selectedImages.length === 0) {
            toast.error('Please select an image');
            return;
        }

        const checkImgDownload = await makeApi("post", "/v1/user/checkimage", { id: selectedImages });
        const downloadMessage = checkImgDownload?.hasError === false && checkImgDownload?.error?.status;

        const confirmMessage = downloadMessage ? "Are you sure you want to delete them?" : "There are undownloaded images. Do you still want to delete them?";
        const confirmDelete = window.confirm(confirmMessage);
        if (!confirmDelete) {
            return;
        }

        const data = await makeApi('post', "/v1/user/deleteimage", { id: selectedImages });
        console.log("After deletion images", data);
        getDocumentByLinkId();
        toast.success('User images deleted successfully');
        setSelectedImages([]);
    };


    const downloadAllImg = async () => {
        try {
            if (selectedImages.length <= 0) {
                toast.error('please select img');
                return;
            }
            const response = await makeApi("post", "/v1/user/downloadmultiimage", { image_ids: selectedImages, link: docImg[0] && docImg[0].doc_name });
            console.log("response", response)
            const zipData = response.data;
            const decodedLink = decodeURIComponent(zipData);
            window.open(decodedLink);
            getDocumentByLinkId();
        } catch (error) {
            console.error("Error downloading image:", error);
            toast.error('Error downloading image');
        }
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        const options = { day: '2-digit', month: '2-digit', year: '2-digit' };
        return date.toLocaleDateString('en-GB', options);
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    }

    return (
        <>
            <Modal className='modal-lg' open={open} onClose={handleClose} closeAfterTransition            >
                <Fade in={open}>
                    <Box className="boxStyleShowDocument shadow border-0 rounded ">
                        <div className='d-flex justify-content-between'>
                            <h4 className='text-center fw-bold mb-3'>{docImg[0] && docImg[0].doc_name}</h4>
                            <CloseIcon style={{ color: 'red', cursor: 'pointer' }} onClick={() => handleClose()} />
                        </div>
                        {loading ? <Loader /> : (
                            docImg.length > 0 ? (<div>
                                <div className="table-responsive imupcrpopo">
                                    <table className="table table-hover table-bordered ">
                                        <thead className="table-dark">
                                            <tr>
                                                <th scope="col"> <Checkbox checked={selectAll} onChange={handleSelectAll} /></th>
                                                <th scope="col">S.No</th>
                                                <th scope="col">Img</th>
                                                <th scope="col">Date/Time</th>
                                                <th scope="col">Latitude</th>
                                                <th scope="col">Longitude</th>
                                                <th scope="col">Uploaded At</th>
                                                <th scope="col">Downloaded At</th>
                                                <th scope="col">Deleted At</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {docImg.map((item, index) => (
                                                <tr key={item.id}>
                                                    <td><Checkbox checked={selectedImages.includes(item.id)} onChange={() => handleImageSelection(item.id)} /></td>
                                                    <th scope="row" >{index + 1}</th>
                                                    <td>{item.is_deleted !== 1 ? <img style={{ height: '120px', width: '120px' }} src={"http://sharelink.clientdemobot.com/" + item.file} alt="Delete" /> : <h4 style={{ color: "red" }}>Deleted</h4>}</td>
                                                    <th scope="row" >Date: {formatDate(item.created_at)}, Time: {formatTime(item.created_at)}</th>
                                                    <th scope="row" >{item.latitude}</th>
                                                    <th scope="row" >{item.longitude}</th>
                                                    <th scope="row">Date: {formatDate(item.created_at)}, Time: {formatTime(item.created_at)}</th>
                                                    <th scope="row">{item.is_download === 1 ? `Date: ${formatDate(item.download_at)}, Time: ${formatTime(item.download_at)}` : ""}</th>
                                                    <th scope="row">{item.is_deleted === 1 ? `Date: ${formatDate(item.updated_at)}, Time: ${formatTime(item.updated_at)}` : ""}</th>
                                                </tr>
                                            ))}
                                        </tbody>

                                    </table>
                                </div>
                                <div>
                                    <IconButton >
                                        <DeleteIcon style={{ fontSize: '30px' }} onClick={() => handleDeleteImages()} />
                                    </IconButton>

                                    <IconButton>
                                        <DownloadIcon style={{ fontSize: '30px' }} onClick={() => downloadAllImg()} />
                                    </IconButton>
                                </div>
                            </div>) : (<h3 style={{ color: "red", textAlign: 'center' }}>Photo's are not available</h3>)
                        )}
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default ShowDocument