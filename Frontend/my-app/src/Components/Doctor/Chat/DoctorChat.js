import imgside from "../../../Resources/AppLogo.png";
import React, { useState, useEffect, createRef } from "react";
import logout from "../../../Resources/log-out.png";
import "./DoctorChat.css";
import { useNavigate } from "react-router-dom";
import DwvComponent from "../../../DViewer/DwvComponent";
import { createFileName, useScreenshot } from "use-react-screenshot";
import { getDownloadURL, getStorage, ref, uploadBytes, uploadString } from "firebase/storage";
import { imgDB } from "../../../ImageOb/KavachImgDBconfig";
import { v4 } from "uuid";
import { decryptData } from "../../../EncryptDecrypt/EncDecrypt";

const DoctorChat = () => {
  let nav = useNavigate();
  let dateVal = new Date()
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [image, setImage] = useState(null);
  const [ssImg, setSSImg] = useState();
  const [dateTime, setDateTime] = useState('');
  const [blob, setBlob] = useState(null);
  const ref1 = createRef(null)
  const [value, setValue] = useState('');

  const [screenshot, takeScreenshot]= useScreenshot({
    type:'image/jpeg',
    quality:1.0
  })
  const handleFileChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.onload = () => {
      const blob = new Blob([reader.result], { type: file.type });
      setBlob(blob);
    };

    reader.readAsArrayBuffer(file);
  };

  const handleLogout = () => {
    localStorage.clear();
    alert("Logout successful!");
    nav("/doctor");
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleListItemClick = (index) => {
    alert(index)
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
  };

  const handleSendMessage = () => {
    if (inputText.trim() !== "" || image) {
       // Convert milliseconds to Date object
      const dateObject = new Date(dateVal.getTime());

      // Get date and time strings
      const date = dateObject.toLocaleDateString();
      const time = dateObject.toLocaleTimeString();
      setDateTime(`${date} ${time}`);
      console.warn("Data",dateTime)

      const newMessage = {
        
        user: decryptData()+"(You)",
        text: inputText.split('\n').map((line, i) => <span key={i}>{line}<br/></span>),
        image: image ? URL.createObjectURL(image) : null,
        timestamp: dateTime,
      };

      setMessages([...messages, newMessage]);
      setInputText("");
      setImage(null);
    }
  };
  const img = new Image();
  const c = document.createElement("canvas");
  const ctx = c.getContext("2d");
  
  function setCanvasImage(path, func) {
    img.onload = function () {
      c.width = this.naturalWidth;
      c.height = this.naturalHeight;
      ctx.drawImage(this, 0, 0);
      c.toBlob((blob) => {
        func(blob);
      }, "image/png");
    };
    img.src = path;
  }
  
  const downloadScreenshot = async () => {
    try {
      // Take the screenshot
      await takeScreenshot(ref1.current).then(async (image) => {
        // Call setCanvasImage to prepare canvas for copying
        setCanvasImage(image, async (imgBlob) => {
          // Write the blob to the clipboard
          const img = ref(imgDB, `Imgs/${v4()}`);
          uploadBytes(img, imgBlob).then(data=>{
            console.warn("Data", data);
            getDownloadURL(data.ref).then(value=>{
            console.warn("Data1",value)
            loadImageFromUrl(value);
            })
          })
         
        });
      });
    } catch (error) {
      console.error("Error copying screenshot:", error);
    }
  };
  
  let loadImageFromUrl = async (url) => {
    try {
      // Fetch the image from the URL
      const response = await fetch(url);
      let blob1 = await response.blob(); // Convert the response to a blob
      await navigator.clipboard.write([new ClipboardItem({ "image/png": blob1 })]);
       // Alert user that the image has been copied to the clipboard
       alert("Screenshot copied to clipboard!");
      
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  const handlePaste = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData).items;
    for (let index in items) {
      const item = items[index];
      if (item.kind === 'file') {
        const blob = item.getAsFile();
        setImage(blob);
      }
    }
  };
  
  return (
    <div className="Doctor-chat-container">
      <div className="Doc-chat-hor">
        <div className='logodocchat'>
          <img src={imgside} id="docchatsideimg" />
        </div>
        <div className="DocchatLogout" onClick={handleLogout}>
          <img src={logout} alt="Logout" className="doc-input-icon1" />
        </div>
      </div>
      <div className="chatDicom">
      <div className="chat-wrapper">
        <div className="chat-container">
          <ul className="chat-list">
            {messages.map((message, index) => (
              <li key={index} className="chat-item" onClick={() => handleListItemClick(index)}>
                <p className="userNameVal">{message.user}</p>
                <p>{message.text}</p>
                {message.image && (
                  <img
                    src={message.image}
                    alt="Uploaded"
                    className="chat-image"
                  />
                )}
                <p className="timestamp">{message.timestamp}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="send-upload">
          <div className='inputWithButton'>
          <br/><input placeholder="Enter your text" className="inputTextVal" type="text" value={inputText} onChange={handleInputChange} onPaste={handlePaste} cols={50} style={{ height: 'auto', minHeight: '50px',borderRadius:'4px' }}/>
          <button className="button" onClick={handleSendMessage}>Send</button>
          <label for="file-upload" class="custom-file-upload">
            Choose File 
          </label>
          <input type="file" id="file-upload" onChange={handleImageChange}/>
          </div>
          
        </div>
      </div>
      <div className="dicom-viewer">
        <div ref={ref1}>
          <DwvComponent/>
          </div>
        
       <button onClick={downloadScreenshot} className="screenshot">Screenshot</button>
      </div>
      <img src={ssImg}/>
      </div>
      <div className="DoctorChat-about-us-section">
        <p>About Us</p>
    </div>
    </div>
  );
};

export default DoctorChat;
