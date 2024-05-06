import React, { useState,useEffect} from 'react';
import { request } from '../../Network/axiosHelper';
import Dropdown from 'react-bootstrap/Dropdown';
import { createcase, getListOfPatients } from '../../Network/APIendpoints';
import './DropdownButton.css'; 

function DropdownButton({patientValue,onSelect,flow}) {
  const [formData, setFormData] = useState({
    caseName: '',
    doctorName: '',
    patientName: ''
  });

  const [selectedOption, setSelectedOption] = useState(null);

  const handleOptionClick = (option,patient) => {
    //console.warn("Data",option)
    setSelectedOption(option);
    if(flow === "Select Radiologist"){
      onSelect(patientValue.find(patient => patient.radioName === option));
    }else{
      onSelect(patientValue.find(patient => patient.userName === option));
    }
  };


  return (
    <div className="center-container">
      <Dropdown style={{ width: '100%' }}>
        <Dropdown.Toggle variant="success" id="dropdown-basic" className="fixed-button">
        {flow === "Select Patient Name" && selectedOption ? selectedOption : 
      flow === "Select Radiologist Name" && selectedOption ? selectedOption :
      flow === "Select Lab Name" && selectedOption ? selectedOption : flow}
          
        </Dropdown.Toggle>

        <Dropdown.Menu style={{ width: '100%' }}>
        {flow === "Select Radiologist" ? patientValue.map((patient,index) => (
            <Dropdown.Item key={patient.radioId} onClick={() => handleOptionClick(patient.radioName,patient)}>
              {patient.radioName}
            </Dropdown.Item>
          )) : patientValue.map((patient,index) => (
            <Dropdown.Item key={patient.id} onClick={() => handleOptionClick(patient.userName,patient)}>
              {patient.userName}
            </Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default DropdownButton;
