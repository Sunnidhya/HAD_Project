import imgmain from '../../../Resources/lab6.avif';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React,{useState, useEffect} from "react";
import { labLoginAPI, otplab } from '../../../Network/APIendpoints';
import { encryptData } from '../../../EncryptDecrypt/EncDecrypt';
import { useNavigate } from 'react-router-dom';
import './Lab.css'

import { request, setAuthToken } from '../../../Network/axiosHelper';

const LabLogin = () => {
  let nav = useNavigate()
  const [title, setTitle] = useState('Welcome Lab')
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
  

  const loginD = async (e, usernameD, passwordD) => {
    e.preventDefault();
    localStorage.clear()
    if (button === "Login") {
      const data = {
        userName: usernameD,
        password: passwordD
      };
      request("POST",
      labLoginAPI,
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
        otp: patotpV,
        userName: patUserNameV
      };
      request("POST",
        otplab,
        data
      ).then((response) => {
        console.warn("DataOTP", response)
        if (response.data.message === "OTP Validated successfully, Login was Successful") {
          setAuthToken(response.data.token)
          console.warn("Data", response.data)
          window.localStorage.setItem("isLabLoggedIn",true);
          alert("Login Successful");
          const dataToEncrypt = patUserNameV;
          encryptData(dataToEncrypt);
          nav('/lab/landing')

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
    <div class="Lab-login-container">
      <div class="Lab-Login-hor">
        <div>
          <img src={imgside} id="labseideimg" class="clickable" onClick={goToHomePage}/>
        </div>
        <div className='divisions1L'>
          <h1 className="pageTitleL">Kavach - India's Leading Tele-Radiology Platform</h1>
        </div>
    </div>
      <div class="Lab-Login-Ver">
        <div class="Lab-Login-Ver-Left">
          <img src={imgmain} id="labmainimg" />
        </div>
        <div class="Lab-Login-Ver-Right">
          <div className="login-container">
            <h4>{title}</h4>
            <form class="login-formL">
              {isVisible && ( <div class="form-group">
                <input type="text" id="username" name="username" placeholder={placeholder} value={patUserNameV} onChange={(e) => setuserNameP(e.target.value)} required />
                <img src={userIcon} alt="Username" className="input-icon" />
              </div>)}
             

              {isVisible && ( <div class="form-group">
                <input type="password" id="password" name="password" placeholder='Type your Password' value={patPasswordV} onChange={(e) => setPasswordP(e.target.value)} required />
                <img src={passwordIcon} alt="Password" className="input-icon" />
                <i className="far fa-eye" id="faeye" onClick={handleToggle}></i>
              </div>)}


              {!isVisible && ( <div class="form-group">
                <input type="otp" id="otp" name="otp" placeholder='Type your otp' value={patotpV} onChange={(e) => setotpP(e.target.value)} required />
              </div>)}
             </form>
             {isVisible && (<div className='ForgotPasswordLab'><b>Forgot Password?</b></div>)}
            
            {isVisible && (<button type="submit" id="login_lab"onClick={(e) =>
              loginD(
                e,patUserNameV,patPasswordV
               )
            }>
              {button}
            </button>)}
            {!isVisible &&(<button type="submit" id="login_lab"onClick={(e) =>
              loginD(
                e,patotpV,''
               )
            }>
              {button}
            </button>)}
            
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabLogin;