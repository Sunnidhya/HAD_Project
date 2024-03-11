import './FirstPage.css';
import DoctorLogin from './Doctor/Login/DoctorLogin';
import RadioLogin from './Radiologist/Login/RadioLogin';
import imgside from '../Resources/AppLogo.png';
import { useNavigate } from 'react-router-dom';

import firstImage from '../Resources/first_page.png';
import secondImage from '../Resources/first_text_part.png';
function FirstPage() {
  let nav = useNavigate()

  const adminClick = () => {
    nav("/admin")
  }

  const doctorClick = () => {
    nav("/doctor")
  }

  const radioClick = () => {
    nav("/radiologist")
  }

  const labClick = () => {
    nav("/lab")
  }

  const patientClick = () => {
    nav("/patient")
  }

  return (
    <div class="container">
    <div class="left">
      <div class="logo">
        <img src={imgside} alt="Logo"/>
      </div>
      <div class="icon-button" onClick={adminClick}>
        <i class="fas fa-user"></i>
        Admin
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="icon-button" onClick={doctorClick}>
        <i class="fas fa-user"></i>
        Doctor
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="icon-button" onClick={radioClick}>
        <i class="fas fa-user"></i>
        Radiologist
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="icon-button" onClick={labClick}>
        <i class="fas fa-user"></i>
        Lab
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="icon-button" onClick={patientClick}>
        <i class="fas fa-user"></i>
        Patient
        <i class="fas fa-chevron-right"></i>
      </div>
    </div>
    
    <div class="right">
      
      <div class="top">
        <header>
        <h1>Welcome <span class="blue">to</span> Kavach</h1>
        </header>
      </div>
      <div class="bottom">
        <div class="imageleft">
          <img id='WelcomeImage'src={firstImage} alt="Image Left"/>
        </div>
        <div class="imageright">
          <img id='Image'src={secondImage} alt="Image Right"/>
        </div>
      </div>
     
    </div>
  </div>
  );
}

export default FirstPage;
