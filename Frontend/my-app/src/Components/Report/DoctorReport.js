import React, { useState } from 'react';
import './DoctorReport.css';
import generateDoctorReportPdf from './pdfUtils';
import { request } from '../../Network/axiosHelper';
import { generateReport } from '../../Network/APIendpoints';

function DoctorReport({caseIdValue}) {
  const [isVisible, setIsVisible] = useState(true);
  const [formData, setFormData] = useState({
    patientName: '',
    age: '',
    status: '',
    medicalHistory: '',
    conclusion: '',
    treatmentRecommendation: '',
    surgery: '',
    therapy: '',
    caseId: caseIdValue
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   console.log(formData);

  //   try {
  //     const pdfBytes = await generateDoctorReportPdf(formData);
  //     const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });

  //     const url = window.URL.createObjectURL(pdfBlob);
  //     const link = document.createElement('a');
  //     link.href = url;
  //     link.setAttribute('download', 'doctor_report.pdf');
  //     document.body.appendChild(link);
  //     link.click();
  //   } catch (error) {
  //     console.error('Error generating PDF:', error);
  //   }
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(formData);
    request("POST",generateReport , formData)
      .then((response) => {
        alert("Report Submitted")
      }).catch((error) => {
        console.warn("Error", error);
      });
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <>
        <div className="overlay"></div>
        <div className="form-container-report">
          <button className="close-button-report" onClick={handleClose}>X</button>
          <div className="container-report">
            <h2 className="form-header">Doctor Report</h2>
            <form className="radio-form" onSubmit={handleSubmit}>
              <label>
                Name:
                <input
                  type="text"
                  name="patientName"
                  placeholder="Enter Name"
                  value={formData.name}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Age:
                <input
                  type="text"
                  name="age"
                  placeholder="Enter Age"
                  value={formData.age}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Status:
                <input
                  type="text"
                  name="status"
                  placeholder="Enter Status"
                  value={formData.status}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Medical History:
                <input
                  type="text"
                  name="medicalHistory"
                  placeholder="Enter Medical History"
                  value={formData.medicalHistory}
                  onChange={handleChange}
                  className="scrollable-input"
                />
              </label>
              <br />
              <label>
                Conclusion:
                <input
                  type="text"
                  name="conclusion"
                  placeholder="Enter Conclusion"
                  value={formData.conclusion}
                  onChange={handleChange}
                  className="scrollable-input" 
                />
              </label>
              <br />
              <label>
                Treatment Recommendations:
                <input
                  type="text"
                  name="treatmentRecommendation"
                  placeholder="Enter Treatment Recommendations"
                  value={formData.treatmentRecommendation}
                  onChange={handleChange}
                  className="scrollable-input"
                />
              </label>
              <br />
              <label>
                Surgery:
                <input
                  type="text"
                  name="surgery"
                  placeholder="Enter Surgery"
                  value={formData.surgery}
                  onChange={handleChange}
                />
              </label>
              <br />
              <label>
                Therapy:
                <input
                  type="text"
                  name="therapy"
                  placeholder="Enter Therapy"
                  value={formData.therapy}
                  onChange={handleChange}
                  className="scrollable-input"
                />
              </label>
              <br />
              <button type="submit">Submit</button>
              <br />
            </form>
          </div>
        </div>
        </>
      )}
    </>
  );
}

export default DoctorReport;

      


