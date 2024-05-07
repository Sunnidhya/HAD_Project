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
import ChangePassword from '../../Form/ChangePassword';

const DoctorProfile = () => {
  let nav = useNavigate()
  const userType = "Doctor";

  const [searchQuery, setSearchQuery] = useState('');
  const [docProfile, setdocProfile] = useState();
  const [showPopup, setShowPopup] = useState(false);

  const changePassword = () => {
    setShowPopup(prevShowPopup => !prevShowPopup);
  };

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

    <div className="Doctor-profile-container">
      <div className="Doctor-profile-hor">
        <div>
          <img src={imgside} id="doctorprofilesideimg" />
        </div>
     </div>

      <div className="Doctor-container">
        <div className="Doctor-picture">
          <img src={radpic} alt="Profile Picture" /><br />
          <button className="Doctor-change-button" onClick={() => changePassword()} >Change Password</button>
        </div>

        {docProfile && (
          <div className='doctormainprofile'>
            <h2>{docProfile.name}</h2><br />
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
      <div>
        {showPopup && (
          <div className="popup-overlay" onClick={changePassword}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              <ChangePassword userProp={userType} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
export default DoctorProfile;