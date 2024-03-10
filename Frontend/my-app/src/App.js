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


function App() {
  return (
    <>
      <DoctorLogin/>
    </>
  );
}

export default App;
