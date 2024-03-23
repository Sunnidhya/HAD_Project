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
import AdminHomePage from './Components/Admin/landing/AdminHomePage';
import Profile from './Components/Radiologist/Profile/Profile';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
    <Routes>
    <Route path="/" element={<Profile/>}/>
    <Route path="/admin" element={<AdminLogin/>}/>
    <Route path="/doctor" element={<DoctorLogin/>}/>
    <Route path="/radiologist" element={<RadioLogin/>}/>
    <Route path="/lab" element={<LabLogin/>}/>
    <Route path="/patient" element={<PatientLogin/>}/>
    <Route path="/patient/landing" element={<PatientLanding/>}/>
    <Route path="/doctor/landing" element={<DoctorLanding/>}/>
  </Routes>


  );
}

export default App;
