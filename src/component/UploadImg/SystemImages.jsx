import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom';
import { makeApi } from '../../helper/MakeApi';
import Loader from '../Loader';
import { toast } from 'react-toastify';

const SystemImages = () => {
    const { key } = useParams();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);

    const [selectedImages, setSelectedImages] = useState([]);

    const handleImageChange = (e) => {
        const files = e.target.files;
        setSelectedImages([...selectedImages, ...files]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true)
        try {
            if (!selectedImages) {
                toast.error("please select file")
            }
            const formData = new FormData();
            selectedImages.forEach(image => {
                formData.append("files[]", image);
            });
            formData.append("key", key);
            const response = await makeApi('post', "/v1/user/uploadFile", formData)
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
            
            <div className="container ">
                <div className="row">
                    <div className="col-lg-6 mx-auto mt-5">
                        <div className="card p-4 p-lg-5 p-md-5 p-sm-5 p-xl-5 p-xxl-5  shadow-lg border-1 d-flex justify-content-between  mt-5">
                            <h4 className='fw-bold mb-3 '>Choose file from you system</h4>
                            <form onSubmit={handleSubmit} className='d-flex justify-content-between flex-wrap p-0'>
                                <input type="file" className='mb-3' multiple onChange={handleImageChange} />
                                {loading ? <Loader /> : <button className="btn btn-primary mb-3" type="submit">Upload </button>}
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default SystemImages
