import { Box, Checkbox, Fade, IconButton, Modal } from '@mui/material';
import React, { useEffect, useState } from 'react'
import { makeApi } from '../../helper/MakeApi';
import DeleteIcon from '@mui/icons-material/Delete';
import DownloadIcon from '@mui/icons-material/Download';
import { toast } from 'react-toastify';
import { saveAs } from 'file-saver';
import Loader from '../Loader';
import '../../assets/css/modal.css'
import '../../assets/css/ShowImg.css'


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
                console.log("response of img", response)
                setDocImg(response.data);
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

        // Check if any selected image is not downloaded
        const checkImgDownload = await makeApi("post", "/v1/user/checkimage", { id: selectedImages });
        console.log("Check image before download:", checkImgDownload);

        // Filter out the images that are not downloaded
        const notDownloadedImages = selectedImages.filter(imageId => !checkImgDownload.data.includes(imageId));

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
        console.log("Deleting images:", selectedImages);

        console.log("kljijfdjfdsfdskjfds", { image_ids: selectedImages })

        try {
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

    return (
        <>
            <Modal className='modal-lg' open={open} onClose={handleClose} closeAfterTransition            >
                <Fade in={open}>
                    <Box className="boxStyle shadow border-0 rounded ">
                        <h4 className='text-center fw-bold mb-3'>Images</h4>
                        {docImg.length > 0 ? (
                            <div >
                                <div className="table-responsive imupcrpopo">
                                    <table className="table table-hover table-bordered ">
                                        <thead className="table-dark">
                                            <tr>
                                                <th scope="col"> <Checkbox checked={selectAll} onChange={handleSelectAll} /></th>
                                                <th scope="col">S.No</th>
                                                <th scope="col">Img</th>
                                                <th scope="col">Download</th>

                                            </tr>
                                        </thead>

                                        {loading ? <Loader /> : (
                                            <tbody>
                                                {docImg.map((item, index) => (
                                                    <tr key={item.id}>
                                                        <td><Checkbox checked={selectedImages.includes(item.id)} onChange={() => handleImageSelection(item.id)} /></td>
                                                        <th scope="row" >{index + 1}</th>
                                                        <td>{<img style={{ height: '120px', width: '120px' }} src={"http://sharelink.clientdemobot.com/" + item.file} alt="not found" />}</td>
                                                        <th scope="row"> <DownloadIcon style={{ fontSize: '40px' }} onClick={() => downloadSingleImg(item)} /></th>
                                                    </tr>
                                                ))}

                                            </tbody>
                                        )}

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
                            </div>
                        ) : (<h3 style={{ color: "red", textAlign: 'center' }}>Photo's are not available</h3>)}
                    </Box>
                </Fade>
            </Modal>
        </>
    )
}

export default ShowDocument