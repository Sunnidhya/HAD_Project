import imgside from "../../../Resources/AppLogo.png";
import React, { useState, useEffect } from "react";
import logout from "../../../Resources/log-out.png";
import "./DoctorChat.css";
import { useNavigate } from "react-router-dom";
import DwvComponent from "../../../DViewer/DwvComponent";

const DoctorChat = () => {
  let nav = useNavigate();
  let dateVal = new Date()
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [image, setImage] = useState(null);
  const [dateTime, setDateTime] = useState('');
  const [blob, setBlob] = useState(null);
  const imageUrl = "file:///D:/HAD_Project/Frontend/my-app/src/Resources/Vida_Head.MR.Comp_DR-Gain_DR.1005.1.2021.04.27.14.20.13.818.14380335.dcm"

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
        user: "A",
        text: inputText,
        image: image ? URL.createObjectURL(image) : null,
        timestamp: dateTime,
      };

      setMessages([...messages, newMessage]);
      setInputText("");
      setImage(null);
    }
  };

  return (
    <div class="Doctor-chat-container">
      <div class="Doctor-Login-hor">
        <div>
          <img src={imgside} id="docsideimg" />
        </div>
        <div class="DocLogout" onClick={handleLogout}>
          <img src={logout} alt="Logout" className="input-icon1" />
        </div>
      </div>
      <div className="chatDicom">
      <div class="chat-wrapper">
        <div class="chat-container">
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
                <p>{message.timestamp}</p>
              </li>
            ))}
          </ul>
        </div>
        <div className="send-upload">
          <input placeholder="Enter your text" className="inputTextVal" type="text" value={inputText} onChange={handleInputChange} />
          <button onClick={handleSendMessage}>Send</button>
          <input type="file" onChange={handleImageChange} />
        </div>
      </div>
      <div className="dicom-viewer">
        <h2>DICOM Viewer</h2>
        <DwvComponent/>
      </div>
      </div>
      <div class="Docfooter">
        <h2>About Us</h2>
      </div>
    </div>
  );
};

export default DoctorChat;
