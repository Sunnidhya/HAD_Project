import React, { useState } from 'react';
import './ChangePassword.css'; 

function ChangePassword() {
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
            <button type="submit">Submit</button>
          </form>
        </div>
      )}
    </>
  );
}

export default ChangePassword;

