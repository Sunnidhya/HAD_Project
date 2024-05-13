import React, { useState } from 'react';
import './LabForm.css';
import { registerLab } from '../../Network/APIendpoints';
import { request } from '../../Network/axiosHelper';

function LabForm() {
  const [formData, setFormData] = useState({
    userName: '',
    password: '',
    labName: '',
    email: '',
    contactNo: ''
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
    request("POST", registerLab, formData)
      .then((response) => {
        console.warn("DataValue",response.data)
        alert(response.data.message)
        toggleVisibility()
        window.location.reload();
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  };

  const toggleVisibility = () => {
    setIsVisible(prevIsVisible => !prevIsVisible);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {isVisible && (
        <>
        <div className="overlay"></div>
        <div className="form-container-lab" onClick={stopPropagation}>
          <button className="close-button-lab" onClick={toggleVisibility}>X</button>
          <div className="container-lab">
            <h2 className="form-header">Lab Registration</h2>
            <form className="lab-form" onSubmit={handleSubmit}>
              <label>
                User Name:
                <input
                  type="text"
                  name="userName"
                  placeholder="Enter username"
                  value={formData.userName}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  placeholder="Enter password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Lab Name:
                <input
                  type="text"
                  name="labName"
                  placeholder="Enter lab name"
                  value={formData.labName}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  placeholder="Enter email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Contact No:
                <input
                  type="text"
                  name="contactNo"
                  placeholder="Enter contact no."
                  value={formData.contactNo}
                  onChange={handleChange}
                />
              </label>
              <br />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
        </>
      )}
    </>
  );
}

export default LabForm;
