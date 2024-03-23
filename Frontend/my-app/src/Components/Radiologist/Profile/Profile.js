import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import profile from '../../../Resources/Profile.png';
import user from '../../../Resources/IconProfile.png';
import star1 from '../../../Resources/star.jpg';
import { FaStar } from 'react-icons/fa';
import React, { useState } from 'react';

import './Profile.css'
const Profile = () => {
  const [rating, setRating] = useState(0);

  const handleStarClick = (value) => {
    setRating(value);
  };
    return (
      <div class="Profile-Login-container">
        <div class="Profile-Login-hor">
          <div>
            <img src={imgside} id="radseideimg" />
          </div>
          <div className='divisions1'>
             <h1 className="pageTitle">Kavach - India's Leading Tele-Radiology Platform</h1>
          </div>
        </div>
        
      <div> 
      <div className="left-sidebar">
            <img src={user} alt="User Icon" className="user-icon" />
        </div>
        <br/>
        <button className="btn">Click</button>
        <br/>
        <br/>
        <button className="btn">Click</button>
        <br/>
        <br/>
        <button className="btn">Click</button>
        <br/>
        <br/>
          <div className="image-container">
            <img src={profile} alt="Profile" className="profile-image" />
            <div className="profile-details">
                <input type="text" placeholder="Name" />
                <br/>
                <br/>
                <input type="text" placeholder="Department ID" />
                <br/>
                <br/>
                <input type="email" placeholder="Email ID" />
                <br/>
                <br/>
                <input type="text" placeholder="Address" />
                <br/>
                <br/>
                <input type="password" placeholder="Password" />
          </div>
        </div>
        <div className="rating-container">
        {[...Array(5)].map((_, index) => (
            <FaStar
              key={index}
              className="star-icon"
              onClick={() => handleStarClick(index + 1)}
              style={{ cursor: 'pointer', color: index < rating ? 'skyblue' : 'gray' }}
            />
          ))}
        </div>
      </div>
      <div className="footer1">
        <footer>About Us</footer>
      </div>
     
      </div>
    );
}
export default Profile;