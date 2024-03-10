import './App.css';
import AdminLogin from './Components/Admin/AdminLogin';
import DoctorLanding from './Components/Doctor/Landing/DoctorLanding';
import DoctorLogin from './Components/Doctor/Login/DoctorLogin';
import FirstPage from './Components/FirstPage';
import LabLogin from './Components/Lab/Login/LabLogin';
import PatientLogin from './Components/Patient/Login/PatientLogin';
import RegPatient from './Components/Patient/Registration/RegPatient';
import RadioLogin from './Components/Radiologist/Login/RadioLogin';
import { Routes, Route } from 'react-router-dom';


function App() {
  return (
      <Routes>
        <Route path="/" element={<FirstPage/>}/>
        <Route path="/admin" element={<AdminLogin/>}/>
        <Route path="/doctor" element={<DoctorLogin/>}/>
        <Route path="/radiologist" element={<RadioLogin/>}/>
        <Route path="/lab" element={<LabLogin/>}/>
        <Route path="/patient" element={<PatientLogin/>}/>
      </Routes>
  );
}

export default App;
