import './DoctorProfile.css'
import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useEffect, useState } from 'react';
import { doctorProfile } from '../../../Network/APIendpoints';
import logout from '../../../Resources/log-out.png';
import { useNavigate } from 'react-router-dom';
import radpic from '../../../Resources/radio1.avif';
import { decryptData } from '../../../EncryptDecrypt/EncDecrypt';
import { request } from '../../../Network/axiosHelper';

const DoctorProfile = () => {
  let nav = useNavigate()

  const [searchQuery, setSearchQuery] = useState('');
  const [docProfile, setdocProfile] = useState()

  useEffect(() => {
    const decryptedData = decryptData();
    const data = {
        userName: decryptedData
    };
  request("POST", doctorProfile, data)
    .then((response) => {
      setdocProfile(response.data);
      // console.warn("Data",response)
    })
    .catch((error) => {
      console.warn("Error", error);
    });
}, []);
  return (
      
      <div class="Doctor-login-container">
      <div class="Doctor-Login-hor">
        <div>
          <img src={imgside} id="profilesideimg"/>
        </div>
        <div className='divisions1'>
          <h2 className="pageTitle">Kavach - India's Leading Tele-Radiology Platform</h2>
        </div>
        </div>

        <div class="Doctor-container">
        <div class="Doctor-picture">
            <img src={radpic} alt="Profile Picture"/><br/>
            <button class="Doctor-edit-button" onclick="editProfile()">Update Profile</button><br/>
            <button class="Doctor-change-button" onclick="changePassword()">Change Password</button>
        </div>
        
        {docProfile && (
        <div>
            <h2>{docProfile.name}</h2><br/>
            <p><b>Degree: {docProfile.degree}</b></p>
            <p><b>Specialization: {docProfile.specialization}</b></p>
            <p><b>UserName: {docProfile.userName}</b></p>
            <p><b>Department: {docProfile.department}</b></p>
            <p><b>Email: {docProfile.email}</b></p>
        </div>
    )}
       </div>
        {/* About Us Section */}
      <div className="Doctor-about-us-section">
        <p>About Us</p>
      </div>
    </div>
    );
}
export default DoctorProfile;