import imgmain from '../../Resources/adminImage1.png';
import userIcon from '../../Resources/UserIcon.png';
import passwordIcon from '../../Resources/PasswordIcon.png';
import imgside from '../../Resources/AppLogo.png';
import { useNavigate } from 'react-router-dom';
import './Admin.css'
const AdminLogin = () => {

  let nav = useNavigate()

  const handleToggle = () => {
    const passwordInput = document.getElementById('password');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  };

  const loginA = async (e,usernameD,passwordD) => {
    e.preventDefault();
    localStorage.clear()
    if(usernameD=='admin' && passwordD=='admin'){
      nav('/admin/homepage')
    }else{
      alert('Wrong Username or Password')
    }
  };
  
  return (
    <div class="Admin-login-container">
      <div class="Admin-Login-hor">
        <div>
          <img src={imgside} id="adminseideimg" />
        </div>
        <div className='divisions1'>
          <h1 className="pageTitle">Kavach - India's Leading Tele-Radiology Platform</h1>
        </div>
    </div>
      <div class="Admin-Login-Ver">
        <div class="Admin-Login-Ver-Left">
          <img src={imgmain} id="adminmainimg" />
        </div>
        <div class="Admin-Login-Ver-Right">
          <div className="login-container">
            <h3>Welcome Admin</h3>
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
            <div className='AdminForgotPassword'><b>Forgot Password?</b></div>

            <button type="submit" id="login_admin"
            onClick={(e) =>
              loginA(
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

export default AdminLogin;
