import imgmain from '../../../Resources/lab6.avif';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import imgside from '../../../Resources/AppLogo.png';
import './Lab.css'
const LabLogin = () => {
  const handleToggle = () => {
    const passwordInput = document.getElementById('password');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  };
  return (
    <div class="Lab-login-container">
      <div class="Lab-Login-hor">
        <div>
          <img src={imgside} id="labseideimg" />
        </div>
        <div className='divisions1'>
          <h1 className="pageTitle">Kavach - India's Leading Tele-Radiology Platform</h1>
        </div>
    </div>
      <div class="Lab-Login-Ver">
        <div class="Lab-Login-Ver-Left">
          <img src={imgmain} id="labmainimg" />
        </div>
        <div class="Lab-Login-Ver-Right">
          <div className="login-container">
            <h3>Welcome Lab</h3>
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
            <div className='ForgotPasswordLab'><b>Forgot Password?</b></div>

            <button type="submit" id="login_lab">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LabLogin;