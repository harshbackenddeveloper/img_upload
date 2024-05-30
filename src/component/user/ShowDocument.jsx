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

    useEffect(() => {
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
        if (selectedImages.length <= 0) {
            toast.error('please select img');
            return;
        }

        // Check if any selected image is not downloaded
        const checkImgDownload = await makeApi("post", "/v1/user/checkimage", { id: selectedImages });
        console.log("Check image before download:", checkImgDownload);

        // Filter out the images that are not downloaded
        const notDownloadedImages = selectedImages.filter(imageId => !checkImgDownload.data.includes(imageId));
        console.log("notDownloadedImages", notDownloadedImages)

        if (notDownloadedImages.length > 0) {
            // Display confirmation dialog if some images are not downloaded
            const confirmDelete = window.confirm("Some images are not downloaded. Are you sure you want to delete them?");
            if (!confirmDelete) {
                return;
            }
        }
        const data = await makeApi('post', "/v1/user/deleteimage", { id: selectedImages })
        console.log("after deletetion images", data);

        const updatedDocImg = docImg.filter(item => !selectedImages.includes(item.id));
        setDocImg(updatedDocImg);
        toast.success('user images delete successfully')
        setSelectedImages([]);
    };

    //download single images
    const downloadSingleImg = async (item) => {
        try {
            const response = await makeApi("post", "/v1/user/downloadimage", { image: item.file });
            console.log("response", response)
            const zipData = response.data;
            const decodedLink = decodeURIComponent(zipData);
            window.open(decodedLink);
        } catch (error) {
            console.error("Error downloading image:", error);
            toast.error('Error downloading image');
        }
    }

    const downloadAllImg = async () => {
        try {
            if (selectedImages.length <= 0) {
                toast.error('please select img');
                return;
            }
            const response = await makeApi("post", "/v1/user/downloadmultiimage", { image_ids: selectedImages });
            console.log("response", response)
            const zipData = response.data;
            const decodedLink = decodeURIComponent(zipData);
            window.open(decodedLink);
        } catch (error) {
            console.error("Error downloading image:", error);
            toast.error('Error downloading image');
        }
    }

    function formatDate(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleDateString();
    }

    function formatTime(timestamp) {
        const date = new Date(timestamp);
        return date.toLocaleTimeString();
    }

    return (
        <>
            <Modal className='modal-lg' open={open} onClose={handleClose} closeAfterTransition            >
                <Fade in={open}>
                    <Box className="boxStyle shadow border-0 rounded " style={{ width: '700px' }} >
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
                                                <th scope="col">Download</th>
                                            </tr>
                                        </thead>

                                        <tbody>
                                            {docImg.map((item, index) => (
                                                <tr key={item.id}>
                                                    {/* {console.log("data inside map", item)} */}
                                                    <td><Checkbox checked={selectedImages.includes(item.id)} onChange={() => handleImageSelection(item.id)} /></td>
                                                    <th scope="row" >{index + 1}</th>
                                                    <td>{<img style={{ height: '120px', width: '120px' }} src={"http://sharelink.clientdemobot.com/" + item.file} alt="not found" />}</td>
                                                    <th scope="row" >Date: {formatDate(item.created_at)}, Time: {formatTime(item.created_at)}</th>
                                                    <th scope="row" >{item.latitude}</th>
                                                    <th scope="row" >{item.longitude}</th>
                                                    <th scope="row"> <DownloadIcon style={{ fontSize: '40px' }} onClick={() => downloadSingleImg(item)} /></th>
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