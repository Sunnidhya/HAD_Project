import React, { useState } from 'react';
import imgmain from '../../../Resources/scanned-image.jpg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import fullName from '../../../Resources/fullname3.png';
import address from '../../../Resources/address.png';
import Email from '../../../Resources/email.png';
import contact from '../../../Resources/Contact.png';
import { patientRegisterAPI } from '../../../Network/APIendpoints';
import './RegPatient.css';
import { useNavigate } from 'react-router-dom';
import { request } from '../../../Network/axiosHelper';
import ConsentForm from '../../Form/ConsentForm';

const RegPatient = () => {
//   here password1 is variable and set password is function
  let nav = useNavigate()
  const [password1, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true);
  const [showPopup, setShowPopup] = useState(false); 
  const [tempData, setTempData] = useState({})
  const [formSubmitted, setFormSubmitted] = useState(false);

  const handleToggle = () => {
    const passwordInput = document.getElementById('password');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  };

  const togglePopup = () => {
    setShowPopup(prevShowPopup => !prevShowPopup);
  };

  const handleFormSubmit = (flag) => {
    setFormSubmitted(flag);
    console.warn("DataConsent", flag)
    if(flag){
      togglePopup()
      showLoadingAlert()
      request("POST",
      patientRegisterAPI, 
      tempData
      ).then((response) => {
        console.warn("Data",response.data)
        alert(response.data.message);
        hideLoadingAlert()
        nav('/patient')
      })
      .catch((error) => {
        console.warn("Error", error)
      });
    }
  };

  const handleToggleConfirm = () => {
    const passwordInput = document.getElementById('Confirmpassword');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  };

  // Function to show loading alert
const showLoadingAlert = () => {
  // Create a loading alert element or use an existing one
  const loadingAlert = document.createElement("div");
  loadingAlert.textContent = "Loading..."; // Set text content to indicate loading
  loadingAlert.className = "loading-alert"; // Assign a class for easier identification
  loadingAlert.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Semi-transparent background
  loadingAlert.style.color = "#fff"; // Text color
  loadingAlert.style.position = "fixed"; // Fixed position
  loadingAlert.style.top = "0"; // Align to top
  loadingAlert.style.left = "0"; // Align to left
  loadingAlert.style.width = "100%"; // Full width
  loadingAlert.style.height = "100%"; // Full height
  loadingAlert.style.display = "flex"; // Flex container
  loadingAlert.style.justifyContent = "center"; // Center content horizontally
  loadingAlert.style.alignItems = "center"; // Center content vertically

  // Append the loading alert element to the document body
  document.body.appendChild(loadingAlert);
};

// Function to hide loading alert
const hideLoadingAlert = () => {
  // Find and remove the loading alert element
  const loadingAlert = document.querySelector(".loading-alert");
  if (loadingAlert) {
    loadingAlert.remove();
  }
};

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    if (event.target.value !== password1) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  };

  const regP = async (e,usernameP,fullnameP,addressP,emailP,contactP,passwordP,confirmPasswordP) => {
    if(passwordP === confirmPasswordP){
      e.preventDefault();
      localStorage.clear()
      const data = {
        userName: usernameP,
        password: passwordP,
        fullName: fullnameP,
        address: addressP,
        email: emailP,
        contactNo: contactP
      };
      setTempData(data)
      togglePopup()
    }else{
      alert("Password Mismatch")
    }
  };

  return (
    <div className="Patient-Reg-container1">
      <div className="Patient-Reg-hor">
        <div>
          <img src={imgside} id="patRsideimg" alt="App Logo" />
        </div>
        <div className="divisions1PR">
          <h1 className="pageTitlePR">Kavach - India's Leading Tele-Radiology Platform</h1>
        </div>
      </div>
      <div className="Patient-Reg-Ver">
        <div className="Patient-Reg-Ver-Left">
          <img src={imgmain} id="patRmainimg" alt="Patient" />
        </div>
        <div className="Patient-Reg-Ver-Right">
          <div className="Patient-Reg-container">
            <h3>Register Yourself !!</h3>
            <form className="login-formPR">
              <div className="form-group">
                <input type="text" id="username" name="username" placeholder='Username' required />
                <img src={userIcon} alt="Username" className="input-icon" />
              </div>
              <div class="form-group">
                <input type="text" id="fullname" name="fullname" placeholder='Fullname' required />
                <img src={fullName} alt="Fullname" className="input-icon" />
              </div>
              <div class="form-group">
                <input type="text" id="Address" name="Address" placeholder='Full Address' required />
                <img src={address} alt="Address" className="input-icon" />
              </div>
              <div class="form-group">
                <input type="text" id="Email" name="Email" placeholder='Email ID' required />
                <img src={Email} alt="Email" className="input-icon" />
              </div>
              <div class="form-group">
                <input type="text" id="Contact" name="Contact" placeholder='Contact Number' required />
                <img src={contact} alt="Contact" className="input-icon" />
              </div>
              <div className="form-group">
                <input type="password" id="password" name="password" placeholder='Password' required onChange={(e) => setPassword(e.target.value)} />
                <img src={passwordIcon} alt="Password" className="input-icon" />
                <i className="far fa-eye" id="faeye" onClick={handleToggle}></i>
              </div>
              <div className="form-group" >
                <input type="password" id="Confirmpassword" name="Confirmpassword" placeholder='Confirm Password' required onChange={handleConfirmPasswordChange} style={{ backgroundColor: confirmPassword && !passwordMatch ? "rgb(249, 52, 95)" : 'inherit' }} />
                <img src={passwordIcon} alt="Confirmpassword" className="input-icon" />
                <i className="far fa-eye" id="coneye" onClick={handleToggleConfirm}></i>
              </div>
              
            </form>
            <button type="submit" id="reg_patient"
            onClick={(e) =>
              regP(
                e,
                document.getElementById("username").value,
                document.getElementById("fullname").value,
                document.getElementById("Address").value,
                document.getElementById("Email").value,
                document.getElementById("Contact").value,
                document.getElementById("password").value,
                document.getElementById("Confirmpassword").value
              )
            }
            >
              Sign Up
            </button>
          </div>
        </div>
      </div>
      <div>
        {showPopup && (
          <div className="popup-overlay" onClick={togglePopup}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              <ConsentForm onFormSubmit={handleFormSubmit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegPatient;
