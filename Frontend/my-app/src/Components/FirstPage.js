import './FirstPage.css';
import DoctorLogin from './Doctor/Login/DoctorLogin';
import RadioLogin from './Radiologist/Login/RadioLogin';
import imgside from '../Resources/AppLogo.png';
import firstImage from '../Resources/FirstPageBackground.jpg'

function FirstPage() {
  return (
    // <>
    // <DoctorLogin/>
    // </>
    <div class="container">
    <div class="left">
      <div class="logo">
        <img src={imgside} alt="Logo"/>
      </div>
      <div class="icon-button">
        <i class="fas fa-user"></i>
        Admin
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="icon-button">
        <i class="fas fa-user"></i>
        Doctor
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="icon-button">
        <i class="fas fa-user"></i>
        Radiologist
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="icon-button">
        <i class="fas fa-user"></i>
        Lab
        <i class="fas fa-chevron-right"></i>
      </div>
      <div class="icon-button">
        <i class="fas fa-user"></i>
        Patient
        <i class="fas fa-chevron-right"></i>
      </div>
    </div>
    <div class="right">
      <div class="content">
        <h1>Welcome to Kavach</h1>
        <p>
Kavach stands as a pioneering force in the realm of teleradiology, providing a leading-edge platform for medical imaging interpretation and analysis. With its advanced technology and expert radiologists, Kavach ensures rapid and accurate diagnosis, enabling healthcare providers to deliver timely and precise patient care. Its seamless integration with healthcare systems allows for effortless transmission and interpretation of medical images, empowering healthcare professionals with actionable insights from anywhere in the world. Kavach's commitment to excellence and innovation makes it a trusted partner in the journey towards improved healthcare outcomes, setting a benchmark in the field of telemedicine and radiology services.</p>
        <img id='WelcomeImage'src={firstImage} alt="Image Right"/>
      </div>
    </div>
  </div>
  );
}

export default FirstPage;
