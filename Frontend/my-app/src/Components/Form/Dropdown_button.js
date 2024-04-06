import React, { useState,useEffect} from 'react';
import { request } from '../../Network/axiosHelper';
import Dropdown from 'react-bootstrap/Dropdown';
import { createcase, getListOfPatients } from '../../Network/APIendpoints';
import './DropdownButton.css'; 

function DropdownButton() {
  const [formData, setFormData] = useState({
    caseName: '',
    doctorName: '',
    patientName: ''
  });
  const [selectedOption, setSelectedOption] = useState(null);
  const [patients, setPatients] = useState([]);

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

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
  return (
    <div className="center-container">
      <Dropdown style={{ width: '100%' }}>
        <Dropdown.Toggle variant="success" id="dropdown-basic" className="fixed-button">
          {selectedOption ? selectedOption : 'Select Patient Name'}
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ width: '100%' }}>
        {patients.map((patient) => (
            <Dropdown.Item key={patient.id} onClick={() => handleOptionClick(patient.userName)}>
              {patient.userName}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default DropdownButton;
