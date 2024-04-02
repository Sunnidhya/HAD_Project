import React, { useState } from 'react';
import './ChangePassword.css'; 
import { decryptData } from '../../EncryptDecrypt/EncDecrypt';
import { radioChangePassword } from '../../Network/APIendpoints';
import { request } from '../../Network/axiosHelper';
import { useNavigate } from 'react-router-dom';

const ChangePassword = () => {
  let nav = useNavigate()
  const [formData, setFormData] = useState({
    currentPassword: '',
    newPassword: ''
  });
  const [isVisible, setIsVisible] = useState(true);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData);
  };

  const handleClose = () => {
    setIsVisible(false);
  };


  const Submit = () =>{
    const decryptedData = decryptData();
    const data = {
        userName: decryptedData,
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword
    };
    
    request("POST", radioChangePassword, data)
      .then((response) => {
        if(response.data.message === "Current Password or User Name entered wrongly ")
        {
          alert("Current Password entered wrongly ")
        }
        else if(response.data.message === "Same Password entered")
        {
          alert("Same Password entered")
        }
        else if (response.data.message === "Password updated successfully") {
         nav("/radiologist")
        }
       })
      .catch((error) => {
        console.warn("Error", error);
      });
  }

  return (
    <>
      {isVisible && (
        <div className="form-container-password">
          <button className="close-button-password" onClick={handleClose}>X</button>
          <h2 className="form-header">Change Password</h2>
          <form className="change-password-form" onSubmit={handleSubmit}>
            <label>
              Enter Password:
              <input
                type="password"
                name="currentPassword"
                placeholder="Enter Current Password"
                value={formData.currentPassword}
                onChange={handleChange}
              />
            </label>
            <br />
            <label>
              Change Password:
              <input
                type="password"
                name="newPassword"
                placeholder="Enter New Password"
                value={formData.newPassword}
                onChange={handleChange}
              />
            </label>
            <br />
            <br/>
            <button type="submit" onClick={Submit}>Submit</button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChangePassword;

