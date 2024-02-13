import React, { useState } from 'react';
import imgmain from '../../../Resources/patient6.avif';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import fullName from '../../../Resources/fullname3.png';
import address from '../../../Resources/address.png';
import Email from '../../../Resources/email.png';
import contact from '../../../Resources/Contact.png';
import './RegPatient.css';

const RegPatient = () => {
//   here password1 is variable and set password is function
  const [password1, setPassword] = useState(''); 
  const [confirmPassword, setConfirmPassword] = useState('');
  const [passwordMatch, setPasswordMatch] = useState(true); 

  const handleToggle = () => {
    const passwordInput = document.getElementById('password');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  };

  const handleToggleConfirm = () => {
    const passwordInput = document.getElementById('Confirmpassword');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  };

  const handleConfirmPasswordChange = (event) => {
    setConfirmPassword(event.target.value);
    if (event.target.value !== password1) {
      setPasswordMatch(false);
    } else {
      setPasswordMatch(true);
    }
  };

  return (
    <div className="Patient-login-container">
      <div className="Patient-Login-hor">
        <div>
          <img src={imgside} id="radseideimg" alt="App Logo" />
        </div>
        <div className="divisions1">
          <h1 className="pageTitle">Kavach - India's Leading Tele-Radiology Platform</h1>
        </div>
      </div>
      <div className="Patient-Login-Ver">
        <div className="Patient-Login-Ver-Left">
          <img src={imgmain} id="radiomainimg" alt="Patient" />
        </div>
        <div className="Patient-Login-Ver-Right">
          <div className="login-container">
            <h3>Register Yourself !!</h3>
            <form className="login-form">
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
            <button type="submit" id="login_patient">
              Sign Up
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegPatient;
