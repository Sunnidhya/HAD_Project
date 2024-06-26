import imgmain from '../../../Resources/scanned-image.jpg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import React,{useState, useEffect} from "react";
import imgside from '../../../Resources/AppLogo.png';
import { request, setAuthToken } from '../../../Network/axiosHelper';
import { otpPatient, patientLoginAPI } from '../../../Network/APIendpoints';
import { encryptData } from '../../../EncryptDecrypt/EncDecrypt';
import { useNavigate } from 'react-router-dom';
import './Patient.css'
const PatientLogin = () => {

  let nav = useNavigate()

  const [title, setTitle] = useState('Welcome Patient')
  const [placeholder, setPlaceholder] = useState('Type your username')
  const [button, setButton] = useState('Login')
  const [isVisible, setVisible] = useState(true)
  const [patUserNameV, setuserNameP] = useState('')
  const [patPasswordV, setPasswordP] = useState('');
  const [patotpV,setotpP]=useState('');

  const handleToggle = () => {
    const passwordInput = document.getElementById('password');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  };

 const goToHomePage = () => {
    nav("/")
  }

  const loginR = () => {
    nav('/patient/register')
  }

  const loginP = async (e,usernameD,passwordD) => {
    e.preventDefault();
    localStorage.clear()
    if (button === "Login") {
      const data = {
        userName: usernameD,
        password: passwordD
      };
      showLoadingAlert()
      request("POST",
      patientLoginAPI,
        data
      ).then((response) => {
        hideLoadingAlert()
        if (response.data.message === "OTP sent to registered email address") {
          setTitle('OTP')
          setVisible(false)
          setButton('Submit')
          setPlaceholder('Enter your OTP')
          alert(response.data.message)
        }
        else if (response.data.message === "Login failed, Check username/password") {
          alert(response.data.message)
        }
      })
        .catch((error) => {
          console.warn("Error", error)
        });
    }
    else if (button === "Submit") {
      const data = {
        otp: patotpV,
        userName: patUserNameV
      };
      showLoadingAlert()
      request("POST",
        otpPatient,
        data
      ).then((response) => {
        console.warn("DataOTP", response)
        hideLoadingAlert()
        if (response.data.message === "OTP Validated successfully, Login was Successful") {
          setAuthToken(response.data.token)
          console.warn("Data", response.data)
          window.localStorage.setItem("isPatientLoggedIn",true);
          alert("Login Successful");
          const dataToEncrypt = patUserNameV;
          encryptData(dataToEncrypt);
          nav('/patient/landing')

        }
        else {
          alert("OTP is wrong, Please retry!!")
        }
      })
        .catch((error) => {
          console.warn("Error", error)
        });
    }
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

  
  return (
    <div class="Patient-login-container">
      <div class="Patient-Login-hor">
        <div>
          <img src={imgside} id="patientsideimg" onClick={goToHomePage}/>
        </div>
        <div className='divisions1P'>
          <h1 className="pageTitleP">Kavach - India's Leading Tele-Radiology Platform</h1>
        </div>
    </div>
      <div class="Patient-Login-Ver">
        <div class="Patient-Login-Ver-Left">
          <img src={imgmain} id="patientmainimg" />
        </div>
        <div class="Patient-Login-Ver-Right">
          <div className="login-container">
            <h4>{title}</h4>
            <form class="login-formP">
              {isVisible && ( <div class="form-group">
                <input type="text" id="username" name="username" placeholder={placeholder} value={patUserNameV} onChange={(e) => setuserNameP(e.target.value)} required />
                <img src={userIcon} alt="Username" className="input-icon" />
              </div>)}
             
              {isVisible && ( <div class="form-group">
                <input type="password" id="password" name="password" placeholder='Type your Password' value={patPasswordV} onChange={(e) => setPasswordP(e.target.value)} required />
                <img src={passwordIcon} alt="Password" className="input-icon" />
                <i className="far fa-eye" id="faeye" onClick={handleToggle}></i>
              </div>)}
             
              {!isVisible && (<div class="form-group">
                <input type="otp" id="otp" name="otp" placeholder='Type your otp' value={patotpV} onChange={(e) => setotpP(e.target.value)} required />
              </div>)}
            </form>

            

          {isVisible && (
              <button type="submit"  id="login_patient"
              onClick={(e) =>
                loginP(
                  e,patUserNameV,patPasswordV
                 )
              }
              >
              {button}
              </button>
          )}
          {isVisible && (
              <button type="submit"  id="login_patient"
              onClick={() => loginR() }
              >
              Register
              </button>
          )}
             {!isVisible && (
              <button type="submit"  id="login_patient"
              onClick={(e) =>
                loginP(
                  e,patotpV,''
                 )
              }
              >
              {button}
              </button>
          )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;