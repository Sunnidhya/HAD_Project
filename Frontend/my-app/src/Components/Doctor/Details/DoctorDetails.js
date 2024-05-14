import imgmain from "../../../Resources/login-hero.svg";
import userIcon from "../../../Resources/UserIcon.png";
import passwordIcon from "../../../Resources/PasswordIcon.png";
import imgside from "../../../Resources/AppLogo.png";
import React, { useEffect, useState } from "react";
import logout from "../../../Resources/log-out.png";
import "./DoctorDetails.css";
import { useNavigate, useLocation } from "react-router-dom";
import empty from "../../../Resources/EmptyState.PNG";
import admin from "../../../Resources/Picture1.png";
import scan from "../../../Resources/scanned-image3.webp";
import prescription from "../../../Resources/prescription1.avif";
import radiologistreport from "../../../Resources/radioreport.webp";
import finaldiagnosis from "../../../Resources/finaldiagnosis.avif";
import { getCaseById, markAndClose } from "../../../Network/APIendpoints";
import { request } from "../../../Network/axiosHelper";
import Logout from "../../Form/Logout";
import ImageForm from "../../Form/ImageForm";
import DoctorReport from "../../Report/DoctorReport";
import generateDoctorReportPdf from "../../Report/pdfUtils";
import generateDoctorReportPdfRadio from "../../Report/pdfUtilsReport";

const DoctorDetails = () => {
  let nav = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [caseObj, setCaseObj] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupPresc, setShowPopupPresc] = useState(false);
  const [showPopupReport, setShowPopupReport] = useState(false);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const togglePopup = () => {
    setShowPopup((prevShowPopup) => !prevShowPopup);
  };

  const togglePopupPresc = () => {
    setShowPopupPresc((prevShowPopup) => !prevShowPopup);
  };

  const togglePopupReport = () => {
    setShowPopupReport((prevShowPopup) => !prevShowPopup);
  };

  const markAndCloseCase = () => {
    const data = {
      caseId: caseIdVal,
    };
    request("POST", markAndClose, data)
      .then((response) => {
        alert(response.data.message);
        window.location.reload();
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  };

  const generateReport = async () => {
    if (caseObj.markAsDone) {
      try {
        const data = {
          PatientName: caseObj.patientName,
          Age: caseObj.age,
          Status: caseObj.status,
          MedicalHistory: caseObj.medicalHistory,
          Conclusion: caseObj.conclusion,
          TreatmentRecommendation: caseObj.treatmentRecommendation,
          Surgery: caseObj.surgery,
          Therapy: caseObj.therapy,
        };
        console.warn("DataPdf", caseObj)
        const pdfBytes = await generateDoctorReportPdf(data);
        console.warn("DataPdf", pdfBytes);
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "doctor_report.pdf");
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    } else {
      alert("The Case is still ongoing.");
    }
  };

  const generateReportRadiologistImpression = async () => {
    if (caseObj.markAsDone || caseObj.threads[0].radioImpression !== null) {
      try {
        const data = caseObj.threads.map((item) => {
          return {
            RadioLogist_Name: item.radioName,
            Impression: item.radioImpression,
          };
        });
        console.warn("dataTh", data);
        const pdfBytes = await generateDoctorReportPdfRadio(data);
        const pdfBlob = new Blob([pdfBytes], { type: "application/pdf" });

        const url = window.URL.createObjectURL(pdfBlob);
        const link = document.createElement("a");
        link.href = url;
        link.setAttribute("download", "radiologist_impression.pdf");
        document.body.appendChild(link);
        link.click();
      } catch (error) {
        console.error("Error generating PDF:", error);
      }
    } else {
        alert("The Case is still ongoing.");
    }
  };

  const loc = useLocation();
  const { caseIdVal } = loc.state || {};

  const goToChatPage = () => {
    nav("/doctor/chat", { state: { caseIdValue: caseIdVal } });
  };

  const handleLogout = () => {
    localStorage.clear();
    alert("Logout successful!");
    nav("/doctor");
  };

  const getProfile = () => {
    nav("/doctor/profile");
  };

  useEffect(() => {
    const data = {
      caseId: caseIdVal,
    };

    request("POST", getCaseById, data)
      .then((response) => {
        setCaseObj(response.data);
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  }, []);

  return (
    <div className="Doc-details-container">
      <div class="Doc-Det-hor">
        <div className="logodocdet">
          <img src={imgside} id="docdetsideimg" />
        </div>
        <div className="DocDetLogout" onClick={togglePopup}>
          <img src={logout} alt="Logout" className="doc-input-icon1" />
        </div>
      </div>
      <div className="Doc-Det-ver">
        <div className="Doc-Det-ver1">
          <button
            className="ProfileDocDetails"
            style={{ margin: "10px" }}
            onClick={getProfile}
          >
            Profile
          </button>
          <p>Patients's Name: {caseObj ? caseObj.patientName : "NA"}</p>
          <p>
            Consulting Radiologist's Name : {caseObj ? caseObj.radioName : "NA"}
          </p>
          <p>Consulting Lab's Name: {caseObj ? caseObj.labName : "NA"}</p>
        </div>
        <div className="Doc-Det-ver2-inner">
          <div className="card">
            <div className="card-block">
              <div className="row" id="sortable">
                <div className="col-md-6 m-b-20" draggable="false">
                  <div className="card-sub" onClick={() => goToChatPage()}>
                    <img
                      className="card-img-top img-fluid"
                      src={scan}
                      alt="Card image cap"
                      style={{
                        height: "344px",
                        maxWidth: "100%",
                        padding: "20px",
                      }}
                    />
                    <div
                      className="card-block"
                      style={{ textAlign: "center", color: "#076E65" }}
                    >
                      <h5 className="card-title">Scanned Images</h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-6  m-b-20">
                  <div className="card-sub" onClick={() => togglePopupPresc()}>
                    <img
                      className="card-img-top img-fluid"
                      src={prescription}
                      alt="Card image cap"
                      style={{
                        height: "344px",
                        maxWidth: "100%",
                        padding: "20px",
                      }}
                    />
                    <div
                      className="card-block"
                      style={{ textAlign: "center", color: "#076E65" }}
                    >
                      <h5 className="card-title">Prescription</h5>
                    </div>
                  </div>
                </div>
                <div className="col-md-6  m-b-20">
                  <div className="card-sub" onClick={() => generateReport()}>
                    <img
                      className="card-img-top img-fluid"
                      src={finaldiagnosis}
                      alt="Card image cap"
                      style={{
                        height: "344px",
                        maxWidth: "100%",
                        padding: "20px",
                      }}
                    />
                    <div
                      className="card-block"
                      style={{ textAlign: "center", color: "#076E65" }}
                    >
                      <h5 className="card-title">Final Diagnosis</h5>
                    </div>
                  </div>
                </div>
                <div
                  className="col-md-6  m-b-20"
                  style={{ textAlign: "center", justifyContent: "center" }}
                >
                  <div className="card-sub">
                    {caseObj !== null && !caseObj.markAsDone && (
                      <div className="card-block">
                        <button
                          style={{ margin: "100px 50px 5px 50px" }}
                          className="GenerateReport"
                          onClick={() => togglePopupReport()}
                        >
                          Generate Report
                        </button>
                        <br />
                        <button
                          style={{ margin: "5px 50px 5px 50px" }}
                          className="GenerateReport"
                          onClick={() => generateReportRadiologistImpression()}
                        >
                          View Radiologist Impression
                        </button>
                        <br />
                        <button
                          style={{ margin: "5px 50px 145px 50px" }}
                          className="MarkDone"
                          onClick={() => markAndCloseCase()}
                        >
                          Mark as Done
                        </button>
                      </div>
                    )}
                    {caseObj !== null && caseObj.markAsDone && (
                      <div className="card-block">
                        <button
                          style={{ margin: "150px 50px 10px 50px" }}
                          className="GenerateReport"
                          onClick={() => generateReportRadiologistImpression()}
                        >
                          View Radiologist Impression
                        </button>
                        <br />
                        <button
                          style={{
                            margin: "5px 50px 135px 50px",
                            visibility: "hidden",
                          }}
                          className="MarkDone"
                          onClick={() => markAndCloseCase()}
                        >
                          Mark as Done
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="doctor-details-about-us-section">
        <p>About Us</p>
      </div>
      <div>
        {showPopup && (
          <div className="popup-overlay" onClick={togglePopup}>
            <div
              className="popup-scrollable"
              onClick={(e) => e.stopPropagation()}
            >
              <Logout userType="doctor" />
            </div>
          </div>
        )}
        {showPopupPresc && (
          <div className="popup-overlay" onClick={togglePopupPresc}>
            <div
              className="popup-scrollable"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageForm imageUrl={caseObj.prescriptionURL} type="presc" />
            </div>
          </div>
        )}
        {showPopupReport && (
          <div className="popup-overlay" onClick={togglePopupReport}>
            <div
              className="popup-scrollable"
              onClick={(e) => e.stopPropagation()}
            >
              <DoctorReport caseIdValue={caseObj.caseId} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorDetails;
