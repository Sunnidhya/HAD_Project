import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import React, { useEffect, useState } from 'react';
import logout from '../../../Resources/log-out.png';
import './PatientDetails.css'
import { useNavigate, useLocation } from 'react-router-dom';
import scan from '../../../Resources/scanned-image3.webp';
import prescription from '../../../Resources/prescription1.avif';
import radiologistreport from '../../../Resources/radioreport.webp';
import finaldiagnosis from '../../../Resources/finaldiagnosis.avif';
import admin from '../../../Resources/Picture1.png';
import { request } from '../../../Network/axiosHelper';
import { getCaseById, getPatCaseById } from '../../../Network/APIendpoints';
import ImageForm from '../../Form/ImageForm';
import Logout from '../../Form/Logout';
import { Visibility } from '@mui/icons-material';
import generateDoctorReportPdf from '../../Report/pdfUtils';
import generateDoctorReportPdfRadio from '../../Report/pdfUtilsReport';

const PatDetails = () => {

  let nav = useNavigate()

  const [searchQuery, setSearchQuery] = useState('');
  const [caseObj, setCaseObj] = useState(null);
  const [showPopupPresc, setShowPopupPresc] = useState(false)
  const [showPopupDicom, setShowPopupDicom] = useState(false)
  const [showPopup, setShowPopup] = useState(false);
  const [dicom, setDicomImage] = useState(null)

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const loc = useLocation();
  const {caseIdVal} = loc.state || {}
  console.warn("Data", caseIdVal);

  const handleLogout = () => {
    localStorage.clear()
    alert('Logout successful!');
    nav("/patient")
  };

  const togglePopup = () => {
    setShowPopup(prevShowPopup => !prevShowPopup);
  };

  const togglePopupPresc = () => {
    setShowPopupPresc(prevShowPopup => !prevShowPopup);
  };

  const togglePopupDicom = () => {
    setShowPopupDicom(prevShowPopup => !prevShowPopup);
  };

  const generateReport = async () => {
    if(caseObj.markAsDone){
      try {
            const data = {
              PatientName: caseObj.patientName,
              Age: caseObj.age, 
              Status: caseObj.status,
              MedicalHistory: caseObj.medicalHistory,
              Conclusion: caseObj.conclusion,
              TreatmentRecommendation: caseObj.treatmentRecommendation,
              Surgery: caseObj.surgery,
              Therapy: caseObj.therapy
            }
            const pdfBytes = await generateDoctorReportPdf(data);
            const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'doctor_report.pdf');
            document.body.appendChild(link);
            link.click();
          } catch (error) {
            console.error('Error generating PDF:', error);
          }
    }else{
      alert("The Case is still ongoing.")
    }
  };

  const generateReportRadiologistImpression = async () => {
    if(caseObj.markAsDone){
      try {
          const data = caseObj.threads.map(item => {
            return {
              RadioLogist_Name: item.radioName,
              Impression : item.radioImpression
            };
          });
            console.warn("dataTh", data)
            const pdfBytes = await generateDoctorReportPdfRadio(data);
            const pdfBlob = new Blob([pdfBytes], { type: 'application/pdf' });
      
            const url = window.URL.createObjectURL(pdfBlob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', 'doctor_report.pdf');
            document.body.appendChild(link);
            link.click();
          } catch (error) {
            console.error('Error generating PDF:', error);
          }
    }else{
      alert("The Case is still ongoing.")
    }
  };

  const loadImageFromUrl = async (url) => {
    try {
      // Fetch the image from the URL
      const response = await fetch(url);
      const blob = await response.blob(); // Convert the response to a blob
  
      // Create a file object
      const filename = url.substring(url.lastIndexOf('/') + 1); // Extract filename from the URL
      const file = new File([blob], filename);
      console.warn("data",file)
      setDicomImage(file)
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  const getProfile = () => {
    nav("/patient/profile")
  }

  useEffect(() => {
    const data = {
      caseId: caseIdVal
    };

    request("POST", getCaseById , data)
      .then((response) => {
        console.warn("data", response.data)
        setCaseObj(response.data);
        loadImageFromUrl(response.data.scannedImageURL)
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  }, []);

  return (
    <div className="Pat-details-container">
      <div className="Pat-Det-hor">
        <div>
          <img src={imgside} id="patdetimg" />
        </div>
        <div class="PatDetLogout" onClick={togglePopup}>
          <img src={logout} alt="Logout" className="pat-input-icon1" />
        </div>
      </div>
      <div className='Pat-Det-ver'>
        <div className='Pat-Det-ver1'>
          <button className="ProfilePatDetails" style={{ margin: '10px' }} onClick={getProfile}>Profile</button>
          <p>Consulting Doctor's Name: {caseObj ? caseObj.doctorName : "NA"}</p>
          <p>Consulting Radiologist's Name : {caseObj ? caseObj.radioName : "NA"}</p>
          <p>Consulting Lab's Name: {caseObj ? caseObj.labName : "NA"}</p>
        </div>
        <div className='Pat-Det-ver2-inner'>
          <div className="card">

            <div className="card-block">
              <div className="row" id="sortable">

                <div className="col-md-6 m-b-20" draggable="false">

                  <div className="card-sub" onClick={() => togglePopupDicom()}>
                    <img className="card-img-top img-fluid" src={scan} alt="Card image cap" style={{ height: "344px", maxWidth: "100%", padding: "20px" }} />
                    <div className="card-block" style={{ textAlign: "center", color: "#1588C2" }}>
                      <h5 className="card-title">Scanned Images</h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-6  m-b-20">
                  <div className="card-sub" onClick={() => togglePopupPresc()}>
                    <img className="card-img-top img-fluid" src={prescription} alt="Card image cap" style={{ height: "344px", maxWidth: "100%", padding: "20px" }} />
                    <div className="card-block" style={{ textAlign: "center", color: "#1588C2" }}>
                      <h5 className="card-title">Prescription</h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-6  m-b-20" >
                  <div className="card-sub" onClick={() => generateReport()}>
                    <img className="card-img-top img-fluid" src={finaldiagnosis} alt="Card image cap" style={{ height: "344px", maxWidth: "100%", padding: "20px" }} />
                    <div className="card-block" style={{ textAlign: "center", color: "#1588C2" }} >
                      <h5 className="card-title">Final Diagnosis</h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-6  m-b-20" style={{ textAlign: "center", justifyContent: "center" }}>
                  <div className="card-sub">
                    <div className="card-block">
                      <button style={{ margin: "150px 50px 10px 50px" }} className='PatGenerateReport' onClick={() => generateReportRadiologistImpression()}>View Radiologist Impression</button><br />
                      <button style={{ margin: "5px 50px 135px 50px", visibility:'hidden'}} className='PatMarkDone'>Mark as Done</button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="patient-details-about-us-section">
        <p>About Us</p>
      </div>
      <div>
        {showPopup && (
          <div className="popup-overlay" onClick={togglePopup}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              <Logout userType="patient"/>
            </div>
          </div>
        )}
        {showPopupPresc && (
          <div className="popup-overlay" onClick={togglePopupPresc}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              <ImageForm imageUrl={caseObj.prescriptionURL} type="presc"/>
            </div>
          </div>
        )}
        {showPopupDicom && (
          <div className="popup-overlay" onClick={togglePopupDicom}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              <ImageForm imageUrl={dicom} type="dicom"/>
            </div>
          </div>
        )}
      </div>
    </div>

  );
};

export default PatDetails;
