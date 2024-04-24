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
const PatientLanding = () => {
  let nav = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [patient, setPatient] = useState([]);
  const [radioList, setRadioList] = useState([]);
  const [labList, setLabList] = useState([]);
  const [radioNew, assignNewRadio] = useState(null);

  const togglePopup = () => {
    setShowPopup((prevShowPopup) => !prevShowPopup);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const assignNewRadioByDoc = (flag, obj, obj1) => {
    const data = {
      caseId: obj.caseId,
      radiologistId: obj1.radioId,
      consent: flag,
    };
    request("POST", assignNewRadioPat, data)
      .then((response) => {
        window.location.reload();
      })
      .catch((error) => {
        console.warn("Error", error);
      });
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
      request("POST", assignRadio, data)
        .then((response) => {
          window.location.reload();
        })
        .catch((error) => {
          console.warn("Error", error);
        });
    } else if (flow === "Select Lab Name") {
      const data = {
        caseId: obj.caseId,
        labId: selectedOption.userId,
      };
      request("POST", assignLab, data)
        .then((response) => {
          window.location.reload();
        })
        .catch((error) => {
          console.warn("Error", error);
        });
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
          <img src={imgside} id="docsideimg" />
        </div>
        <div class="Search">
          <input
            className="PatientSearch"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div
          class="PatientLogout"
          style={{ cursor: "pointer" }}
          onClick={togglePopup}
        >
          <img src={logout} alt="Logout" className="input-icon1" />
        </div>
      </div>

      <div className="Patient-Land-ver">
        <div className="Patient-Land-ver1">
          <button style={{ margin: "10px" }} onClick={getProfile}>
            Profile
          </button>
        </div>
        <div className="Patient-Land-ver2">
          <div className="Patient-card">
            <Container>
              <Row xs={2}>
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
                            backgroundColor: obj.markAsDone
                              ? "#5ce495"
                              : "#b45f5f",
                            color: "white",
                          }}
                        >
                          <CardBody
                            onClick={() => goToDetailsPage(obj.caseId)}
                            style={{ cursor: "pointer" }}
                          >
                            <CardTitle tag="h5">
                              Case ID - {obj.caseId}
                            </CardTitle>
                            <CardSubtitle tag="h6">
                              Case Name - {obj.caseName}
                            </CardSubtitle>
                            <CardSubtitle tag="h6">
                              Lab Name - {obj.labName}
                            </CardSubtitle>
                            <CardSubtitle tag="h6">
                              Radiologist Name - {obj.radioName}
                            </CardSubtitle>
                            <CardSubtitle tag="h6">
                              Doctor Name - {obj.doctorName}
                            </CardSubtitle>
                            <CardSubtitle tag="h6">
                              Case Date - {formattedDateTime}
                            </CardSubtitle>
                            <CardText>Case Description</CardText>
                          </CardBody>
                          {obj.radioDTOList.map((obj1, index) => {
                            if (
                              obj1.radioConsent === null ||
                              obj1.radioConsent === false
                            ) {
                              return (
                                <div key={index}>
                                  <p>
                                    New radiologist assigned:{" "}
                                    {obj1.radioName}
                                  </p>
                                  <p>Provide Consent?</p>
                                  <div>
                                    <button
                                      onClick={() =>
                                        assignNewRadioByDoc(true, obj, obj1)
                                      }
                                    >
                                      Yes
                                    </button>
                                    <button
                                      onClick={() =>
                                        assignNewRadioByDoc(false, obj, obj1)
                                      }
                                    >
                                      No
                                    </button>
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
      </div>
    </div>
  );
};

export default PatientLanding;
