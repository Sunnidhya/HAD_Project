import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React,{useState, useEffect} from "react";
import { doctorLoginAPI } from '../../../Network/APIendpoints';
import { useNavigate } from 'react-router-dom';
import './Doctor.css'

import { request, setAuthToken } from '../../../Network/axiosHelper';

const DoctorLogin = () => {

  let nav = useNavigate()

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
    const data = {
        userName: usernameD,
        password: passwordD
    };
    request("POST",
    doctorLoginAPI, 
    data
    ).then((response) => {
        setAuthToken(response.data.token)
        console.warn("Data",response.data)
        alert("Login Successful");
        nav('/doctor/landing')
      })
      .catch((error) => {
        console.warn("Error", error)
      });
  };

  return (
    <div class="Doctor-login-container">
      <div class="Doctor-Login-hor">
        <div>
          <img src={imgside} id="radseideimg" class="clickable" onClick={goToHomePage}/>
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
            <h4>Welcome Doctor</h4>
            <form class="login-form">
              <div class="form-group">
                <input type="text" id="username" name="username" placeholder='Type your Username' required />
                <img src={userIcon} alt="Username" className="input-icon" />
              </div>

              <div class="form-group">
                <input type="password" id="password" name="password" placeholder='Type your Password' required />
                <img src={passwordIcon} alt="Password" className="input-icon" />
                <i className="far fa-eye" id="faeye" onClick={handleToggle}></i>
              </div>
            </form>
            <div className='DocForgotPasswordDoc'><b>Forgot Password?</b></div>

            <button type="submit" id="login_doc"
            onClick={(e) =>
              loginD(
                e,
                document.getElementById("username").value,
                document.getElementById("password").value
              )
            }
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
