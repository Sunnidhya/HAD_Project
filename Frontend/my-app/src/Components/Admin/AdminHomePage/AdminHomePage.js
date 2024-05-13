import imgside from "../../../Resources/AppLogo.png";
import admin from "../../../Resources/admin-icon-10.jpg";
import logout from "../../../Resources/log-out.png";
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./AdminHomePage.css";
import { getCountOfUsers } from "../../../Network/APIendpoints";
import { request } from "../../../Network/axiosHelper";
import Logout from "../../Form/Logout";
const AdminHomePage = () => {
  const [patientValue, setPatientValue] = useState(0);
  const [radiologistValue, setRadiologistValue] = useState(0);
  const [doctorValue, setDoctorValue] = useState(0);
  const [labValue, setLabValue] = useState(0);
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => {
    setShowPopup(prevShowPopup => !prevShowPopup);
  };

  const dataP = "Patient"
  const dataL = "Lab"
  const dataR = "Radiologist"
  const dataD = "Doctor"

  let nav = useNavigate();

  const goToDoctor = () => {
    nav('/admin/landing', { state: {data: dataD}})
  }

  const goToPatient = () => {
    nav('/admin/landing', { state: {data: dataP}})
  }

  const goToLab = () => {
    nav('/admin/landing', { state: {data: dataL}})
  }

  const goToRadiologist = () => {
    nav('/admin/landing', { state: {data: dataR}})
  }

  useEffect(() => {
    request("GET", getCountOfUsers, {})
      .then((response) => {
        console.warn("Data", response);
        setPatientValue(response.data.countPatient);
        setDoctorValue(response.data.countDoctors);
        setLabValue(response.data.countLab);
        setRadiologistValue(response.data.countRadiologist);
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  }, []);

 return (
    <div className="Admin-Home-container">
      <div class="Admin-Home-hor">
        <div>
          <img src={imgside} id="admindetimg" />
        </div>
        <div class="AdminHomeLogout" style={{cursor:"pointer"}} onClick={togglePopup}>
          <img src={logout} alt="Logout" className="admin-home-input-icon2" />
        </div>
    </div>
    <div className='Admin-Det-ver'>
      <div className='Admin-Det-ver1'>
          <img src={admin} alt="Admin Icon" className="admin-land-icon-1" />
          <p>Admin</p>
        </div>
        <div className="Admin-Det-ver2">
          <div className="Admin-Det-ver2-inner">
            <div className="AdminVerUp">
              <div className="Admin-Det-ver2-1" onClick={goToDoctor}>
                {/* <img src={empty} alt="scan" className='admindoc'/> */}
                <p className="admindoc">Doctor</p>
                <p className="counttext">Count: {doctorValue}</p>
              </div>
              <div className="Admin-Det-ver2-2" onClick={goToLab}>
                {/* <img src={empty} alt="pres" className='adminrad'/> */}
                <p className="adminrad">Laboratory</p>
                <p className="counttext">Count: {labValue}</p>
              </div>
            </div>

            <div className="AdminVerDown">
              <div className="Admin-Det-ver2-3" onClick={goToRadiologist}>
                {/* <img src={empty} alt="radioReport" className='adminlab'/> */}
                <p className="adminlab">Radiologist</p>
                <p className="counttext">Count: {radiologistValue}</p>
              </div>
              <div className="Admin-Det-ver2-4" onClick={goToPatient}>
                {/* <img src={empty} alt="finalDiag" className='adminpat'/> */}
                <p className="adminpat">Patient</p>
                <p className="counttext">Count: {patientValue}</p>
              </div>
            </div>
          </div>
      </div>
      </div>
    <div className="Admin-home-about-us-section">
        <p>About Us</p>
    </div>
    <div>
        {showPopup && (
          <div className="popup-overlay" onClick={togglePopup}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              <Logout userType="adminhome"/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
export default AdminHomePage;
