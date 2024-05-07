import './LabProfile.css'
import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useEffect, useState } from 'react';
import {laboratoryProfile} from '../../../Network/APIendpoints';
import logout from '../../../Resources/log-out.png';
import { useNavigate } from 'react-router-dom';
import radpic from '../../../Resources/radio1.avif';
import { decryptData } from '../../../EncryptDecrypt/EncDecrypt';
import { request } from '../../../Network/axiosHelper';
import ChangePassword from '../../Form/ChangePassword';



const LabProfile = () => {
  let nav = useNavigate()
  const userType = "Laboratory";
  const [searchQuery, setSearchQuery] = useState('');
  const [labProfile, setlabProfile] = useState()
  const [showPopup, setShowPopup] = useState(false);

  const changePassword = () => {
    setShowPopup(prevShowPopup => !prevShowPopup);
  };

  useEffect(() => {
    const decryptedData = decryptData();
    const data = {
        userName: decryptedData
    };
  request("POST", laboratoryProfile, data)
    .then((response) => {
      setlabProfile(response.data);
      // console.warn("Data",response)
    })
    .catch((error) => {
      console.warn("Error", error);
    });
}, []);
  return (
      
      <div class="Lab-login-container">
      <div class="Lab-Login-hor">
        <div>
          <img src={imgside} id="labprofilesideimg"/>
        </div>
        
        </div>

        <div class="Lab-container">
        <div class="Lab-picture">
            <img src={radpic} alt="Profile Picture"/><br/>
            <button class="Lab-change-button" onClick={() => changePassword()}>Change Password</button>
        </div>
        
        {labProfile && (
        <div className='labmainprofile'>
            <h2>{labProfile.labName}</h2><br/>
            <p><b>ID: {labProfile.userId}</b></p>
            <p><b>Name: {labProfile.labName}</b></p>
            <p><b>UserName: {labProfile.userName}</b></p>
            <p><b>Email: {labProfile.email}</b></p>
            <p><b>Contact Number: {labProfile.contactNo}</b></p>
        </div>
    )}
       </div>
        {/* About Us Section */}
      <div className="Lab-about-us-section">
        <p>About Us</p>
      </div>

      <div>
        {showPopup && (
          <div className="popup-overlay" onClick={changePassword}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
            <ChangePassword  userProp={userType}/>
          </div>
          </div>
        )}
      </div>
    </div>
    );
}
export default LabProfile;