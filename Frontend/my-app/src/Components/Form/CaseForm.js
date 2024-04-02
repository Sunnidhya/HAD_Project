import React, { useState } from 'react';
import './CaseForm.css';

function LabForm() {
  const [formData, setFormData] = useState({
    caseID: '',
    doctorName: '',
    patientName: ''
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
        <div className="form-container-case" onClick={stopPropagation}>
          <button className="close-button-case" onClick={toggleVisibility}>X</button>
          <div className="container-case">
            <h2 className="form-header">Case Creation</h2>
            <form className="case-form" onSubmit={handleSubmit}>
              <label>
                Case ID:
                <input
                  type="text"
                  name="caseID"
                  placeholder="Enter case ID"
                  value={formData.caseID}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Doctor Name:
                <input
                  type="text"
                  name="doctorName"
                  placeholder="Enter doctor name"
                  value={formData.doctorName}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Patient Name:
                <input
                  type="text"
                  name="patientName"
                  placeholder="Enter patient name"
                  value={formData.patientName}
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

export default LabForm;
