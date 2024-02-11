import './App.css';
import RadioLogin from './Components/Radiologist/Login/RadioLogin';
import imgside from './Resources/AppLogo.png';

function App() {
  return (
    <>
    <div class="Radio-Login-hor">
        <div>
          <img src={imgside} id="radseideimg" />
        </div>
        <div className='divisions1'>
          <h1 className="pageTitle">Kavach - India's Leading Tele-Radiology Platform</h1>
        </div>
    </div>
    <RadioLogin/>
    </>
  );
}

export default App;
