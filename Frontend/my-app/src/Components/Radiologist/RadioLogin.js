import App from "../../App";
import imgside from './images/radiohomeside.jpg'
import imgmain from './images/radiohomemain.jpg'
const RadioLogin = () => {
    return(

        <>



    <div class="Radio-login-container">
        <div class="Radio-Login-hor">
            
            
            <img src={imgside} id="radseideimg"/>

        </div>
        <div class="Radio-Login-Ver">
            <div class="Radio-Login-Ver-Left">
            <img src={imgmain} id="radiomainimg"/>

            </div>
            <div class="Radio-Login-Ver-Right">


                
                    <div className="login-container">
                    <h3>Welcome Back</h3>
                    <form class="login-form">
                    <div class="form-group">
                    <label for="username">Username:</label>
                    <input type="text" id="username" name="username" required/>
                    </div>

                    <div class="form-group">
                    <label for="password">Password:</label>
                    <input type="password" id="password" name="password" required/>
                    </div>
                    </form>
                    
                    <button type="submit" id="login">Login</button>
                </div>
                
                
            </div>
        </div>

    </div>



        </>
    )
}

export default RadioLogin;