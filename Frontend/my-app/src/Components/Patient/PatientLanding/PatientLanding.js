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
import { getCasesofPatient, getListOfLabs, getListOfRadio } from "../../../Network/APIendpoints";
import { request } from "../../../Network/axiosHelper";
const PatientLanding = () => {
  let nav = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showPopup, setShowPopup] = useState(false);
  const [patient, setPatient] = useState([]);
  const [radioList, setRadioList] = useState([]);
  const [labList, setLabList] = useState([]);

  const togglePopup = () => {
    setShowPopup((prevShowPopup) => !prevShowPopup);
  };

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  useEffect(() => {
    const decryptedData = decryptData();
    const data = {
      userName: decryptedData
    };

    request("POST", getCasesofPatient, data)
      .then((response) => {
        setPatient(response.data);
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
                    <Col>
                      <Link to={`/card/${i + 1}`} className="LinkStyle">
                        <Card
                          className="PatientLandingcard"
                          style={{
                            backgroundColor: obj.markAsDone
                              ? "lightgreen"
                              : "red",
                            color: "white",
                          }}
                        >
                          <CardBody>
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
                            <br />
                            <button
                              style={{ margin: "10px" }}
                              onClick={getProfile}
                            >
                              Add Lab{" "}
                            </button>
                            <br />
                            <button style={{ margin: "10px" }}>
                              Add Radiologist
                            </button>
                          </CardBody>
                        </Card>
                      </Link>
                    </Col>
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
