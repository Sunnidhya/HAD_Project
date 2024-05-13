import imgmain from '../../Resources/adminImage1.png';
import userIcon from '../../Resources/UserIcon.png';
import passwordIcon from '../../Resources/PasswordIcon.png';
import imgside from '../../Resources/AppLogo.png';
import { useNavigate } from 'react-router-dom';
import './Admin.css'
import { request, setAuthToken } from '../../Network/axiosHelper';
import { adminLoginAPI } from '../../Network/APIendpoints';
const AdminLogin = () => {

  let nav = useNavigate()

  const handleToggle = () => {
    const passwordInput = document.getElementById('password');
    passwordInput.type = passwordInput.type === 'password' ? 'text' : 'password';
  };

  const goToHomePage = () => {
    nav("/")
  }

  const loginA = async (e,usernameD,passwordD) => {
    e.preventDefault();
    localStorage.clear()
    if(usernameD=='admin' && passwordD=='admin'){
      nav('/admin/homepage')
    }else{
      alert('Wrong Username or Password')
    }
  };

  const loginD = async (e, usernameD, passwordD) => {
    e.preventDefault();
    localStorage.clear()
    if(usernameD=='admin' && passwordD=='admin'){
      const data = {
        userName: usernameD,
        password: passwordD
      };
      showLoadingAlert()
      request("POST",
        adminLoginAPI,
        data
      ).then((response) => {
        hideLoadingAlert()
        setAuthToken(response.data.token)
        alert("Login Successful");
        nav('/admin/homepage')
      })
        .catch((error) => {
          console.warn("Error", error)
        });
    }else{
      alert('Wrong Username or Password')
    }
  };

   // Function to show loading alert
const showLoadingAlert = () => {
  // Create a loading alert element or use an existing one
  const loadingAlert = document.createElement("div");
  loadingAlert.textContent = "Loading..."; // Set text content to indicate loading
  loadingAlert.className = "loading-alert"; // Assign a class for easier identification
  loadingAlert.style.backgroundColor = "rgba(0, 0, 0, 0.5)"; // Semi-transparent background
  loadingAlert.style.color = "#fff"; // Text color
  loadingAlert.style.position = "fixed"; // Fixed position
  loadingAlert.style.top = "0"; // Align to top
  loadingAlert.style.left = "0"; // Align to left
  loadingAlert.style.width = "100%"; // Full width
  loadingAlert.style.height = "100%"; // Full height
  loadingAlert.style.display = "flex"; // Flex container
  loadingAlert.style.justifyContent = "center"; // Center content horizontally
  loadingAlert.style.alignItems = "center"; // Center content vertically

  // Append the loading alert element to the document body
  document.body.appendChild(loadingAlert);
};

// Function to hide loading alert
const hideLoadingAlert = () => {
  // Find and remove the loading alert element
  const loadingAlert = document.querySelector(".loading-alert");
  if (loadingAlert) {
    loadingAlert.remove();
  }
};
  
  return (
    <div class="Admin-login-container">
      <div class="Admin-Login-hor">
        <div>
          <img src={imgside} id="adminseideimg" onClick={goToHomePage} />
        </div>
        <div className='divisions1A'>
          <h1 className="pageTitleA">Kavach - India's Leading Tele-Radiology Platform</h1>
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
            

            <button type="submit" id="login_admin"
            onClick={(e) =>
              loginD(
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
