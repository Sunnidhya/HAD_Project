import React, { useState, useEffect } from 'react';
import './CaseForm.css';
import './DropdownButton.css';
import { createcase, getListOfPatients } from '../../Network/APIendpoints';
import { request } from '../../Network/axiosHelper';
import DropdownButton from './Dropdown_button';

function CaseForm() {
  const [formData, setFormData] = useState({
    caseName: '',
    caseDescription: '',
    doctorName: '',
    patientName: ''
  });
  const [patients, setPatients] = useState([]);
  const [isVisible, setIsVisible] = useState(true);
  const [selectedPatient, setSelectedPatient] = useState(null);

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = () => {
    request("GET", getListOfPatients)
      .then((response) => {
        setPatients(response.data); 
        console.log(response.data);
      })
      .catch((error) => {
        console.warn("Error fetching patients", error);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleDropdownSelect = (selectedOption) => {
    setSelectedPatient(selectedOption);
    const updatedFormData = { ...formData }; // Make a copy of the formData object
    updatedFormData.patientName = selectedOption.userName; // Add patientName to the formData object
    setFormData(updatedFormData); // Update the state with the modified object
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    request("POST", createcase, formData)
      .then((response) => {
        alert(response.data.message);
        toggleVisibility()
        window.location.reload();
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  };

  const toggleVisibility = () => {
    setIsVisible((prevIsVisible) => !prevIsVisible);
  };

  const stopPropagation = (e) => {
    e.stopPropagation();
  };

  return (
    <>
      {isVisible && (
        <div className="form-container-case" onClick={stopPropagation}>
          <button className="close-button-case" onClick={toggleVisibility}>
            X
          </button>
          <div className="container-case">
            <h2 className="form-header">Case Creation</h2>
            <form className="case-form" onSubmit={handleSubmit}>
              <label>
                Case Name:
                <input
                  type="text"
                  name="caseName"
                  placeholder="Enter Case Name"
                  value={formData.caseName}
                  style={{ border: "1.3px solid" }}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Case Description:
                <input
                  type="text"
                  name="caseDescription"
                  placeholder="Enter Case Description"
                  value={formData.caseDescription}
                  style={{ border: "1.3px solid" }}
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
                  style={{ border: "1.3px solid" }}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Patient Name:
                <DropdownButton
                  patientValue = {patients}
                  onSelect={handleDropdownSelect}
                  flow = {"Select Patient Name"}
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

export default CaseForm;
