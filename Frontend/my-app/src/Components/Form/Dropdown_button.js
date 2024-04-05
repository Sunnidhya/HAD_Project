import React, { useState } from 'react';
import Dropdown from 'react-bootstrap/Dropdown';
import './DropdownButton.css'; 

function DropdownButton() {
  const [selectedOption, setSelectedOption] = useState(null);
  const options = ['Doctor', 'Patient', 'Radiologist'];

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  return (
    <div className="center-container">
      <Dropdown>
        <Dropdown.Toggle variant="success" id="dropdown-basic" className="fixed-button">
          {selectedOption ? selectedOption : 'Dropdown Button'}
        </Dropdown.Toggle>

        <Dropdown.Menu>
          {options.map(option => (
            <Dropdown.Item key={option} className="fixed-button" onClick={() => handleOptionClick(option)}>{option}</Dropdown.Item>
          ))}
        </Dropdown.Menu>
      </Dropdown>
    </div>
  );
}

export default DropdownButton;
