import imgmain from '../../../Resources/Radiologist.jpeg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React,{useState, useEffect} from "react";
import { otpRadiologist, radiologistLoginAPI } from '../../../Network/APIendpoints';
import { useNavigate } from 'react-router-dom';
import { encryptData } from '../../../EncryptDecrypt/EncDecrypt';
import './Radio.css'

import {request,setAuthToken} from '../../../Network/axiosHelper';

const RadioLogin = () => {

  let nav = useNavigate()

  const [title, setTitle] = useState('Welcome Radiologist')
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
  const loginD = async (e,usernameD,passwordD) => {
    e.preventDefault();
    localStorage.clear()
    if (button === "Login") {
      const data = {
        userName: usernameD,
        password: passwordD
      };
      showLoadingAlert()
      request("POST",
      radiologistLoginAPI,
        data
      ).then((response) => {
        if (response.data.message === "OTP sent to registered email address") {
          alert(response.data.message)
          setTitle('OTP')
          setVisible(false)
          setButton('Submit')
          setPlaceholder('Enter your OTP')
          hideLoadingAlert()
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
        otpRadiologist,
        data
      ).then((response) => {
        console.warn("DataOTP", response)
        if (response.data.message === "OTP Validated successfully, Login was Successful") {
          hideLoadingAlert()
          setAuthToken(response.data.token)
          window.localStorage.setItem("isRadioLoggedIn",true);
          alert("Login Successful");
          const dataToEncrypt = patUserNameV;
          encryptData(dataToEncrypt);
          nav('/radiologist/landing')
        
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
    <div class="Radio-login-container">
      <div class="Radio-Login-hor">
        <div>
          <img src={imgside} id="radseideimg" class="clickable" onClick={goToHomePage}/>
        </div>
        <div className='divisions1R'>
          <h1 className="pageTitleR">Kavach - India's Leading Tele-Radiology Platform</h1>
        </div>
    </div>
      <div class="Radio-Login-Ver">
        <div class="Radio-Login-Ver-Left">
          <img src={imgmain} id="radiologimg" />
        </div>
        <div class="Radio-Login-Ver-Right">
          <div className="login-container">
            <h4>{title}</h4>
            <form class="login-formR">
              {isVisible && (<div class="form-group">
                <img src={userIcon} alt="Username" className="input-iconR" />
                <input type="text" id="username" name="username" placeholder={placeholder} value={patUserNameV} onChange={(e) => setuserNameP(e.target.value)} required />
              </div>)}
              
              {isVisible && ( <div class="form-group">
                <img src={passwordIcon} alt="Password" className="input-iconR" />
                <input type="password" id="password" name="password" placeholder='Type your Password' value={patPasswordV} onChange={(e) => setPasswordP(e.target.value)} required />
                <i className="far fa-eye" id="faeye" onClick={handleToggle}></i>
              </div>)}
               
              {!isVisible && (<div class="form-group">
                <input type="otp" id="otp" name="otp" placeholder='Type your otp' value={patotpV} onChange={(e) => setotpP(e.target.value)} required />
              </div>)}
            </form>

            {isVisible && (<div className='ForgotPassword'><b>Forgot Password?</b></div>)}
            
             {isVisible && (<button type="submit" id="login_radio" 
            onClick={(e) =>
              loginD(
                e,patUserNameV,patPasswordV
              )
            }
            >
             {button}
            </button>)}

            {!isVisible && (<button type="submit" id="login_radio" 
            onClick={(e) =>
              loginD(
                e,patotpV,''
              )
            }
            >
             {button}
            </button>)}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioLogin;
