import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useState } from 'react';
import logout from '../../../Resources/log-out.png';
import './AdminLanding.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Link } from 'react-router-dom';
import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Container, Row, Col
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
const AdminLanding = () => {

  let nav = useNavigate()

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLogout = () => {
    localStorage.clear()
    alert('Logout successful!');
    nav("/radiologist")
  };


  const numberOfCards = 24;
  const isDone=false;
  return (
    <div class="Admin-landing-container">
     <div class="Admin-landing-hor">
        <div>
          <img src={imgside} id="docsideimg" />
        </div>
        <div class="Search">  
           <input className="AdminSearch" type="text" placeholder="Search..." value={searchQuery} onChange={handleSearch}/>
        </div>
        <div class="AdminLandingLogout" onClick={handleLogout}>  
           <img src={logout} alt="Logout" className="input-icon2" />
        </div>
    </div>

    <div className='Admin-Land-ver'>
        <div className='Admin-Land-ver1'>
        
            <button style={{ margin: '10px' }}>Add new Patient</button>
            <button style={{ margin: '10px' }}>Profile</button>
            
        
        </div>
        <div className='Admin-Land-ver2'>
        <div className="Admin-card">
         <Container>
            <Row xs={3}>
            {[...Array(numberOfCards)].map((e, i) => {
                return (
                  <Col>
                      <Link to={`/card/${i+1}`}className="LinkStyle">
                        <Card className='AdminLandingcard'style={{ backgroundColor:isDone ? 'lightgreen' : 'red'}}>
                          <CardBody>
                              <CardTitle tag="h5">Case ID - {i+1}</CardTitle>
                              <CardSubtitle tag="h6" className="mb-2 text-muted">Case Name</CardSubtitle>
                              <CardSubtitle tag="h6" className="mb-2 text-muted">Patient Name</CardSubtitle>
                              <CardText>Case Description</CardText>
                              <Button style={{borderRadius: '5px', backgroundColor:'rgb(82,209,188)',height:'auto'}}>-</Button>
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
    <div className="Admin-landing-about-us-section">
        <p>About Us</p>
      </div>
    </div>
    
  );
};

export default AdminLanding;
