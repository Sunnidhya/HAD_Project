import imgmain from '../../../Resources/Radiologist.jpeg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React,{useState, useEffect} from "react";
import { radiologistLoginAPI } from '../../../Network/APIendpoints';
import { useNavigate } from 'react-router-dom';
import './Radio.css'

import {request,setAuthToken} from '../../../Network/axiosHelper';

const RadioLogin = () => {

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
    radiologistLoginAPI, 
    data
    ).then((response) => {
        setAuthToken(response.data.token)
        console.warn("Data",response.data)
        alert("Login Successful");
        nav('/radiologist/landing')
      })
      .catch((error) => {
        console.warn("Error", error)
      });
  };
  
  return (
    <div class="Radio-login-container">
      <div class="Radio-Login-hor">
        <div>
          <img src={imgside} id="radseideimg" class="clickable" onClick={goToHomePage}/>
        </div>
        <div className='divisions1R'>
          <h1 className="pageTitle">Kavach - India's Leading Tele-Radiology Platform</h1>
        </div>
    </div>
      <div class="Radio-Login-Ver">
        <div class="Radio-Login-Ver-Left">
          <img src={imgmain} id="radiomainimg" />
        </div>
        <div class="Radio-Login-Ver-Right">
          <div className="login-container">
            <h4>Welcome Radiologist</h4>
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
            <div className='ForgotPassword'><b>Forgot Password?</b></div>

            <button type="submit" id="login_radio" 
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

export default RadioLogin;
