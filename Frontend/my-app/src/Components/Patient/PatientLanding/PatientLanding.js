import imgmain from "../../../Resources/login-hero.svg";
import userIcon from "../../../Resources/UserIcon.png";
import passwordIcon from "../../../Resources/PasswordIcon.png";
import imgside from "../../../Resources/AppLogo.png";
import React, { useEffect, useState } from "react";
import logout from "../../../Resources/log-out.png";
import "./PatientLanding.css";
import { decryptData } from "../../../EncryptDecrypt/EncDecrypt";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link } from "react-router-dom";
import {
  Card,
  CardImg,
  CardText,
  CardBody,
  CardTitle,
  CardSubtitle,
  Button,
  Container,
  Row,
  Col,
} from "reactstrap";
import { useNavigate } from "react-router-dom";
import Logout from "../../Form/Logout";
import {
  assignLab,
  assignNewRadioPat,
  assignRadio,
  getCasesofPatient,
  getListOfLabs,
  getListOfRadio,
} from "../../../Network/APIendpoints";
import { request } from "../../../Network/axiosHelper";
import DropdownButton from "../../Form/Dropdown_button";
import ConsentForm from "../../Form/ConsentForm";
const PatientLanding = () => {
  let nav = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [showPopupRad, setShowPopupRad] = useState(false);
  const [showPopupLab, setShowPopupLab] = useState(false);
  const [patient, setPatient] = useState([]);
  const [radioList, setRadioList] = useState([]);
  const [labList, setLabList] = useState([]);
  const [radioNew, assignNewRadio] = useState(null);
  const [tempDataConsent, setTempDataConsent] = useState({});
  const [tempFlow, setTempFlow] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [originalPatient, setOriginalPatient] = useState([]);

  const togglePopup = () => {
    setShowPopup((prevShowPopup) => !prevShowPopup);
  };

  const togglePopupRad = () => {
    setShowPopupRad((prevShowPopup) => !prevShowPopup);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
    if(event.target.value !== ''){
      setPatient(patient.filter(pat =>
        pat.caseName.toLowerCase().includes(event.target.value.toLowerCase()) ||
        pat.caseId.toString().toLowerCase().includes(event.target.value.toLowerCase()) ||
        pat.patientName.toLowerCase().includes(event.target.value.toLowerCase()) ||
        pat.doctorName.toLowerCase().includes(event.target.value.toLowerCase()) ||
        pat.labName.toLowerCase().includes(event.target.value.toLowerCase()) ||
        pat.radioName.toLowerCase().includes(event.target.value.toLowerCase()) ||
        pat.caseDescription.toLowerCase().includes(event.target.value.toLowerCase())
      ));
    }else{
      setPatient(originalPatient)
    }
  };

  const handleFormSubmit = (flag) => {
    setFormSubmitted(flag);
    if(flag){
      togglePopupRad()
      showLoadingAlert()
      if(tempFlow === "Select Radiologist Name"){
        request("POST", assignRadio, tempDataConsent)
        .then((response) => {
          alert("Radiologist Assigned")
          window.location.reload();
        })
        .catch((error) => {
          console.warn("Error", error);
        });
      }else if( tempFlow === "Select Lab Name"){
        request("POST", assignLab, tempDataConsent)
        .then((response) => {
          alert("Lab Assigned")
          window.location.reload();
        })
        .catch((error) => {
          console.warn("Error", error);
        });
      }else if( tempFlow === "Select New Radiologist"){
        request("POST", assignNewRadioPat, tempDataConsent)
      .then((response) => {
        alert("New Radiologist Assigned")
        window.location.reload();
      })
      .catch((error) => {
        console.warn("Error", error);
      });
      }
    }
  };

  const assignNewRadioByDoc = (flag, obj, obj1, flow) => {
    const data = {
      caseId: obj.caseId,
      radiologistId: obj1.radioId,
      consent: flag,
    };
    setTempDataConsent(data)
    setTempFlow(flow)
    togglePopupRad()
  };

  // Function to show loading alert
const showLoadingAlert = () => {
  // Create a loading alert element or use an existing one
  const loadingAlert = document.createElement("div");
  loadingAlert.textContent = "Loading..."; // Set text content to indicate loading
  loadingAlert.className = "loading-alert"; // Assign a class for easier identification
  loadingAlert.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Semi-transparent background
  loadingAlert.style.color = "#fff"; // Text color
  loadingAlert.style.position = "fixed"; // Fixed position
  loadingAlert.style.top = "0"; // Align to top
  loadingAlert.style.left = "0"; // Align to left
  loadingAlert.style.width = "100%"; // Full width
  loadingAlert.style.height = "100%"; // Full height
  loadingAlert.style.display = "flex"; // Flex container
  loadingAlert.style.justifyContent = "center"; // Center content horizontally
  loadingAlert.style.alignItems = "center"; // Center content vertically

  // Append the loading alert element to the document body
  document.body.appendChild(loadingAlert);
};

// Function to hide loading alert
const hideLoadingAlert = () => {
  // Find and remove the loading alert element
  const loadingAlert = document.querySelector(".loading-alert");
  if (loadingAlert) {
    loadingAlert.remove();
  }
};

  const goToDetailsPage = (objectVal) => {
    nav("/patient/details", { state: { caseIdVal: objectVal } });
  };

  const handleDropdownSelect = (selectedOption, obj, flow) => {
    if (flow === "Select Radiologist Name") {
      const data = {
        caseId: obj.caseId,
        radiologistId: selectedOption.userId,
      };
      setTempDataConsent(data)
      setTempFlow(flow)
      togglePopupRad()
    } else if (flow === "Select Lab Name") {
      const data = {
        caseId: obj.caseId,
        labId: selectedOption.userId,
      };
      setTempDataConsent(data)
      setTempFlow(flow)
      togglePopupRad()
    }
  };

  useEffect(() => {
    const decryptedData = decryptData();
    const data = {
      userName: decryptedData,
    };

    request("POST", getCasesofPatient, data)
      .then((response) => {
        setPatient(response.data);
        setOriginalPatient(response.data)
        console.warn("data", response.data[0].radioDTOList);
        if (response.data.radioDTOList !== null) {
          response.data[0].radioDTOList.map((obj, index) => {
            if (obj.radioConsent === null || obj.radioConsent === false) {
              console.warn("data", obj);
              assignNewRadio(obj);
            }
          });
        }
      })
      .catch((error) => {
        console.warn("Error", error);
      });

    request("GET", getListOfRadio, data)
      .then((response) => {
        setRadioList(response.data);
      })
      .catch((error) => {
        console.warn("Error", error);
      });

    request("GET", getListOfLabs, data)
      .then((response) => {
        setLabList(response.data);
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  }, []);

  const getProfile = () => {
    nav("/patient/profile");
  };

  return (
    <div class="Patient-landing-container">
      <div class="Patient-landing-hor">
        <div>
          <img src={imgside} id="patientlandsideimg" />
        </div>
        <div class="PatientLandingSearch">
          <input
            className="PatientSearch"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div
          class="PatientLandingLogout"
          style={{ cursor: "pointer" }}
          onClick={togglePopup}
        >
          <img src={logout} alt="Logout" className="input-patient-land-icon2" />
        </div>
      </div>

      <div className="Patient-Land-ver">
        <div className="Patient-Land-ver1">
          <button style={{ margin: "10px" }} onClick={getProfile} className='patient-landing-button'>
            Profile
          </button>
        </div>
        <div className="Patient-Land-ver2">
          <div className="Patient-card">
            <Container>
              <Row xs={1}>
                {patient.map((obj, i) => {
                  const date = new Date(obj.caseDate);
                  const year = date.getFullYear();
                  const month = (date.getMonth() + 1)
                    .toString()
                    .padStart(2, "0");
                  const day = date.getDate().toString().padStart(2, "0");
                  const hours = date.getHours().toString().padStart(2, "0");
                  const minutes = date.getMinutes().toString().padStart(2, "0");
                  const seconds = date.getSeconds().toString().padStart(2, "0");
                  const formattedDateTime = `${year}-${month}-${day}`;
                  return (
                    <>
                      <Col>
                        <Card
                          className="PatientLandingcard"
                          style={{
                            background: obj.markAsDone ? 'linear-gradient(to right, lightgreen, rgb(37,116,68))' : 'linear-gradient(to right, #E9755F, #C15556)',
                            color: 'white',
                            cursor: 'pointer',
                            boxShadow: '0px 5px 10px rgba(0, 0, 0, 0.3)',
                            border: 'rgb(241, 247, 247) solid 3px',
                          }}
                        >
                          <CardBody
                            onClick={() => goToDetailsPage(obj.caseId)}
                            style={{ fontFamily: 'Arial, sans-serif' }}
                          >
                            <Row>
                            <Col xs="4">
                              <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                                
                            <CardTitle tag="h4" style={{ marginBottom: '10px' }}>
                              Case ID - {obj.caseId}
                            </CardTitle>
                            </div>
                            </Col>
                            <Col xs="8">
                              <div style={{ textAlign: 'left',borderLeft: '2px solid lightgray',paddingLeft: '25px' }}>
                                
                            <CardSubtitle style={{ marginBottom: '5px' ,fontSize:'18px'}}>
                              Case Name - {obj.caseName}
                            </CardSubtitle>
                            <CardSubtitle style={{ marginBottom: '5px' ,fontSize:'18px'}}>
                              Lab Name - {obj.labName}
                            </CardSubtitle>
                            <CardSubtitle style={{ marginBottom: '5px' ,fontSize:'18px'}}>
                              Radiologist Name - {obj.radioName}
                            </CardSubtitle>
                            <CardSubtitle style={{ marginBottom: '5px' ,fontSize:'18px'}}>
                              Doctor Name - {obj.doctorName}
                            </CardSubtitle>
                            <CardSubtitle style={{ marginBottom: '5px' ,fontSize:'18px'}}>
                              Case Date - {formattedDateTime}
                            </CardSubtitle>
                            <CardSubtitle style={{ marginBottom: '5px' ,fontSize:'18px'}}>Case Description - {obj.caseDescription}</CardSubtitle>
                            </div>
                            </Col>
                          </Row>
                          </CardBody>
                          {obj.radioDTOList.map((obj1, index) => {
                            if (
                              obj1.radioConsent === null ||
                              obj1.radioConsent === false
                            ) {
                              return (
                                <div key={index}>
                                  <div style={{border:'2px solid white', marginLeft: '450px', marginRight: '450px', paddingTop: '10px', paddingBottom: '10px'}}>
                                  <p style={{ marginBottom: '5px' ,fontSize:'18px'}}>
                                    New radiologist assigned:{" "}
                                    {obj1.radioName}
                                  </p>
                                  <p style={{ marginBottom: '5px' ,fontSize:'18px'}}>Provide Consent?</p>
                                  <div>
                                    <button
                                      onClick={() =>
                                        assignNewRadioByDoc(true, obj, obj1, "Select New Radiologist")
                                      }
                                      style={{marginRight:'10px', borderRadius:'5px', background:'#08284D', color:'white'}}
                                    >
                                      Yes
                                    </button>
                                    <button
                                      onClick={() =>
                                        assignNewRadioByDoc(false, obj, obj1, "Select New Radiologist")
                                      }
                                      style={{marginLeft:'10px', borderRadius:'5px', background:'#08284D', color:'white'}}
                                    >
                                      No
                                    </button>
                                  </div>
                                  </div>
                                  <br />
                                </div>
                              );
                            }
                          })}
                          {(obj.radioName === "Not yet assigned" ||
                            obj.labName === "Not yet assigned") && (
                            <div className="buttonsToUse">
                              {obj.radioName === "Not yet assigned" && (
                                <DropdownButton
                                  patientValue={radioList}
                                  onSelect={(selectedValue) =>
                                    handleDropdownSelect(
                                      selectedValue,
                                      obj,
                                      "Select Radiologist Name"
                                    )
                                  }
                                  flow={"Select Radiologist Name"}
                                />
                              )}
                              <br />
                              {obj.labName === "Not yet assigned" && (
                                <DropdownButton
                                  patientValue={labList}
                                  onSelect={(selectedValue) =>
                                    handleDropdownSelect(
                                      selectedValue,
                                      obj,
                                      "Select Lab Name"
                                    )
                                  }
                                  flow={"Select Lab Name"}
                                />
                              )}
                            </div>
                          )}
                        </Card>
                      </Col>
                    </>
                  );
                })}
              </Row>
            </Container>
          </div>
        </div>
      </div>
      <div className="Patient-landing-about-us-section">
        <p>About Us</p>
      </div>
      <div>
        {showPopup && (
          <div className="popup-overlay" onClick={togglePopup}>
            <div
              className="popup-scrollable"
              onClick={(e) => e.stopPropagation()}
            >
              <Logout userType="patient" />
            </div>
          </div>
        )}
        {showPopupRad && (
          <div className="popup-overlay" onClick={togglePopupRad}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              <ConsentForm onFormSubmit={handleFormSubmit} />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PatientLanding;
