import React, { useState } from 'react';
import './CaseForm.css';
import './DropdownButton.css';
import { createcase } from '../../Network/APIendpoints';
import { request } from '../../Network/axiosHelper';
import DropdownButton from './Dropdown_button';

function CaseForm() {
  const [formData, setFormData] = useState({
    caseName: '',
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
    request("POST",createcase , formData)
    .then((response) => {
     alert(response.data.message)
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
        <div className="form-container-case" onClick={stopPropagation}>
          <button className="close-button-case" onClick={toggleVisibility}>X</button>
          <div className="container-case">
            <h2 className="form-header">Case Creation</h2>
            <form className="case-form" onSubmit={handleSubmit} >
              <label>
                Case Name:
                <input
                  type="text"
                  name="caseName"
                  placeholder="Enter Case Name"
                  value={formData.caseName}
                  style={{border:"1.3px solid"}}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Doctor User Name:
                <input
                  type="text"
                  name="doctorName"
                  placeholder="Enter doctor user name"
                  value={formData.doctorName}
                  style={{border:"1.3px solid"}}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Patient Name:
                <DropdownButton className="fixed-button"
                  onSelect={(selectedOption) => setFormData({...formData, patientName: selectedOption})}
                  selectedOption={formData.patientName}
                />
              </label>
              <br />
              <button type="submit" >Submit</button>
            </form>
          </div>
        </div>
      )}
    </>
  );
}

export default CaseForm;