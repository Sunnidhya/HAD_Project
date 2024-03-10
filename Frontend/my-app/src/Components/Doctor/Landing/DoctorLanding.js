import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useState } from 'react';
import logout from '../../../Resources/log-out.png';
import './DoctorLanding.css'
import { useNavigate } from 'react-router-dom';
const DoctorLanding = () => {

  let nav = useNavigate()

  const [searchQuery, setSearchQuery] = useState('');

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLogout = () => {
    localStorage.clear()
    alert('Logout successful!');
    nav("/doctor")
  };
  
  return (
    <div class="Had-login-container">
      <div class="Doctor-Login-hor">
        <div>
          <img src={imgside} id="docsideimg" />
        </div>
        <div class="Search">  
           <input className="DoctorSearch" type="text" placeholder="Search..." value={searchQuery} onChange={handleSearch}/>
        </div>
        <div class="DocLogout" onClick={handleLogout}>  
        <img src={logout} alt="Logout" className="input-icon1" />
        </div>
    </div>
    <div></div>
      <div class="Docfooter">
        <h2>About Us</h2>
      </div>
    </div>
    
  );
};

export default DoctorLanding;
