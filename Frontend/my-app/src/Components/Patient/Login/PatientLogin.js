import imgmain from '../../../Resources/patient6.avif';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import { request, setAuthToken } from '../../../Network/axiosHelper';
import { patientLoginAPI } from '../../../Network/APIendpoints';
import { useNavigate } from 'react-router-dom';
import './Patient.css'
const PatientLogin = () => {

  let nav = useNavigate()

  const goToHomePage = () => {
    nav("/")
  }

  const loginP = async (e,usernameP,passwordP) => {
    e.preventDefault();
    localStorage.clear()
    const data = {
        userName: usernameP,
        password: passwordP
    };
    request("POST",
    patientLoginAPI, 
    data
    ).then((response) => {
        setAuthToken(response.data.token)
        console.warn("Data",response.data)
        alert("Login Successful");
        nav("/patient/landing")
      })
      .catch((error) => {
        console.warn("Error", error)
      });
  };

  const handleToggle = () => {
    const passwordInput = document.getElementById('password');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  };
  return (
    <div class="Patient-login-container">
      <div class="Patient-Login-hor">
        <div>
          <img src={imgside} id="radseideimg" onClick={goToHomePage}/>
        </div>
        <div className='divisions1'>
          <h1 className="pageTitle">Kavach - India's Leading Tele-Radiology Platform</h1>
        </div>
    </div>
      <div class="Patient-Login-Ver">
        <div class="Patient-Login-Ver-Left">
          <img src={imgmain} id="radiomainimg" />
        </div>
        <div class="Patient-Login-Ver-Right">
          <div className="login-container">
            <h3>Welcome Patient</h3>
            <form class="login-form">
              <div class="form-group">
                <input type="text" id="username" name="username" placeholder='Type your Username' required />
                <img src={userIcon} alt="Username" className="input-icon" />
              </div>

              <div class="form-group">
                <input type="password" id="password" name="password" placeholder='Type your Password' required />
                <img src={passwordIcon} alt="Password" className="input-icon" />
                <i className="far fa-eye" id="faeye" onClick={handleToggle}></i>
              </div>
            </form>
            <div className='ForgotPasswordDoc'><b>Forgot Password?</b></div>

            <button type="submit"  id="login_patient"
            onClick={(e) =>
              loginP(
                e,
                document.getElementById("username").value,
                document.getElementById("password").value
              )
            }
            >
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PatientLogin;