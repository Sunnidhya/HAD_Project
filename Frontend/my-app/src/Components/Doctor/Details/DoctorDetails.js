import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useState } from 'react';
import logout from '../../../Resources/log-out.png';
import './DoctorDetails.css'
import { useNavigate } from 'react-router-dom';
import empty from '../../../Resources/EmptyState.PNG';
import admin from '../../../Resources/Picture1.png';
import scan from '../../../Resources/scanned-image3.webp';
import prescription from '../../../Resources/prescription1.avif';
import radiologistreport from '../../../Resources/radioreport.webp';
import finaldiagnosis from '../../../Resources/finaldiagnosis.avif';

const DoctorDetails = () => {

  let nav = useNavigate()

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLogout = () => {
    localStorage.clear()
    alert('Logout successful!');
    nav("/doctor")
  };

  const getProfile = () => {
    nav("/doctor/profile")
  }

  return (
    <div className="Doc-details-container">
      <div class="Doc-Det-hor">
        <div className='logodocdet'>
          <img src={imgside} id="docdetsideimg" />
        </div>
        <div class="DocDetLogout" onClick={handleLogout}>
          <img src={logout} alt="Logout" className="doc-input-icon1" />
        </div>
      </div>
      <div className='Doc-Det-ver'>
        <div className='Doc-Det-ver1'>
          <button className="ProfileDocDetails" style={{ margin: '10px' }} onClick={getProfile}>Profile</button>
          <p>Patients's Name: Samarpita</p>
          <p>Consulting Radiologist's Name : Samarpita</p>
          <p>Consulting Lab's Name: Samarpita</p>
        </div>
        <div className='Doc-Det-ver2-inner'>
          <div className="card">

            <div className="card-block">
              <div className="row" id="sortable">

                <div className="col-md-6 m-b-20" draggable="false">

                  <div className="card-sub">
                    <img className="card-img-top img-fluid" src={scan} alt="Card image cap" style={{height:"344px", maxWidth:"100%",padding:"20px"}}/>
                    <div className="card-block" style={{textAlign:"center", color:"#076E65"}}>
                      <h5 className="card-title">Scanned Images</h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-6  m-b-20">
                  <div className="card-sub">
                    <img className="card-img-top img-fluid" src={prescription} alt="Card image cap" style={{height:"344px",maxWidth:"100%",padding:"20px"}}/>
                    <div className="card-block" style={{textAlign:"center", color:"#076E65"}}>
                      <h5 className="card-title">Prescription</h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-6  m-b-20" >
                  <div className="card-sub">
                    <img className="card-img-top img-fluid" src={finaldiagnosis} alt="Card image cap" style={{height:"344px",maxWidth:"100%",padding:"20px"}} />
                    <div className="card-block" style={{textAlign:"center", color:"#076E65"}} >
                      <h5 className="card-title">Final Diagnosis</h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-6  m-b-20" style={{textAlign:"center", justifyContent:"center"}}>
                  <div className="card-sub">
                    <div className="card-block">
                      <button style={{margin:"150px 50px 10px 50px"}} className='GenerateReport'>Generate Report</button><br/>
                      <button style={{margin:"5px 50px 135px 50px"}} className='MarkDone'>Mark as Done</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="doctor-details-about-us-section">
        <p>About Us</p>
      </div>
    </div>

  );
};

export default DoctorDetails;
