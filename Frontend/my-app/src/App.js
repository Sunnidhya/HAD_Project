import './App.css';
import AdminLogin from './Components/Admin/AdminLogin';
import DoctorLanding from './Components/Doctor/Landing/DoctorLanding';
import DoctorLogin from './Components/Doctor/Login/DoctorLogin';
import FirstPage from './Components/FirstPage';
import LabLogin from './Components/Lab/Login/LabLogin';
import PatientLogin from './Components/Patient/Login/PatientLogin';
import PatientLanding from './Components/Patient/PatientLanding/PatientLanding';
import RegPatient from './Components/Patient/Registration/RegPatient';
import RadioLogin from './Components/Radiologist/Login/RadioLogin';

import Profile from './Components/Radiologist/Profile/Profile';
import { Routes, Route } from 'react-router-dom';
import LabLanding from './Components/Lab/Landing/LabLanding';
import RadioLanding from './Components/Radiologist/Landing/RadiologistLanding';

import AdminLanding from './Components/Admin/landing/AdminLanding';


import RadiologistDetails from './Components/Radiologist/Details/RadiologistDetails';
import DoctorDetails from './Components/Doctor/Details/DoctorDetails';
import PatientDetails from './Components/Patient/Details/PatientDetails';


function App() {
  return (
    <Routes>
    <Route path="/" element={<AdminLanding/>}/>
    <Route path="/admin" element={<AdminLogin/>}/>
    <Route path="/doctor" element={<DoctorLogin/>}/>
    <Route path="/radiologist" element={<RadioLogin/>}/>
    <Route path="/lab" element={<LabLogin/>}/>
    <Route path="/patient" element={<PatientLogin/>}/>
    <Route path="/patient/landing" element={<PatientLanding/>}/>
    <Route path="/doctor/landing" element={<DoctorLanding/>}/>
    <Route path="/lab/landing" element={<LabLanding/>}/>
    <Route path="/radiologist/landing" element={<RadioLanding/>}/>
    <Route path="/admin/landing" element={<AdminLanding/>}/>
    <Route path="/radiologist/profile" element={<Profile/>}/>

    <Route path="/doctor/details" element={<DoctorDetails/>}/>
    <Route path="/radiologist/details" element={<RadiologistDetails/>}/>
    <Route path="/patient/details" element={<PatientDetails/>}/>



  </Routes>


  );
}

export default App;
