import React, { useState } from 'react';
import './ConsentForm.css';

function ConsentForm({ onFormSubmit }) {
  const [isChecked, setIsChecked] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    if (isChecked) {
      // Call the callback function with the flag value
      onFormSubmit(true);
    } else {
      alert('Please agree to the terms before submitting.');
      // Call the callback function with the flag value
      onFormSubmit(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <>
          <div className="overlay"></div>
          <div className="consent-form-container">
            <button className="close-button-form" onClick={handleClose}>X</button>
            <div style={{border:"1px dashed gray", padding:"15px"}}> 
            <h2 className="form-header">Consent Form</h2>
            <div className="consent-text-container">
              <p>
                I hereby give my informed consent for medical examination and treatment by the Doctor's/ Radiologist's/ Lab's in the platform. I understand that the purpose of this medical evaluation is to assess and address my health concerns. I have been provided with information about the nature, risks, benefits, and alternatives of the proposed procedures or treatments. I have had the opportunity to ask questions and have received satisfactory answers. I acknowledge that no guarantees have been made regarding the outcomes of the medical interventions, and I am aware that I have the right to seek a second opinion or refuse any part of the proposed treatment plan. I consent to the collection and use of my medical information for diagnostic and treatment purposes. I understand that I may withdraw my consent at any time, and I agree to inform the medical team of any changes in my health status. This consent is voluntary, and I have not been subjected to any coercion or pressure.
              </p>
            </div>
            <form onSubmit={handleSubmit} className="form-container">
              <label className="checkbox-label">
                <input
                  type="checkbox"
                  checked={isChecked}
                  onChange={handleCheckboxChange}
                />
                <span className="checkbox-text">
                  By signing below, I acknowledge that I am giving my consent willingly and with full understanding.
                </span>
              </label> 
              <button type="submit" className="submit-button">Submit</button>
            </form>
          </div>
          </div>
        </>
      )}
    </>
  );
}

export default ConsentForm;
