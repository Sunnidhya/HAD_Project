import './RadiologistProfile.css'
import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import { decryptData } from '../../../EncryptDecrypt/EncDecrypt';
import React, { useEffect, useState } from 'react';
import logout from '../../../Resources/log-out.png';
import { useNavigate } from 'react-router-dom';
import radpic from '../../../Resources/radio1.avif';
import { radioProfile } from '../../../Network/APIendpoints';
import { request } from '../../../Network/axiosHelper';
import ChangePassword from '../../Form/ChangePassword';



const RadiologistProfile = () => {
  let nav = useNavigate()
  const userType = "Radiologist";
  const [showradPopup, setShowRadPopup] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [radiologistProfile, setRadiologistProfile] = useState()

  const changePassword = () => {
    setShowPopup(prevShowPopup => !prevShowPopup);
  };

 

    useEffect(() => {
      const decryptedData = decryptData();
      const data = {
          userName: decryptedData
      };
    request("POST", radioProfile, data)
      .then((response) => {
        setRadiologistProfile(response.data);
        // console.warn("Data",response)
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  }, []);

  return (
      
      <div class="Radio-container">
      <div class="Radio-Profile-hor">
        <div>
          <img src={imgside} id="radioprofilesideimg"/>
        </div>
        
        </div>

        <div class="Radio-profile-container">
        <div class="Radio-profile-picture">
            <img src={radpic} alt="Profile Picture"/><br/>
            <button class="Radio-change-button" onClick={() => changePassword()}>Change Password</button>
        </div>
        
       
        {radiologistProfile && (
        <div className='radiomainprofile'>
            <h2>{radiologistProfile.name}</h2><br/>
            <p><b>Degree: {radiologistProfile.degree}</b></p>
            <p><b>Specialization: {radiologistProfile.specialization}</b></p>
            <p><b>UserName: {radiologistProfile.userName}</b></p>
            <p><b>Department: {radiologistProfile.department}</b></p>
            <p><b>Email: {radiologistProfile.email}</b></p>
        </div>
    )}
        
    
       </div>
       
      <div className="Radio-profile-about-us-section">
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
export default RadiologistProfile;