import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useState, useEffect } from "react";
import { doctorLoginAPI, otpdoctor } from '../../../Network/APIendpoints';
import { encryptData } from '../../../EncryptDecrypt/EncDecrypt';
import { useNavigate } from 'react-router-dom';
import './Doctor.css'

import { request, setAuthToken } from '../../../Network/axiosHelper';

const DoctorLogin = () => {

  let nav = useNavigate()
  const [title, setTitle] = useState('Welcome Doctor')
  const [placeholder, setPlaceholder] = useState('Type your username')
  const [button, setButton] = useState('Login')
  const [isVisible, setVisible] = useState(true)
  const [userNameV, setuserName] = useState('')
  const [passwordV, setPassword] = useState('');
  const [otpV,setotp] = useState('');

  const handleToggle = () => {
    const passwordInput = document.getElementById('password');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  };

  const goToHomePage = () => {
    nav("/")
  }

  const loginD = async (e, usernameD, passwordD) => {
    e.preventDefault();
    localStorage.clear()
    if (button === "Login") {
      const data = {
        userName: usernameD,
        password: passwordD
      };
      request("POST",
        doctorLoginAPI,
        data
      ).then((response) => {
        if (response.data.message === "OTP sent to registered email address") {
          alert(response.data.message)
          setTitle('OTP')
          setVisible(false)
          setButton('Submit')
          setPlaceholder('Enter your OTP')
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
        otp: usernameD,
        userName: userNameV
      };
      
      request("POST",
        otpdoctor,
        data
      ).then((response) => {
        if (response.data.message === "OTP Validated successfully") {
          setAuthToken(response.data.token)
          console.warn("Data", response.data)
          alert("Login Successful");
          const dataToEncrypt = userNameV;
          encryptData(dataToEncrypt);
          nav('/doctor/landing')

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

  return (
    <div class="Doctor-login-container">
      <div class="Doctor-Login-hor">
        <div>
          <img src={imgside} id="radseideimg" class="clickable" onClick={goToHomePage} />
        </div>
        <div className='divisions1'>
          <h1 className="pageTitle">Kavach - India's Leading Tele-Radiology Platform</h1>
        </div>
      </div>
      <div class="Doctor-Login-Ver">
        <div class="Doctor-Login-Ver-Left">
          <img src={imgmain} id="doctormainimg" />
        </div>
        <div class="Doctor-Login-Ver-Right">
          <div className="login-container">
            <h4>{title}</h4>
            <form class="login-form">
            {isVisible &&(<div className="form-group">
                <input type="text" id="username" name="username" placeholder={placeholder} value={userNameV} onChange={(e) => setuserName(e.target.value)} required />
                <img src={userIcon} alt="Username" className="input-icon" />
              </div>)}
            {isVisible && (
                <div class="form-group">
                  <input type="password" id="password" name="password" placeholder='Type your Password' value={passwordV} onChange={(e) => setPassword(e.target.value)} required />
                  <img src={passwordIcon} alt="Password" className="input-icon" />
                  <i className="far fa-eye" id="faeye" onClick={handleToggle}></i>
                </div>
              )}
            {!isVisible && (
                <div class="form-group">
                  <input type="otp" id="otp" name="otp" placeholder='Type your otp' value={otpV} onChange={(e) => setotp(e.target.value)} required />
                </div>
              )}
            </form>
            {isVisible && (<div className='DocForgotPasswordDoc'><b>Forgot Password?</b></div>)}
            {isVisible && (<button type="submit" id="login_doc"
              onClick={(e) =>
                loginD(
                  e,userNameV,passwordV
                 
                )
              }
            >
              {button}
            </button>)}
            {!isVisible && (<button type="submit" id="login_doc"
              onClick={(e) =>
                loginD(
                  e,otpV,''
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

export default DoctorLogin;
