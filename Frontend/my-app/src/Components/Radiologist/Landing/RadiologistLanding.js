import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useEffect, useState } from 'react';
import logout from '../../../Resources/log-out.png';
import { decryptData } from '../../../EncryptDecrypt/EncDecrypt';
import './RadiologistLanding.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Container, Row, Col
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
import Logout from '../../Form/Logout';
import { getCasesOfRadiologists } from '../../../Network/APIendpoints';
import { request } from '../../../Network/axiosHelper';
const RadioLanding = () => {

  let nav = useNavigate()

  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [radiologist, setRadiologist] = useState([]);
  const togglePopup = () => {
    setShowPopup(prevShowPopup => !prevShowPopup);
  };

  const profileget = () => {
    nav("/radiologist/profile")
  }

  const goToDetailsPage = (objectVal) => {
    nav('/radiologist/chat', {state: {caseIdValue: objectVal}});
  }


  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };
  useEffect(() => {
    const decryptedData = decryptData();
    const data = {

      userName: decryptedData
    };

    request("POST", getCasesOfRadiologists, data)
      .then((response) => {
        setRadiologist(response.data);
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  }, []);
  
  return (
    <div class="Radio-landing-container">
      <div class="Radio-landing-hor">
        <div>
          <img src={imgside} id="radlandsideimg" />
        </div>
        <div class="DoctorLandingSearch" id="myInput">
          <input className="RadioSearch" type="text" placeholder="Search..." value={searchQuery} onChange={handleSearch}/>
        </div>
        <div class="RadioLandingLogout" style={{ cursor: "pointer" }} onClick={togglePopup}>
          <img src={logout} alt="Logout" className="input-rad-land-icon2" />
        </div>
      </div>

      <div className='Radio-Land-ver'>
        <div className='Radio-Land-ver1'>
          <button style={{ margin: '10px' }} onClick={profileget} className='radio-landing-button'>Profile</button>
        </div>
        <div className='Radio-Land-ver2'>
          <div className="Radio-card">
            <Container>
              <Row xs={1}>
                {radiologist.map((obj, i) => {
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
                        <Card className='RadioLandingcard' style={{ background: obj.markAsDone ? 'linear-gradient(to right, lightgreen, rgb(37,116,68))' : 'linear-gradient(to right, #E9755F, #C15556)',
                          color: 'white',
                          cursor: 'pointer',
                          boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.3)',
                          border: 'rgb(241, 247, 247) solid 3px', }} onClick={() => goToDetailsPage(obj.caseId)}>
                          <CardBody style={{ fontFamily: 'Arial, sans-serif' }}>
                          <Row>
                            <Col xs="4">
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                            <CardTitle tag="h4" style={{ marginBottom: '10px' }}>Case ID - {obj.caseId}</CardTitle>

                            </div>
                            </Col>
                            <Col xs="8">
                              <div style={{ textAlign: 'left',borderLeft: '2px solid lightgray',paddingLeft: '25px' }}>
                            <CardSubtitle  style={{ marginBottom: '5px',fontSize:'18px' }}>Case Name - {obj.caseName}</CardSubtitle>
                            <CardSubtitle  style={{ marginBottom: '5px',fontSize:'18px'}}>Patient Name - {obj.patientName}</CardSubtitle>
                            <CardSubtitle style={{ marginBottom: '5px',fontSize:'18px' }}>Doctor Name - {obj.doctorName}</CardSubtitle>
                            <CardSubtitle style={{ marginBottom: '5px' ,fontSize:'18px'}}>Lab Name - {obj.labName}</CardSubtitle>
                            <CardSubtitle style={{ marginBottom: '5px',fontSize:'18px' }}>Case Date - {formattedDateTime}</CardSubtitle>
                            <CardSubtitle style={{ marginBottom: '5px',fontSize:'18px' }}>Case Description - </CardSubtitle>
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
      <div className="radio-landing-about-us-section">
        <p>About Us</p>
      </div>
      <div>
        {showPopup && (
          <div className="popup-overlay" onClick={togglePopup}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              <Logout userType="radiologist" />
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default RadioLanding;
