import imgside from "../../../Resources/AppLogo.png";
import React, { useState, useEffect, createRef } from "react";
import logout from "../../../Resources/log-out.png";
import "./DoctorChat.css";
import { useNavigate, useLocation } from "react-router-dom";
import DwvComponent from "../../../DViewer/DwvComponent";
import { createFileName, useScreenshot } from "use-react-screenshot";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytes,
  uploadString,
} from "firebase/storage";
import { imgDB } from "../../../ImageOb/KavachImgDBconfig";
import { v4 } from "uuid";
import { decryptData } from "../../../EncryptDecrypt/EncDecrypt";
import { getCaseById, insertChat } from "../../../Network/APIendpoints";
import { request } from "../../../Network/axiosHelper";
import DwvComponentUpload from "../../../DViewer/DwvComponentUpload";

const DoctorChat = () => {
  let nav = useNavigate();
  let dateVal = new Date();
  const [messages, setMessages] = useState([]);
  const [inputText, setInputText] = useState("");
  const [image, setImage] = useState(null);
  const [ssImg, setSSImg] = useState();
  const [dateTime, setDateTime] = useState("");
  const [blob, setBlob] = useState(null);
  const ref1 = createRef(null);
  const [value, setValue] = useState("");
  const [caseObj, setCaseObj] = useState(null);
  const [dicomImage, setDicomImage] = useState(null);
  const [chatImage,setChatImage] = useState();
  const [loadImage,setLoadImage]=useState();

  const loc = useLocation();
  const { caseIdValue } = loc.state || {};

  const [screenshot, takeScreenshot] = useScreenshot({
    type: "image/jpeg",
    quality: 1.0,
  });
  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   const reader = new FileReader();
  //   reader.onload = () => {
  //     const blob = new Blob([reader.result], { type: file.type });
  //     setBlob(blob);
  //   };

  //   reader.readAsArrayBuffer(file);
  // };

  const handleLogout = () => {
    localStorage.clear();
    alert("Logout successful!");
    nav("/doctor");
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleListItemClick = (index) => {
    alert(index);
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    const img = ref(imgDB, `Imgs/${v4()}`);
    uploadBytes(img, file).then((data) => {
    getDownloadURL(data.ref).then((value) => {
    setChatImage(value)
    alert("Image uploaded to firestore successfully")
      });
    });
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
      console.warn("Data", dateTime);

      const newMessage1 = {
       caseId:caseObj.caseId,
        userName: decryptData(),
        text: inputText,
        image: image ? chatImage: null,
        timestamp: dateTime,
      };
      
      request("POST",insertChat , newMessage1)
      .then((response) => {
        // loadChatImage(response.data)
        setCaseObj(response.data)
        newMessage1=null
      }).catch((error) => {
        console.warn("Error", error);
      });
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
          uploadBytes(img, imgBlob).then((data) => {
            console.warn("Data", data);
            getDownloadURL(data.ref).then((value) => {
              console.warn("Data1", value);
              setChatImage(value)
              loadImageFromUrl(value);
            });
          });
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
      await navigator.clipboard.write([
        new ClipboardItem({ "image/png": blob1 }),
      ]);
      alert("Screenshot copied to clipboard!");
    } catch (error) {
      console.error("Error loading image:", error);
    }
  };

  let loadChatImage = async (obj) => {
    try {
      // Fetch the image from the 
      for (let i = 0; i < obj.threads.length; i++) {
        if(obj.threads[i].imageURL!==null){
          let url=obj.threads[i].imageURL;
          const response = await fetch(url);
          let blob1 = await response.blob();
          const imgURL=URL.createObjectURL(blob1)
          obj.threads[i].imageURL=imgURL;
        }
       
      }
      console.warn("Data",obj)
      setCaseObj(obj);
    
    } catch (error) {
      console.error("Error loading image:", error);
    }
  }; 

  const handlePaste = (event) => {
    const items = (event.clipboardData || event.originalEvent.clipboardData)
      .items;
    for (let index in items) {
      const item = items[index];
      if (item.kind === "file") {
        const blob = item.getAsFile();
        setImage(blob);
      }
    }
  };

  const loadImageFromUrl1 = async (url) => {
    try {
      // Fetch the image from the URL
      const response = await fetch(url);
      const blob = await response.blob(); // Convert the response to a blob

      // Create a file object
      const filename = url.substring(url.lastIndexOf("/") + 1); // Extract filename from the URL
      const file = new File([blob], filename);
      setDicomImage(file);
    } catch (error) {
      console.error("Error loading image:", error);
    }
  };

  useEffect(() => {
    const data = {
      caseId: caseIdValue,
    };
    request("POST", getCaseById, data)
      .then((response) => {
        loadChatImage(response.data);
        loadImageFromUrl1(response.data.scannedImageURL);
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  }, []);

  return (
    <div className="Doctor-chat-container">
      <div className="Doc-chat-hor">
        <div className="logodocchat">
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
              {caseObj && caseObj.threads && caseObj.threads.map((message, index) => (
                <li
                  key={index}
                  className="chat-item"
                  onClick={() => handleListItemClick(index) }
                >
                  <p className="userNameVal">{message.userName}</p>
                  <p>{message.text}</p>
                  {message.imageURL && (
                    <img
                      src={message.imageURL}
                      alt="Uploaded"
                      className="chat-image"
                    />
                  )}
                  <p className="timestamp">{message.timeStamp}</p>
                </li>
              ))}
            </ul>
          </div>
          <div className="send-upload">
            <div className="inputWithButton">
              <br />
              <input
                placeholder="Enter your text"
                className="inputTextVal"
                type="text"
                value={inputText}
                onChange={handleInputChange}
                onPaste={handlePaste}
                cols={50}
                style={{
                  height: "auto",
                  minHeight: "50px",
                  borderRadius: "4px",
                }}
              />
              <button className="button" onClick={handleSendMessage}>
                Send
              </button>
              <label for="file-upload" class="custom-file-upload">
                Choose File
              </label>
              <input
                type="file"
                id="file-upload"
                onChange={handleImageChange}
              />
            </div>
          </div>
        </div>
        {dicomImage && (
          <div className="dicom-viewer">
            <div ref={ref1}>
              <DwvComponent dicomProp={dicomImage} />
            </div>
            <button onClick={downloadScreenshot} className="screenshot">
              Screenshot
            </button>
          </div>
        )}
      </div>
      <div className="DoctorChat-about-us-section">
        <p>About Us</p>
      </div>
    </div>
  );
};

export default DoctorChat;
