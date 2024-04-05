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
  removeDoctor,
  removeLab,
  removePatient,
  removeRadiologist,
} from "../../../Network/APIendpoints";
import { request } from "../../../Network/axiosHelper";
import DoctorForm from "../../Form/DoctorForm";
import LabForm from "../../Form/LabForm";
import RadioForm from "../../Form/RadioForm";
import Logout from "../../Form/Logout";
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
  const [isP, setP] = useState(true);
  const [isL, setL] = useState(false);
  const [isR, setR] = useState(false);

  const remove = (obj) => {
    let temp;
    let data1 = {};
    if (receivedData === "Patient") {
      temp = removePatient;
      data1 = {
        userName: obj.userName,
        fullName: obj.fullName,
        address: obj.address,
        email: obj.email,
        contactNo:obj.contactNo
      };
    }
    if (receivedData === "Lab") {
      temp = removeLab;
      data1 = {
        userName: obj.userName,
        labName: obj.labName,
        email: obj.email,
        contactNo:obj.contactNo
      };
    }
    if (receivedData === "Radiologist") {
      temp = removeRadiologist;
      data1 = {
        name: obj.name,
        degree: obj.degree,
        specialization: obj.specialization,
        email: obj.email,
        userName: obj.userName,
        dept: obj.department
      };
    }
    if (receivedData === "Doctor") {
      temp = removeDoctor;
      data1 = {
        name: obj.name,
        degree: obj.degree,
        specialization: obj.specialization,
        email: obj.email,
        userName: obj.userName,
        dept: obj.department
      };
    }

    request("POST", temp, data1)
      .then((response) => {
        console.warn("DataValue", response.data)
        alert(response.data.message);
        window.location.reload();
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  }

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
  const [showPopupLogout, setShowPopupLogout] = useState(false);

  const togglePopup = () => {
    setShowPopup(prevShowPopup => !prevShowPopup);
  };

  const togglePopupLogout = () => {
    setShowPopupLogout(prevShowPopupLogout => !prevShowPopupLogout);
  };

  useEffect(() => {
    let temp;
    if (receivedData === "Patient") {
      setP(false)
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
        console.warn("DataValue", response.data)
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
        <div class="AdminLandingLogout" style={{cursor:"pointer"}}  onClick={togglePopupLogout}>
          <img src={logout} alt="Logout" className="input-icon2" />
        </div>
      </div>
      <div className="Admin-Land-ver">
        <div className="Admin-Land-ver1">
          {isP && <button style={{ margin: "10px" }} onClick={togglePopup}>{buttonV}</button>}
        </div>
        <div className="Admin-Land-ver2">
          <div className="Admin-card" >
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
                            color: 'white',
                          }}
                        >
                          <CardBody>
                            <CardTitle tag="h5">Doctor ID: {obj.userId}</CardTitle>
                            <CardSubtitle >
                              Name: {obj.name}
                            </CardSubtitle>
                            <CardSubtitle >
                              Degree: {obj.degree}
                            </CardSubtitle>
                            <CardText>UserName: {obj.userName}</CardText>
                            <Button
                              style={{
                                borderRadius: "5px",
                                backgroundColor: "rgb(233, 111, 111)",
                                height: "auto",
                              }}
                              onClick={() => remove(obj)}
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
                            color: "white",
                          }}
                        >
                          <CardBody>
                            <CardTitle tag="h5">Patient ID: {obj.userId}</CardTitle>
                            <CardSubtitle >Name: {obj.fullName}</CardSubtitle>
                            <CardSubtitle>Contact No: {obj.contactNo}</CardSubtitle>
                            <CardText>UserName: {obj.userName}</CardText>
                            <Button
                              style={{
                                borderRadius: "5px",
                                backgroundColor: "rgb(233, 111, 111)",
                                height: "auto",
                              }}
                              onClick={() => remove(obj)}
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
                            color: "white",
                          }}
                        >
                          <CardBody>
                            <CardTitle tag="h5">Radiologist ID - {obj.userId}</CardTitle>
                            <CardSubtitle>Name - {obj.name}</CardSubtitle>                            
                            <CardSubtitle>Degree - {obj.degree}</CardSubtitle>
                            <CardText>Username - {obj.userName}</CardText>
                            <Button
                              style={{
                                borderRadius: "5px",
                                backgroundColor: "rgb(233, 111, 111)",
                                height: "auto",
                              }}
                              onClick={() => remove(obj)}
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
                            color: "white",
                          }}
                        >
                          <CardBody>
                            <CardTitle tag="h5">Lab ID - {obj.userId}</CardTitle>
                            <CardSubtitle >Name - {obj.labName}</CardSubtitle>                                                          
                            <CardSubtitle>Contact No - {obj.contactNo}</CardSubtitle>
                            <CardText>Username - {obj.userName}</CardText>
                            <Button
                              style={{
                                borderRadius: "5px",
                                backgroundColor: "rgb(233, 111, 111)",
                                height: "auto",
                              }}
                              onClick={() => remove(obj)}
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
        {showPopupLogout && (
          <div className="popup-overlay" onClick={togglePopupLogout}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              <Logout userType='admin'/>
            </div>
          </div>
        )}
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
