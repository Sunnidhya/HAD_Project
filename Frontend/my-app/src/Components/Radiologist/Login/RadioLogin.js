import imgmain from '../../../Resources/login-hero.svg';
import userIcon from '../../../Resources/UserIcon.png';
import passwordIcon from '../../../Resources/PasswordIcon.png';
import './Login.css'
const RadioLogin = () => {
  return (
    <div class="Radio-login-container">
      <div class="Radio-Login-Ver">
        <div class="Radio-Login-Ver-Left">
          <img src={imgmain} id="radiomainimg" />
        </div>
        <div class="Radio-Login-Ver-Right">
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
            <div className='ForgotPassword'><b>Forgot Password?</b></div>

            <button type="submit" id="login">
              Login
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RadioLogin;
