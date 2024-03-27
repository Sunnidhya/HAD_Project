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
    <div class="first-container">
    <div class="leftsidebar">
      <div class="logo">
        <img src={imgside} alt="Logo"/>
      </div>
      <div class="icon-button" onClick={adminClick}>
        <i class="fas fa-user"></i>
        Admin
        <i class="fas fa-chevron-right"/>
      </div>
      <div class="icon-button" onClick={doctorClick}>
        <i class="fas fa-stethoscope"></i>
        Doctor
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="icon-button" onClick={radioClick}>
        <i class="fas fa-user-md"></i>
        Radiologist
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="icon-button" onClick={labClick}>
        <i class="fas fa-x-ray"></i>
        Lab
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="icon-button" onClick={patientClick}>
        <i class="fas fa-hospital-user"></i>
        Patient
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="left-bottom">
      © 2024, Kavach Inc.
      </div>
    </div>
    
    <div class="right">
      <div class="bottom"></div>
      <div class="bg-text">
      <h1> Welcome to Kavach</h1>
      <blockquote>
       <p>Kavach stands as a pioneering force in the realm of teleradiology, providing a leading-edge platform for medical imaging interpretation and analysis.<br/>With its advanced technology and expert radiologists,Kavach ensures rapid and accurate diagnosis, enabling healthcare providers to deliver timely and precise patient care.<br/>Its seamless integration with healthcare systems allows for effortless transmission and interpretation of medical images, empowering healthcare professionals with actionable insights from anywhere in the world.<br/>Kavach's commitment to excellence and innovation makes it a trusted partner in the journey towards improved healthcare outcomes,setting a benchmark in the field of telemedicine and radiology services.<br/></p>
       </blockquote>
      

      </div>
    </div>
  </div>
  );
}

export default FirstPage;
