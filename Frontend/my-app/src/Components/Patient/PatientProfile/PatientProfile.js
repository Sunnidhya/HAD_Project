import './PatientProfile.css'
import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useEffect, useState } from 'react';
import logout from '../../../Resources/log-out.png';
import { useNavigate } from 'react-router-dom';
import radpic from '../../../Resources/radio1.avif';
import { decryptData } from '../../../EncryptDecrypt/EncDecrypt';
import { request } from '../../../Network/axiosHelper';
import { patientProfie } from '../../../Network/APIendpoints';
import ChangePassword from '../../Form/ChangePassword';



const PatientProfile = () => {
  let nav = useNavigate()
  const userType = "Patient";
  const [patProfile, setPatientProfile] = useState()
  const [showPopup, setShowPopup] = useState(false);

  const changePassword = () => {
    setShowPopup(prevShowPopup => !prevShowPopup);
  };

  useEffect(() => {
    const decryptedData = decryptData();
    const data = {
        userName: decryptedData
    };
  request("POST", patientProfie, data)
    .then((response) => {
      setPatientProfile(response.data);
      // console.warn("Data",response)
    })
    .catch((error) => {
      console.warn("Error", error);
    });
}, []);

  const [searchQuery, setSearchQuery] = useState('');
  return (
      
      <div class="Patient-login-container">
      <div class="Patient-Login-hor">
        <div>
          <img src={imgside} id="profilesideimg"/>
        </div>
        <div className='divisions1'>
          <h2 className="pageTitle">Kavach - India's Leading Tele-Radiology Platform</h2>
        </div>
        </div>

        <div class="Patient-container">
        <div class="Patient-picture">
            <img src={radpic} alt="Profile Picture"/><br/>
            <button class="Patient-edit-button" onclick="editProfile()">Update Profile</button><br/>
            <button class="Patient-change-button" onClick={() => changePassword()}>Change Password</button>
        </div>
        
        {patProfile && (
        <div>
            <h2>{patProfile.userName}</h2><br/>
            <p><b>Fullname: {patProfile.fullName}</b></p>
            <p><b>Contact No: {patProfile.contactNo}</b></p>
            <p><b>UserName: {patProfile.userName}</b></p>
            <p><b>Address: {patProfile.address}</b></p>
            <p><b>Email: {patProfile.email}</b></p>
        </div>
    )}
       </div>
        {/* About Us Section */}
      <div className="Patient-about-us-section">
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
export default PatientProfile;