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
import { Routes, Route } from 'react-router-dom';
import LabLanding from './Components/Lab/Landing/LabLanding';
import RadioLanding from './Components/Radiologist/Landing/RadiologistLanding';
import AdminLanding from './Components/Admin/landing/AdminLanding';
import RadiologistDetails from './Components/Radiologist/Details/RadiologistDetails';
import PatientProfile from './Components/Patient/PatientProfile/PatientProfile';
import RadiologistProfile from './Components/Radiologist/Profile/RadiologistProfile';
import LabProfile from './Components/Lab/LabProfile/LabProfile';
import DoctorProfile from './Components/Doctor/DoctorProfile/DoctorProfile';
import DoctorDetails from './Components/Doctor/Details/DoctorDetails';



function App() {
  return (
    <Routes>
    <Route path="/" element={<FirstPage/>}/>
    <Route path="/admin" element={<AdminLogin/>}/>
    <Route path="/doctor" element={<DoctorLogin/>}/>
    <Route path="/radiologist" element={<RadioLogin/>}/>
    <Route path="/lab" element={<LabLogin/>}/>
    <Route path="/patient" element={<PatientLogin/>}/>
    <Route path="/patient/landing" element={<PatientLanding/>}/>
    <Route path="/doctor/details" element={<DoctorDetails/>}/>
    <Route path="/lab/landing" element={<LabLanding/>}/>
    <Route path="/radiologist/landing" element={<RadioLanding/>}/>
    <Route path="/admin/landing" element={<AdminLanding/>}/>
    <Route path="/radiologist/profile" element={<RadiologistProfile/>}/>
    <Route path="/patient/profile" element={<PatientProfile/>}/>
    <Route path="/lab/profile" element={<LabProfile/>}/>
    <Route path="/doctor/profile" element={<DoctorProfile/>}/>
    <Route path="/radiologist/details" element={<RadiologistDetails/>}/>
    
  </Routes>


  );
}

export default App;
