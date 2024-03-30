import React, { useState } from 'react';
import './DoctorForm.css';

function DoctorForm() {
  const [formData, setFormData] = useState({
    name: '',
    degree: '',
    specialization: '',
    email: '',
    userName: '',
    dept: '',
    password: ''
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

  const toggleVisibility = () => {
    setIsVisible(prevIsVisible => !prevIsVisible);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {isVisible && (
        <div className="form-container-doctor" onClick={stopPropagation}>
          <button className="close-button-doctor" onClick={toggleVisibility}>X</button>
          <div className="container-doctor">
            <h2 className="form-header">Doctor Registration</h2>
            <form className="doctor-form" onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="name"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Degree:
                <input
                  type="text"
                  name="degree"
                  placeholder="Enter Degree"
                  value={formData.degree}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Specialization:
                <input
                  type="text"
                  name="specialization"
                  placeholder="Enter Specialization"
                  value={formData.specialization}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Email:
                <input
                  type="email"
                  name="email"
                  placeholder="Enter Email"
                  value={formData.email}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Username:
                <input
                  type="text"
                  name="userName"
                  placeholder="Enter Username"
                  value={formData.userName}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Department:
                <input
                  type="text"
                  name="dept"
                  placeholder="Enter Department"
                  value={formData.dept}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Password:
                <input
                  type="password"
                  name="password"
                  placeholder="Enter Password"
                  value={formData.password}
                  onChange={handleChange}
                />
              </label>
              <br />
              <button type="submit">Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default DoctorForm;

