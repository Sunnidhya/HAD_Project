import './FirstPage.css';
import DoctorLogin from './Doctor/Login/DoctorLogin';
import RadioLogin from './Radiologist/Login/RadioLogin';
import imgside from '../Resources/AppLogo.png';
import firstImage from '../Resources/first_page.png';
import secondImage from '../Resources/first_text_part.png';
function FirstPage() {
  return (
    // <>
    // <DoctorLogin/>
    // </>
    <div class="container">
    <div class="leftsidebar">
      <div class="logo">
        <img src={imgside} alt="Logo"/>
      </div>
      <div class="icon-button">
        <i class="fas fa-user"></i>
        Admin
        {/* <i class="fas fa-chevron-right"></i> */}
      </div>
      <div class="icon-button">
        <i class="fas fa-user"></i>
        Doctor
        {/* <i class="fas fa-chevron-right"></i> */}
      </div>
      <div class="icon-button">
        <i class="fas fa-user"></i>
        Radiologist
        {/* <i class="fas fa-chevron-right"></i> */}
      </div>
      <div class="icon-button">
        <i class="fas fa-user"></i>
        Lab
        {/* <i class="fas fa-chevron-right"></i> */}
      </div>
      <div class="icon-button">
        <i class="fas fa-user"></i>
        Patient
        {/* <i class="fas fa-chevron-right"></i> */}
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
