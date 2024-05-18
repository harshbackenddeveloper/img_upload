import React, { useRef, useState } from 'react';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { makeApi } from '../../helper/MakeApi';
import Loader from '../Loader';
import Webcam from 'react-webcam';
import '../../assets/css/ImgUpload.css'

const FACING_MODE_USER = "user";
const FACING_MODE_ENVIRONMENT = "environment";

const videoConstraints = {
    facingMode: FACING_MODE_USER
};

const CaptureCamera = () => {
    const { key } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false)
    //img capture and upload
    const [capturedImages, setCapturedImages] = useState([]);
    const [facingMode, setFacingMode] = useState(FACING_MODE_USER);
    const [openCamera, setOpenCamera] = useState(false)
    const webcamRef = useRef(null);

    const capture = () => {
        const imageSrc = webcamRef.current.getScreenshot();
        // Convert base64 string to Blob
        fetch(imageSrc)
            .then(res => res.blob())
            .then(blob => {
                // Create a File object from the Blob
                const file = new File([blob], `captured_${Date.now()}.jpg`, { type: 'image/jpeg' });
                setCapturedImages([...capturedImages, file]);
            })
            .catch(error => console.error(error));
    };

    console.log("capturedImages", capturedImages);

    const flipCamera = () => {
        setFacingMode(prevMode =>
            prevMode === FACING_MODE_USER ? FACING_MODE_ENVIRONMENT : FACING_MODE_USER
        );
    };

    const uploadImg = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            const formData = new FormData();
            capturedImages.forEach(image => {
                formData.append("files[]", image);
            });
            formData.append("key", key);
            const response = await makeApi('post', "/v1/user/uploadFile", formData);
            setOpenCamera(false)
            console.log("response ", response)
            toast.success("images uploaded successfully");
            navigate('/')
        } catch (error) {
            console.log(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div>
            <h4 className='fw-bold  mt-3 ms-3'>Capture image  with camera </h4>
            <div>
                {openCamera ? <button onClick={flipCamera} className='btn btn-primary   ms-3 mb-3 '>Flip Camera</button>
                    : <button onClick={() => setOpenCamera(true)} className='btn btn-success p-2 ms-3 mb-3'>Open Camera</button>}

                {openCamera ? (<div className='container-fluid'>
                    <div className='row'>
                        <div className='col-lg-6  col-md-12 col-12'>
                            <Webcam className='w-100 mt-1' audio={false} ref={webcamRef} screenshotFormat="image/jpeg"
                                videoConstraints={{
                                    ...videoConstraints,
                                    facingMode
                                }} />

                            <div className='d-flex justify-content-end'>
                                <button onClick={capture} className='btn btn-warning  mt-2 mb-2'>Capture Photo</button>
                                {loading ? <Loader /> : <button onClick={uploadImg} className='btn btn-success ms-3 mt-2 mb-2'>Upload</button>}
                            </div>
                        </div>
                        <div className='col-lg-6  col-md-12 col-12 imup-scrolling'>
                            <div className=''>
                                {capturedImages.map((file, index) => (
                                    <img className='imupca-image' key={index} src={URL.createObjectURL(file)} alt={`Captured ${index + 1}`} />
                                ))}
                            </div>

                        </div>
                    </div>
                </div>) : (null)
                }
            </div>
        </div>
    )
}

export default CaptureCamera
