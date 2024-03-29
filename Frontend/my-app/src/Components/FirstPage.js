import React, { useState } from 'react';
import './FirstPage.css';
import { useNavigate } from 'react-router-dom';
import imgside from '../Resources/AppLogo.png';
import Logout from '../Components/Form/Logout';
import RadioForm from '../Components/Form/RadioForm';
import DoctorForm from '../Components/Form/DoctorForm';
import LabForm from '../Components/Form/LabForm';
import UploadImage from './Form/UploadImage';
import ConsentForm from './Form/ConsentForm';
import DoctorReport from './Report/DoctorReport';
import ChangePasswordForm from './Form/ChangePassword';

function FirstPage() {
  let nav = useNavigate();

  const adminClick = () => {
    nav("/admin");
  };

  const doctorClick = () => {
    nav("/doctor");
  };

  const radioClick = () => {
    nav("/radiologist");
  };

  const labClick = () => {
    nav("/lab");
  };

  const patientClick = () => {
    nav("/patient");
  };

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(prevShowPopup => !prevShowPopup);
  };

  return (
    <div className="container">
      <div className="leftsidebar">
        <div className="logo">
          <img src={imgside} alt="Logo"/>
        </div>
        <div className="icon-button" onClick={adminClick}>
          <i className="fas fa-user"></i>
          Admin
          <i className="fas fa-chevron-right"/>
        </div>
        <div className="icon-button" onClick={doctorClick}>
          <i className="fas fa-stethoscope"></i>
          Doctor
          <i className="fas fa-chevron-right"></i>
        </div>
        <div className="icon-button" onClick={radioClick}>
          <i className="fas fa-user-md"></i>
          Radiologist
          <i className="fas fa-chevron-right"></i>
        </div>
        <div className="icon-button" onClick={labClick}>
          <i className="fas fa-x-ray"></i>
          Lab
          <i className="fas fa-chevron-right"></i>
        </div>
        <div className="icon-button" onClick={patientClick}>
          <i className="fas fa-hospital-user"></i>
          Patient
          <i className="fas fa-chevron-right"></i>
        </div>
        <div className="left-bottom">
          © 2024, Kavach Inc.
        </div>
      </div>
      <div className="right">
        <div className="bottom"></div>
        <div className="bg-text">
          <h1>Welcome to Kavach</h1>
          <blockquote>
            <p>Kavach stands as a pioneering force in the realm of teleradiology, providing a leading-edge platform for medical imaging interpretation and analysis.<br/>With its advanced technology and expert radiologists,Kavach ensures rapid and accurate diagnosis, enabling healthcare providers to deliver timely and precise patient care.<br/>Its seamless integration with healthcare systems allows for effortless transmission and interpretation of medical images, empowering healthcare professionals with actionable insights from anywhere in the world.<br/>Kavach's commitment to excellence and innovation makes it a trusted partner in the journey towards improved healthcare outcomes,setting a benchmark in the field of telemedicine and radiology services.<br/></p>
          </blockquote>
        </div>
      </div>

      {/* <div>
        <button onClick={togglePopup}>Logout</button>
        {showPopup && (
          <div className="popup-overlay" onClick={togglePopup}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              <Logout/>
            </div>
          </div>
        )}
      </div> */}
    </div>
  );
}

export default FirstPage;


