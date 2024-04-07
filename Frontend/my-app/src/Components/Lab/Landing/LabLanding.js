import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useEffect, useState } from 'react';
import logout from '../../../Resources/log-out.png';
import { decryptData } from '../../../EncryptDecrypt/EncDecrypt';
import './LabLanding.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Container, Row, Col
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import Logout from '../../Form/Logout';
import { getCasesOfLab } from '../../../Network/APIendpoints';
import { request } from '../../../Network/axiosHelper';
import UploadImage from '../../Form/UploadImage';
const LabLanding = () => {

  let nav = useNavigate()

  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupUpload, setShowPopupUpload] = useState(false);
  const [lab, setLab] = useState([]);

  const togglePopup = () => {
    setShowPopup(prevShowPopup => !prevShowPopup);
  };

  const togglePopupUpload = () => {
    setShowPopupUpload(prevShowPopup => !prevShowPopup);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const decryptedData = decryptData();
    const data = {
      userName: decryptedData
    };

    request("POST",getCasesOfLab , data)
      .then((response) => {
        setLab(response.data);
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  }, []);

  const profileget = () => {
    nav("/Lab/profile")
  }

  const numberOfCards = 24;
  
  return (
    <div class="Lab-landing-container">
     <div class="Lab-landing-hor">
        <div>
          <img src={imgside} id="docsideimg" />
        </div>
        <div class="Search">  
           <input className="LabSearch" type="text" placeholder="Search..." value={searchQuery} onChange={handleSearch}/>
        </div>
        <div class="LabLandingLogout" style={{cursor:"pointer"}} onClick={togglePopup}>  
           <img src={logout} alt="Logout" className="input-icon2" />
        </div>
    </div>

    <div className='Lab-Land-ver'>
        <div className='Lab-Land-ver1'>
        
            <button style={{ margin: '10px' }}>Upload</button>
            <button style={{ margin: '10px' }} onClick={profileget}>Profile</button>
            
        
        </div>
        <div className='Lab-Land-ver2'>
        <div className="Lab-card">
         <Container>
            <Row xs={3}>
            {lab.map((obj, i) => {
                const date = new Date(obj.caseDate);
                const year = date.getFullYear();
                const month = (date.getMonth() + 1).toString().padStart(2, '0');
                const day = date.getDate().toString().padStart(2, '0');
                const hours = date.getHours().toString().padStart(2, '0');
                const minutes = date.getMinutes().toString().padStart(2, '0');
                const seconds = date.getSeconds().toString().padStart(2, '0');
                const formattedDateTime = `${year}-${month}-${day}`;
                return (
                  <Col>
                      <Link to={`/card/${i+1}`}className="LinkStyle">
                        <Card className='LabLandingcard'style={{ backgroundColor:obj.markAsDone ? 'lightgreen' : 'red',color: 'white'}}>
                          <CardBody>
                              <CardTitle tag="h5">Case ID - {obj.caseId}</CardTitle>
                              <CardSubtitle tag="h6" >Case Name - {obj.caseName}</CardSubtitle>
                              <CardSubtitle tag="h6" >Patient Name - {obj.patientName}</CardSubtitle>
                              <CardSubtitle tag="h6" >Radiologist Name - {obj. radioName}</CardSubtitle>
                              <CardSubtitle tag="h6" >Doctor Name - {obj.doctorName}</CardSubtitle>
                              <CardSubtitle tag="h6" >Case Date - {formattedDateTime}</CardSubtitle>
                              <CardText>Case Description</CardText>
                             </CardBody>
                      </Card>
                      </Link>
                      
                  </Col>
                )
            })}
            </Row>
        </Container>
    </div>
    </div>
    </div>
    <div className="Lab-landing-about-us-section">
        <p>About Us</p>
    </div>
    <div>
        {showPopup && (
          <div className="popup-overlay" onClick={togglePopup}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              <Logout userType="lab"/>
            </div>
          </div>
        )}
        {showPopupUpload && (
          <div className="popup-overlay" onClick={togglePopupUpload}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              <UploadImage/>
            </div>
          </div>
        )}
      </div>
    </div>
    
  );
};

export default LabLanding;
