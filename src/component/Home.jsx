import * as React from 'react';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Adminlogin from './admin/Admin_login';
import Userlogin from './user/User_login';
const Home = () => {
  const [value, setValue] = React.useState(0);

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

  return (
    <>
      <Box sx={{ width: '100%',  position: 'fixed' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="d-flex justify-content-center bg-warning">
          <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
            <Tab label="Admin Login" {...a11yProps(0)} />
            <Tab label="User Login" {...a11yProps(1)} />
          </Tabs>
        </Box>
        <CustomTabPanel value={value} index={0}>
          <Adminlogin />
        </CustomTabPanel>
        <CustomTabPanel value={value} index={1}>
          <Userlogin />
        </CustomTabPanel>
      </Box>
    </>
  )
}

export default Home
