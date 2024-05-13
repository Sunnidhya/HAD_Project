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
  const [caseIdValueClicked, setCaseIdValueClicked] = useState();
  const [originalLab, setOriginalLab] = useState([]);

  const togglePopup = () => {
    setShowPopup(prevShowPopup => !prevShowPopup);
  };

  const togglePopupUpload = () => {
    setShowPopupUpload(prevShowPopup => !prevShowPopup);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    if(event.target.value !== ''){
      setLab(lab.filter(la =>
        la.caseName.toLowerCase().includes(event.target.value.toLowerCase()) ||
        la.caseId.toString().toLowerCase().includes(event.target.value.toLowerCase()) ||
        la.patientName.toLowerCase().includes(event.target.value.toLowerCase()) ||
        la.doctorName.toLowerCase().includes(event.target.value.toLowerCase()) ||
        la.labName.toLowerCase().includes(event.target.value.toLowerCase()) ||
        la.radioName.toLowerCase().includes(event.target.value.toLowerCase())||
        la.caseDescription.toLowerCase().includes(event.target.value.toLowerCase())
      ));
    }else{
      setLab(originalLab)
    }
  };

  const openUploadImageDialog = (objValue) => {
    if(!objValue.markAsDone){
      setCaseIdValueClicked(objValue.caseId)
      togglePopupUpload()
    }else{
      alert("The case is closed")
    }
  }

  useEffect(() => {
    const decryptedData = decryptData();
    const data = {
      userName: decryptedData
    };

    request("POST", getCasesOfLab, data)
      .then((response) => {
        setLab(response.data);
        setOriginalLab(response.data)
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  }, []);

  const profileget = () => {
    nav("/Lab/profile")
  }

  return (
    <div class="Lab-landing-container">
      <div class="Lab-landing-hor">
        <div>
          <img src={imgside} id="lablandsideimg" />
        </div>
        <div class="LabLandingSearch">
          <input className="LabSearch" type="text" placeholder="Search..." value={searchQuery} onChange={handleSearch} />
        </div>
        <div class="LabLandingLogout" style={{ cursor: "pointer" }} onClick={togglePopup}>
          <img src={logout} alt="Logout" className="input-lab-land-icon2" />
        </div>
      </div>

      <div className='Lab-Land-ver'>
        <div className='Lab-Land-ver1'>
          <button style={{ margin: '10px' }} onClick={profileget} className='lab-landing-button'>Profile</button>
        </div>
        <div className='Lab-Land-ver2'>
          <div className="Lab-card">
            <Container>
              <Row xs={1}>
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
                      <Card className='LabLandingcard'
                        style=
                        {{
                          background: obj.markAsDone ? 'linear-gradient(to right, lightgreen, rgb(37,116,68))' : 'linear-gradient(to right, #E9755F, #C15556)',
                          color: 'white',
                          boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.3)',
                          border: 'rgb(241, 247, 247) solid 3px',
                          cursor: 'pointer'
                        }}
                      >
                        <CardBody onClick={() => openUploadImageDialog(obj)} style={{ fontFamily: 'Arial, sans-serif' }}>
                          <Row>
                            <Col xs="4">
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                <CardTitle tag="h4" style={{ marginBottom: '10px' }}>Case ID - {obj.caseId}</CardTitle>
                              </div>
                            </Col>
                            <Col xs="8">
                              <div style={{ textAlign: 'left', borderLeft: '2px solid lightgray', paddingLeft: '25px' }}>

                                
                                <CardSubtitle  style={{ marginBottom: '5px',fontSize:'18px' }} >Case Name - {obj.caseName}</CardSubtitle>
                                <CardSubtitle style={{ marginBottom: '5px',fontSize:'18px' }} >Patient Name - {obj.patientName}</CardSubtitle>
                                <CardSubtitle style={{ marginBottom: '5px',fontSize:'18px' }} >Radiologist Name - {obj.radioName}</CardSubtitle>
                                <CardSubtitle style={{ marginBottom: '5px',fontSize:'18px' }} >Doctor Name - {obj.doctorName}</CardSubtitle>
                                <CardSubtitle style={{ marginBottom: '5px',fontSize:'18px' }} >Case Date - {formattedDateTime}</CardSubtitle>
                                <CardSubtitle style={{ marginBottom: '5px',fontSize:'18px' }} >Case Description - {obj.caseDescription}</CardSubtitle>
                              </div>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
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
              <Logout userType="lab" />
            </div>
          </div>
        )}
        {showPopupUpload && (
          <div className="popup-overlay" onClick={togglePopupUpload}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              <UploadImage caseIdValue={caseIdValueClicked} />
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default LabLanding;
