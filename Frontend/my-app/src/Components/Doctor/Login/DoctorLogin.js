import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import './Doctor.css'
const DoctorLogin = () => {
  return (
    <div class="Doctor-login-container">
      <div class="Doctor-Login-hor">
        <div>
          <img src={imgside} id="radseideimg" />
        </div>
        <div className='divisions1'>
          <h1 className="pageTitle">Kavach - India's Leading Tele-Radiology Platform</h1>
        </div>
    </div>
      <div class="Doctor-Login-Ver">
        <div class="Doctor-Login-Ver-Left">
          <img src={imgmain} id="radiomainimg" />
        </div>
        <div class="Doctor-Login-Ver-Right">
          <div className="login-container">
            <h3>Welcome Back</h3>
            <form class="login-form">
              <div class="form-group">
                <input type="text" id="username" name="username" placeholder='Type your Username' required />
                <img src={userIcon} alt="Username" className="input-icon" />
              </div>

              <div class="form-group">
                <input type="password" id="password" name="password" placeholder='Type your Password' required />
                <img src={passwordIcon} alt="Password" className="input-icon" />
              </div>
            </form>
            <div className='ForgotPasswordDoc'><b>Forgot Password?</b></div>

            <button type="submit" id="login_doc">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DoctorLogin;
