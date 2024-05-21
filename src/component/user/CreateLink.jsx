import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Box, Fade, Modal, TextField, } from '@mui/material';
import { makeApi } from '../../helper/MakeApi';
import ShowDocument from './ShowDocument';
import ShareLinkModal from './ShareLinkModal';
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

  //state for modal to show optio of sharing
  const [openOptionShare, setopenOptionShare] = useState(false)
  const handleCloseOptionForShare = () => setopenOptionShare(false)
  const [selectedLinkId, setSelectedLinkId] = useState('')

  //state for share link with user 
  const [openShareModal, setOpenShareModal] = useState(false)
  const [selectedShareId, setSelectedShareId] = useState('')

  //state for show document to user 
  const [showImageModal, setShowImageModal] = useState(false);
  const [selectedDocId, setSelectedDocId] = useState('');

  //state for whatsapp modal open and share details
  const [showWhatsApp, setShowWhatsApp] = useState(false);
  const [selectedWhatsAppId, setSelectedWhatsAppId] = useState('')

  //get previos link
  const getUserList = async () => {
    try {
      const userList = await makeApi('get', '/v1/user/getLinkById')
      console.log("user link created list ", userList);
      // if (userList.hasError == true) {
      //   toast.error(userList.error.message)
      // } else {
      setUser(userList.data)
      // }
    } catch (error) {
      console.log(error);
    }
  }

  useEffect(() => {
    getUserList()
  }, [])

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
        getUserList();
      }
    } catch (error) {
      console.log(error);
      toast.error(error);
    } finally {
      setLoading(false)
    }
  }

  //functioon for sharing link
  const shareDocumentLink = async (id) => {
    setopenOptionShare(true)
    setSelectedLinkId(id)
  }

  //function to show document 
  const showDocument = async (id) => {
    setSelectedDocId(id);
    setShowImageModal(true);
  }

  //function for sharing userDocument link with email 
  const shareByEmail = () => {
    setOpenShareModal(true)
    setSelectedShareId(selectedLinkId);
    setopenOptionShare(false)
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


  return (
    <>
      <div className='container'>
        <div className="card shadow-lg border-1 p-3 mt-3">
          <div className='d-flex justify-content-end'>
            <button onClick={openCreateLinkModal} className='btn btn-primary mb-3' >Create Link</button>
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
                </tr>
              </thead>
              <tbody>

                {user.map((item, index) => (
                  <tr key={item.id}>
                    <th scope="row" >{index + 1}</th>
                    <td>{item.link_name}</td>
                    <td>{item.link_url}</td>
                    <td><button className='btn btn-success' onClick={() => shareDocumentLink(item.id)}>Share</button></td>
                    <td><button className='btn btn-warning' onClick={() => showDocument(item.id)}>Show</button></td>
                  </tr>
                ))}

              </tbody>
            </table>) : (<h1 style={{ color: "red", textAlign: 'center' }}>No Data available</h1>)}
          </div>

          {/* modal to show option for share  */}

          <Modal
            aria-labelledby="spring-modal-title"
            aria-describedby="spring-modal-description"
            open={openOptionShare}
            onClose={handleCloseOptionForShare}
            closeAfterTransition
          >

            <Fade in={openOptionShare}>
              <Box className='boxStyle shadow border-0 rounded'>
                <h4 className='text-center mb-3 fw-bold '>Share By Link</h4>
                <div style={{ display: 'flex', flexDirection: 'column' }}>
                  <button className='btn btn-warning mb-2' onClick={() => shareByEmail()}>share by email</button>
                  <button className='btn btn-success mt-1 mb-2' onClick={() => shareByWhatsapp()}>share by whatsapp</button>
                </div>
              </Box>
            </Fade>
          </Modal>

          {/* popup for sharing link with user by email  */}
          <div>
            <ShareLinkModal
              open={openShareModal}
              handleCloseShare={() => setOpenShareModal(false)}
              id={selectedShareId}
            />
          </div>

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

      </div>
    </>
  )
}

export default CreateLink