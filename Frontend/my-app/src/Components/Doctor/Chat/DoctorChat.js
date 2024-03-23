import imgside from "../../../Resources/AppLogo.png";
import React, { useState, useEffect } from "react";
import logout from "../../../Resources/log-out.png";
import "./DoctorChat.css";
import { useNavigate } from "react-router-dom";
const DoctorChat = () => {
  let nav = useNavigate();
  let dateVal = new Date()
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [image, setImage] = useState(null);
  const [dateTime, setDateTime] = useState('');

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
    <div class="Had-login-container">
      <div class="Doctor-Login-hor">
        <div>
          <img src={imgside} id="docsideimg" />
        </div>
        <div class="DocLogout" onClick={handleLogout}>
          <img src={logout} alt="Logout" className="input-icon1" />
        </div>
      </div>
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
      <div class="Docfooter">
        <h2>About Us</h2>
      </div>
    </div>
  );
};

export default DoctorChat;
