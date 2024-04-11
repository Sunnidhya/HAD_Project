import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useEffect, useState } from 'react';
import logout from '../../../Resources/log-out.png';
import './PatientDetails.css'
import { useNavigate, useLocation } from 'react-router-dom';
import scan from '../../../Resources/scanned-image3.webp';
import prescription from '../../../Resources/prescription1.avif';
import radiologistreport from '../../../Resources/radioreport.webp';
import finaldiagnosis from '../../../Resources/finaldiagnosis.avif';
import admin from '../../../Resources/Picture1.png';
import { request } from '../../../Network/axiosHelper';
import { getCaseById, getPatCaseById } from '../../../Network/APIendpoints';

const PatDetails = () => {

  let nav = useNavigate()

  const [searchQuery, setSearchQuery] = useState('');
  const [caseObj, setCaseObj] = useState(null);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const loc = useLocation();
  const {caseIdVal} = loc.state || {}
  console.warn("Data", caseIdVal);

  const handleLogout = () => {
    localStorage.clear()
    alert('Logout successful!');
    nav("/patient")
  };

  const getProfile = () => {
    nav("/patient/profile")
  }

  useEffect(() => {
    const data = {
      caseId: caseIdVal
    };

    request("POST", getCaseById , data)
      .then((response) => {
        setCaseObj(response.data);
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  }, []);

  return (
    <div className="Pat-details-container">
      <div className="Pat-Det-hor">
        <div>
          <img src={imgside} id="patdetimg" />
        </div>
        <div class="PatDetLogout" onClick={handleLogout}>
          <img src={logout} alt="Logout" className="pat-input-icon1" />
        </div>
      </div>
      <div className='Pat-Det-ver'>
        <div className='Pat-Det-ver1'>
          <button className="ProfilePatDetails" style={{ margin: '10px' }} onClick={getProfile}>Profile</button>
          <p>Consulting Doctor's Name: {caseObj ? caseObj.doctorName : "NA"}</p>
          <p>Consulting Radiologist's Name : {caseObj ? caseObj.radioName : "NA"}</p>
          <p>Consulting Lab's Name: {caseObj ? caseObj.labName : "NA"}</p>
        </div>
        <div className='Pat-Det-ver2-inner'>
          <div className="card">

            <div className="card-block">
              <div className="row" id="sortable">

                <div className="col-md-6 m-b-20" draggable="false">

                  <div className="card-sub">
                    <img className="card-img-top img-fluid" src={scan} alt="Card image cap" style={{ height: "344px", maxWidth: "100%", padding: "20px" }} />
                    <div className="card-block" style={{ textAlign: "center", color: "#1588C2" }}>
                      <h5 className="card-title">Scanned Images</h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-6  m-b-20">
                  <div className="card-sub">
                    <img className="card-img-top img-fluid" src={prescription} alt="Card image cap" style={{ height: "344px", maxWidth: "100%", padding: "20px" }} />
                    <div className="card-block" style={{ textAlign: "center", color: "#1588C2" }}>
                      <h5 className="card-title">Prescription</h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-6  m-b-20" >
                  <div className="card-sub">
                    <img className="card-img-top img-fluid" src={finaldiagnosis} alt="Card image cap" style={{ height: "344px", maxWidth: "100%", padding: "20px" }} />
                    <div className="card-block" style={{ textAlign: "center", color: "#1588C2" }} >
                      <h5 className="card-title">Final Diagnosis</h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-6  m-b-20" style={{ textAlign: "center", justifyContent: "center" }}>
                  <div className="card-sub">
                    <div className="card-block">
                      <button style={{ margin: "150px 50px 10px 50px" }} className='PatGenerateReport'>Generate Report</button><br />
                      <button style={{ margin: "5px 50px 135px 50px" }} className='PatMarkDone'>Mark as Done</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="patient-details-about-us-section">
        <p>About Us</p>
      </div>
    </div>

  );
};

export default PatDetails;
