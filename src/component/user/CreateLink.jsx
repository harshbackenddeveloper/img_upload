import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Box, Fade, Modal, TextField, } from '@mui/material';
import { makeApi } from '../../helper/MakeApi';
import ShowDocument from './ShowDocument';
import WhatsappShare from './WhatsappShare';
import Loader from '../Loader';
import dayjs from 'dayjs';
import { DemoContainer } from '@mui/x-date-pickers/internals/demo';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import '../../assets/css/modal.css';

const CreateLink = () => {
  const [user, setUser] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedLinkURL, setSelectedLinkURL] = useState(''); // New state for selected link URL

  //state for modal to show optio of sharing
  const [openOptionShare, setopenOptionShare] = useState(false)
  const handleCloseOptionForShare = () => setopenOptionShare(false)
  const [selectedLinkId, setSelectedLinkId] = useState('')

  //state for show document to user 
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState('');

  //state for whatsapp modal open and share details
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [selectedWhatsAppId, setSelectedWhatsAppId] = useState('')
  const [allLinkDetails, setAllLinkDetails] = useState([])

  //get previos link
  const getLinkList = async () => {
    setLoading(true)
    try {
      const LinkList = await makeApi('get', '/v1/user/getLinkById')
      const allDetailsLiks = await makeApi('get', '/v1/user/getstorage');
      setAllLinkDetails(allDetailsLiks.data)
      console.log("user link created list ", LinkList);
      if (LinkList.hasError == true) {
        toast.error(LinkList.error.message)
      } else {
        setUser(LinkList.data)
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    getLinkList()
  }, [])


  //function to copy url in clipboard
  let copyURLToClipboard = (url) => {
    navigator.clipboard.writeText(url)
      .then(() => {
        toast.success('URL copied to clipboard');
      })
      .catch((error) => {
        toast.error('Failed to copy URL', error);
      });
  };

  //function to delete link
  const deleteDocument = async (link_key) => {
    console.log("deleted link id", link_key)
    setLoading(true)
    try {
      const deleteLink = await makeApi('post', `/v1/user/destroy/link`, { key: link_key });
      if (deleteLink.hasError === 'true') {
        toast.error(deleteLink.error.message);
      } else {
        const updatedUser = user.filter(item => item.link_key !== link_key);
        setUser(updatedUser);
        toast.success("Link delted successfully")
        console.log("delte link", deleteLink);
        getLinkList();
      }
    } catch (error) {
      console.log(error)
    } finally {
      setLoading(false)
    }
  }

  // these state is for creating link
  const [selectedDate, setSelectedDate] = useState(null);
  const [link_name, setLink_name] = useState("");

  //handle submit form for creating link
  const createLink = async (e) => {
    e.preventDefault();
    setLoading(true)
    try {
      const formattedDate = dayjs(selectedDate).format('YYYY-MM-DD');
      const formData = { link_name: link_name, expiry_date: formattedDate }
      const createData = await makeApi('post', '/v1/user/create/link', formData);
      console.log("createData", createData);
      if (createData.hasError === true) {
        toast.error(createData.error.message)
      }
      else {
        toast.success("link created successfully")
        setLink_name("");
        setSelectedDate(null);
        closeCreateLinkModal(true)
        getLinkList();
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setLoading(false)
    }
  }

  //functioon for sharing link
  const shareDocumentLink = async (id, url) => {
    setSelectedLinkURL(url); 
    setopenOptionShare(true)
    setSelectedLinkId(id)
  }

  //function to show document 
  const showDocument = async (id) => {
    setSelectedDocId(id);
    setShowImageModal(true);
  }

  //function for sharing userDocument link with email 
  const shareByEmail = async () => {
    try {
      const shareData = await makeApi('post', '/v1/user/sendemail', { id: selectedLinkId });
      console.log("shareData", shareData);
      if (shareData.hasError == true) {
        toast.error(shareData.error.message)
      } else {
        toast.success("link share successfully")
        const decodedLink = decodeURIComponent(shareData.data);
        window.open(decodedLink, '_blank');
        handleCloseOptionForShare();
      }
    } catch (error) {
      console.log(error);
    }
  }

  //function for sharing userDocument link with shareByWhatsapp 
  const shareByWhatsapp = () => {
    setSelectedWhatsAppId(selectedLinkId)
    setShowWhatsApp(true)
    setopenOptionShare(false)
  }

  const [openModalCreateLink, setModalCreateLink] = useState(false);
  const openCreateLinkModal = () => setModalCreateLink(true);
  const closeCreateLinkModal = () => setModalCreateLink(false);

  console.log("allLinkDetails", allLinkDetails)

  // Function to convert size from KB to MB
  const convertToMB = (sizeInKB) => {
    return (sizeInKB / 1024).toFixed(2); // Convert KB to MB and round to 2 decimal places
  };

  return (
    <>
      {loading ? <Loader /> : (<div className='container pt-3'>
        <div className="card shadow border-1 p-3 mt-5 ">

          <div className='d-flex justify-content-between flex-wrap'>
            <div>
              <p className='mb-0 fs-5'>Link-limit : - {allLinkDetails.linkstatus}</p>
              <p className=' fs-5'> Space {convertToMB(allLinkDetails.remainingspace)} MB Free of {convertToMB(allLinkDetails.totalspace)} MB </p>
            </div>
            <div>
              <button onClick={openCreateLinkModal} className='btn btn-primary mb-3' >Create Link</button>
            </div>
          </div>

          <div className='table-responsive imulcrtlist'>
            {user.length > 0 ? (<table className="table table-hover table-bordered mt-0">
              <thead className='table-dark'>
                <tr>
                  <th scope="col">S.No</th>
                  <th scope="col">Link</th>
                  <th scope="col">URL</th>
                  <th scope="col">Share</th>
                  <th scope="col">Show</th>
                  <th scope="col">Delete</th>
                </tr>
              </thead>
              <tbody>
                {user.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row" >{index + 1}</th>
                    <td>{item.link_name}</td>
                    <td>{item.link_url}</td>
                    <td><button className='btn btn-success' onClick={() => {
                      if (item.status === 0) { shareDocumentLink(item.id, item.link_url); }
                    }}
                      disabled={item.status !== 0}
                    >
                      {item.status === 0 ? "Share" : "Expired"}
                    </button>
                    </td>
                    <td><button className='btn btn-warning' onClick={() => showDocument(item.id)}>Show</button></td>
                    <td> {loading ? <Loader /> : <button className='btn btn-danger' onClick={() => deleteDocument(item.link_key)}>Delete</button>} </td>
                  </tr>
                ))}
              </tbody>
            </table>) : (<h1 style={{ color: "red", textAlign: 'center' }}>No Data available</h1>)}
          </div>

          {/* modal to show option for share  */}
          <Modal open={openOptionShare} onClose={handleCloseOptionForShare} closeAfterTransition >
            <Fade in={openOptionShare}>
              <Box className='boxStyle shadow border-0 rounded'>
                <h5 className='mb-3'>Share</h5>
                <div className="row">
                  <div className='col-lg-12 col-md-12 col-sm-12'>
                    <div className='d-flex'>
                      <div className='me-4'>
                        <button className='btn btn-dark share-btn' onClick={() => shareByEmail()}><i className="fa-solid fa-envelope text-white" style={{ fontSize: '28px' }}></i></button><br />
                        <span style={{ fontSize: '14px', marginLeft: '10px' }}>Email</span>
                      </div>
                      <div>
                        <button className='btn btn-success share-btn' onClick={() => shareByWhatsapp()}><i className="fa-brands fa-whatsapp" style={{ fontSize: '28px' }}></i></button><br />
                        <span style={{ fontSize: '14px' }}>WhatsApp</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className='mt-3 border rounded'>
                  <div className='row p-2'>
                    <div className='col-lg-9 col-md-9 col-sm-9'>
                      <p style={{ overflow: 'hidden' }}>{selectedLinkURL}</p>
                    </div>
                    <div className='col-lg-3 col-md-3 col-sm-3'>
                      <button className='btn btn-primary' onClick={() => copyURLToClipboard(selectedLinkURL)}>Copy</button>
                    </div>
                  </div>
                </div>
              </Box>
            </Fade>
          </Modal>

          {/* these popup is for showing images whichever user watnt to see */}
          <div>
            <ShowDocument
              open={showImageModal}
              handleClose={() => setShowImageModal(false)}
              id={selectedDocId}
            />
          </div>

          <div>
            <WhatsappShare
              open={showWhatsApp}
              handleCloseWhatsapp={() => setShowWhatsApp(false)}
              id={selectedWhatsAppId}
            />
          </div>

          {/* modal creating link */}
          <div>
            <Modal open={openModalCreateLink} onClose={closeCreateLinkModal} >
              <Box className="shadow border-0 rounded boxStyle">
                <form onSubmit={createLink}>
                  <div className="card-body text-center p-2 ">
                    <h3 className="mb-4 fw-bold">Create Link</h3>
                    <TextField label="Link Name" variant="outlined" className=' w-100 mb-4 me-3'
                      name='link_name'
                      id="link_name"
                      value={link_name}
                      onChange={(e) => setLink_name(e.target.value)}
                    />

                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      <DemoContainer components={['DatePicker', 'DatePicker']}>
                        <DatePicker label="Expiry Date" variant="outlined" className=' w-100 mb-4 me-3'
                          name='selectedDate'
                          id="selectedDate"
                          value={selectedDate ? selectedDate : null}
                          onChange={(newValue) => setSelectedDate(newValue)}
                        />
                      </DemoContainer>
                    </LocalizationProvider>

                    <div className='d-flex justify-content-center'>
                      {loading ? (<Loader />) : (<button className="btn btn-primary d-block" type="submit">Create link</button>)}
                    </div>
                  </div>
                </form>
              </Box>
            </Modal>
          </div>
        </div>

      </div>)}

    </>
  )
}

export default CreateLink