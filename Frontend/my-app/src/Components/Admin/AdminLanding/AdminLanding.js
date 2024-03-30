import imgmain from "../../../Resources/login-hero.svg";
import userIcon from "../../../Resources/UserIcon.png";
import passwordIcon from "../../../Resources/PasswordIcon.png";
import imgside from "../../../Resources/AppLogo.png";
import React, { useEffect, useState } from "react";
import logout from "../../../Resources/log-out.png";
import "./AdminLanding.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Link, useLocation } from "react-router-dom";
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
import {
  getListOfDocs,
  getListOfLabs,
  getListOfPatients,
  getListOfRadio,
} from "../../../Network/APIendpoints";
import { request } from "../../../Network/axiosHelper";
import DoctorForm from "../../Form/DoctorForm";
import LabForm from "../../Form/LabForm";
import RadioForm from "../../Form/RadioForm";
const AdminLanding = () => {
  let nav = useNavigate();
  const location = useLocation();
  const [buttonV, setButtonV] = useState("");

  const receivedData = location.state?.data;

  const [searchQuery, setSearchQuery] = useState("");
  const [numberOfItems, setNumberOfItems] = useState(0);
  const [patient, setPatient] = useState([]);
  const [lab, setLab] = useState([]);
  const [radio, setRadio] = useState([]);
  const [doctor, setDoctor] = useState([]);
  const [isP, setP] = useState(false);
  const [isL, setL] = useState(false);
  const [isR, setR] = useState(false);

  const handleSearch = (event) => {
    setSearchQuery(event.target.value);
  };

  const handleLogout = () => {
    localStorage.clear();
    alert("Logout successful!");
    nav("/radiologist");
  };
  const isDone = false;

  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(prevShowPopup => !prevShowPopup);
  };

  useEffect(() => {
    let temp;
    if (receivedData === "Patient") {
      setButtonV("Add Patient");
      temp = getListOfPatients;
    }
    if (receivedData === "Lab") {
      setButtonV("Add Lab");
      temp = getListOfLabs;
    }
    if (receivedData === "Radiologist") {
      setButtonV("Add Radiologist");
      temp = getListOfRadio;
    }
    if (receivedData === "Doctor") {
      setButtonV("Add Doctor");
      temp = getListOfDocs;
    }

    request("GET", temp, {})
      .then((response) => {
        console.warn("DataValue",response.data)
        if (receivedData === "Patient") {
          setPatient(response.data);
        }
        if (receivedData === "Lab") {
          setLab(response.data);
        }
        if (receivedData === "Radiologist") {
          setRadio(response.data);
        }
        if (receivedData === "Doctor") {
          setDoctor(response.data);
        }
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  }, []);

  return (
    <div class="Admin-landing-container">
      <div class="Admin-landing-hor">
        <div>
          <img src={imgside} id="docsideimg" />
        </div>
        <div class="Search">
          <input
            className="AdminSearch"
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={handleSearch}
          />
        </div>
        <div class="AdminLandingLogout" onClick={handleLogout}>
          <img src={logout} alt="Logout" className="input-icon2" />
        </div>
      </div>
      <div className="Admin-Land-ver">
        <div className="Admin-Land-ver1">
          <button style={{ margin: "10px" }} onClick={togglePopup}>{buttonV}</button>
          <button style={{ margin: "10px" }}>Profile</button>
        </div>
        <div className="Admin-Land-ver2">
          <div className="Admin-card">
            <Container>
              <Row xs={3}>
                {(receivedData === "Doctor") &&
                  doctor.map((obj, i) => {
                    return (
                      <Col>
                        <Card
                          className="AdminLandingcard"
                          style={{
                            backgroundColor: "rgb(7, 110, 101)",
                          }}
                        >
                          <CardBody>
                            <CardTitle tag="h5">Doctor ID: {obj.doctorId}</CardTitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">
                              Name: {obj.name}
                            </CardSubtitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">
                              Degree: {obj.degree}
                            </CardSubtitle>
                            <CardText>UserName: {obj.userName}</CardText>
                            <Button
                              style={{
                                borderRadius: "5px",
                                backgroundColor: "rgb(233, 111, 111)",
                                height: "auto",
                              }}
                            >
                              Remove
                            </Button>
                          </CardBody>
                        </Card>
                      </Col>
                    );
                  })}
                {(receivedData === "Patient") &&
                  patient.map((obj, i) => {
                    return (
                      <Col>
                        <Card
                          className="AdminLandingcard"
                          style={{
                            backgroundColor: "rgb(21, 136, 194)",
                          }}
                        >
                          <CardBody>
                            <CardTitle tag="h5">Patient ID: {obj.patientId}</CardTitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">
                              Name: {obj.fullName}
                            </CardSubtitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">
                              Contact No: {obj.contactNo}
                            </CardSubtitle>
                            <CardText>UserName: {obj.userName}</CardText>
                            <Button
                              style={{
                                borderRadius: "5px",
                                backgroundColor: "rgb(233, 111, 111)",
                                height: "auto",
                              }}
                            >
                              Remove
                            </Button>
                          </CardBody>
                        </Card>
                      </Col>
                    );
                  })}
                {(receivedData === "Radiologist") &&
                  radio.map((obj, i) => {
                    return (
                      <Col>
                        <Card
                          className="AdminLandingcard"
                          style={{
                            backgroundColor: "rgb(14, 14, 98)",
                          }}
                        >
                          <CardBody>
                            <CardTitle tag="h5">Radiologist ID - {obj.radiologistId}</CardTitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">
                              {obj.name}
                            </CardSubtitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">
                              {obj.degree}
                            </CardSubtitle>
                            <CardText>{obj.userName}</CardText>
                            <Button
                              style={{
                                borderRadius: "5px",
                                backgroundColor: "rgb(233, 111, 111)",
                                height: "auto",
                              }}
                            >
                              Remove
                            </Button>
                          </CardBody>
                        </Card>
                      </Col>
                    );
                  })}
                {(receivedData === "Lab") &&
                  lab.map((obj, i) => {
                    return (
                      <Col>
                        <Card
                          className="AdminLandingcard"
                          style={{
                            backgroundColor: "rgb(244, 165, 46)",
                          }}
                        >
                          <CardBody>
                            <CardTitle tag="h5">Lab ID - {obj.labId}</CardTitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">
                              {obj.labName}
                            </CardSubtitle>
                            <CardSubtitle tag="h6" className="mb-2 text-muted">
                              {obj.contactNo}
                            </CardSubtitle>
                            <CardText>{obj.userName}</CardText>
                            <Button
                              style={{
                                borderRadius: "5px",
                                backgroundColor: "rgb(233, 111, 111)",
                                height: "auto",
                              }}
                            >
                              Remove
                            </Button>
                          </CardBody>
                        </Card>
                      </Col>
                    );
                  })}
              </Row>
            </Container>
          </div>
        </div>
      </div>
      <div className="Admin-landing-about-us-section">
        <p>About Us</p>
      </div>
      <div>
        {showPopup && (
          <div className="popup-overlay" onClick={togglePopup}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              {receivedData === "Doctor" && <DoctorForm/>}
              {receivedData === "Lab" && <LabForm/>}
              {receivedData === "Radiologist" && <RadioForm/>}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminLanding;
