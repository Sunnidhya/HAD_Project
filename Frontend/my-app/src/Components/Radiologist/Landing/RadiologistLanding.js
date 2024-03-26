import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useState } from 'react';
import logout from '../../../Resources/log-out.png';
import './RadiologistLanding.css';
import 'bootstrap/dist/css/bootstrap.min.css';

import {
  Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button, Container, Row, Col
} from 'reactstrap';
import { useNavigate } from 'react-router-dom';
const RadioLanding = () => {

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


  const numberOfCards = 11;
  return (
    <div class="Had-login-container">
     <div class="Radio-Login-hor">
        <div>
          <img src={imgside} id="docsideimg" />
        </div>
        <div class="Search">  
           <input className="RadioSearch" type="text" placeholder="Search..." value={searchQuery} onChange={handleSearch}/>
        </div>
        <div class="RadioLogout" onClick={handleLogout}>  
        <img src={logout} alt="Logout" className="input-icon1" />
        </div>
    </div>

    <div className='Admin-Home-ver'>
        <div className='Admin-Home-ver1'>
          Content1
        </div>
        <div className='Admin-Home-ver2'>
        <div className="App">
         <Container>
            <Row xs={3}>
            {[...Array(numberOfCards)].map((e, i) => {
                return (
                  <Col>
                      <Card className='card'>
                          {/* <CardImg top width="100%" src="/assets/318x180.svg" alt="Card image cap"/> */}
                          <CardBody>
                              <CardTitle tag="h5">Card title #{i+1}</CardTitle>
                              <CardSubtitle tag="h6" className="mb-2 text-muted">Card subtitle</CardSubtitle>
                              <CardText>Some quick example text to build on the card title and make up the bulk of the
                                  card's
                                  content.</CardText>
                              <Button>Button</Button>
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
    <div></div>
      {/* <div class="Radiofooter">
        <h2>About Us</h2>
      </div> */}
    </div>
    
  );
};

export default RadioLanding;
