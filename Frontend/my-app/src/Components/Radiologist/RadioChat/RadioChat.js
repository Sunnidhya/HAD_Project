import imgside from "../../../Resources/AppLogo.png";
import React, { useState, useEffect, createRef, useRef } from "react";
import logout from "../../../Resources/log-out.png";
import "./RadioChat.css";
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
import { request } from "../../../Network/axiosHelper";
import { getCaseByCaseRadioId, getCaseById,insertChat, updateRadioImpression} from "../../../Network/APIendpoints";
import Logout from "../../Form/Logout";

const RadioChat = () => {
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
  const [textInput, setTextInput] = useState('');
  const [showPopup, setShowPopup] = useState(false);
  const [markAsDoneFlag, setMarkasDone] = useState(false);

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

  const loc = useLocation();
  const { caseIdValue } = loc.state || {};

  const handleLogout = () => {
    localStorage.clear();
    alert("Logout successful!");
    nav("/radiologist");
  };

  const handleInputChange = (event) => {
    setInputText(event.target.value);
  };

  const handleListItemClick = (index) => {
    alert(index);
  };

  const handleImageChange = (event) => {
    showLoadingAlert()
    const file = event.target.files[0];
    const img = ref(imgDB, `Imgs/${v4()}`);
    uploadBytes(img, file).then((data) => {
    getDownloadURL(data.ref).then((value) => {
    hideLoadingAlert()
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
      let dateTimeToBePassed = `${date} ${time}` 
      // setDateTime(`${date} ${time}`);

      const newMessage1 = {
         caseId:caseObj.caseId,
         radioId:caseObj.threads[0].radioId,
         userName: decryptData(),
         text: inputText,
         image: image ? chatImage: null,
        timestamp: dateTimeToBePassed,
      };
      request("POST",insertChat , newMessage1)
      .then((response) => {
        // loadChatImage(response.data)
        setCaseObj(response.data)
        setInputText("")
        setImage(null)
        setChatImage(null)
        scrollToBottom()
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
      showLoadingAlert()
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
              hideLoadingAlert()
            });
          });
        });
      });
    } catch (error) {
      alert("Error copying screenshot");
      hideLoadingAlert()
    }
  };

  // Function to show loading alert
const showLoadingAlert = () => {
  // Create a loading alert element or use an existing one
  const loadingAlert = document.createElement('div');
  loadingAlert.textContent = 'Saving the image in GCP...'; // Set text content to indicate loading
  loadingAlert.className = 'loading-alert'; // Assign a class for easier identification
  loadingAlert.style.backgroundColor = 'rgba(0, 0, 0, 0.5)'; // Semi-transparent background
  loadingAlert.style.color = '#fff'; // Text color
  loadingAlert.style.position = 'fixed'; // Fixed position
  loadingAlert.style.top = '0'; // Align to top
  loadingAlert.style.left = '0'; // Align to left
  loadingAlert.style.width = '100%'; // Full width
  loadingAlert.style.height = '100%'; // Full height
  loadingAlert.style.display = 'flex'; // Flex container
  loadingAlert.style.justifyContent = 'center'; // Center content horizontally
  loadingAlert.style.alignItems = 'center'; // Center content vertically

  // Append the loading alert element to the document body
  document.body.appendChild(loadingAlert);
};

// Function to hide loading alert
const hideLoadingAlert = () => {
  // Find and remove the loading alert element
  const loadingAlert = document.querySelector('.loading-alert');
  if (loadingAlert) {
    loadingAlert.remove();
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

  const handleSubmit = () => {
    // Do whatever you want with the textInput here
    console.log('Submitted text:', textInput);
    
    const data = {
      caseId: caseIdValue,
      radioUserName: decryptData(),
      radioImpression: textInput
    };
    request("POST", updateRadioImpression, data)
      .then((response) => {
        setTextInput('');
        alert(response.data.message)
      })
      .catch((error) => {
        console.warn("Error", error);
      });
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
      scrollToBottom()
      setMarkasDone(obj.markAsDone)
    
    } catch (error) {
      console.error("Error loading image:", error);
    }
  }; 

  const listRef = useRef(null);

  // Function to scroll to the bottom of the list
  const scrollToBottom = () => {
    if (listRef.current) {
      const lastMessage = listRef.current.lastElementChild;
      lastMessage.scrollIntoView({ behavior: 'smooth' });
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

  const togglePopup = () => {
    setShowPopup(prevShowPopup => !prevShowPopup);
  };

  useEffect(() => {
    const data = {
      caseId: caseIdValue,
      radioUserName: decryptData()
    };
    request("POST", getCaseByCaseRadioId, data)
      .then((response) => {
        loadChatImage(response.data);
        loadImageFromUrl1(response.data.scannedImageURL);
      })
      .catch((error) => {
        console.warn("Error", error);
      });  
  }, []);

  return (
    <div className="Radio-chat-container">
      <div className="Radio-chat-hor">
        <div className="logoradiochat">
          <img src={imgside} id="radiochatsideimg" />
        </div>
        <div className="RadiochatLogout" onClick={togglePopup}>
          <img src={logout} alt="Logout" className="radio-input-icon1" />
        </div>
      </div>
      <div className="chatDicom">
        <div className="chat-wrapper">
          <div className="radio-chat-container">
            <ul className="chat-list" ref={listRef}>
            {caseObj && caseObj.threads && caseObj.threads[0].threadsDTO
               && caseObj.threads[0].threadsDTO.map((message, index) => (
                <li
                  key={index}
                  className="chat-item"
                  onClick={() => handleListItemClick(index)}
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
          {!markAsDoneFlag && <div className="radio-send-upload">
            <div className="radio-inputWithButton">
              <br />
              <input
                placeholder="Enter your text"
                className="radinput"
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
              <button className="radio-button" onClick={handleSendMessage}>
                Send
              </button>
              <label for="radio-file-upload" class="radio-custom-file-upload">
                Choose File
              </label>
              <input
                className="radinput"
                type="file"
                id="radio-file-upload"
                onChange={handleImageChange}
              />
            </div>
          </div>}
        </div>
        {dicomImage && (
          <div className="dicom-viewer">
            <div ref={ref1}>
              <DwvComponent dicomProp={dicomImage} />
            </div>
            {!markAsDoneFlag && <button onClick={downloadScreenshot} className="radio-screenshot">
              Screenshot
            </button>}
            {!markAsDoneFlag && <div>
              <textarea
              style={{marginTop:'5px', borderRadius: '8px', padding: '8px', border: '1px solid #ccc'}}
                rows="4"
                cols="62"
                placeholder="Enter your final impression"
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
              />
              <button onClick={handleSubmit} className="submit-button">
                Submit
              </button>
            </div>}
          </div>
        )}
      </div>
      <div className="RadioChat-about-us-section">
        <p>About Us</p>
      </div>
      <div>
        {showPopup && (
          <div className="popup-overlay" onClick={togglePopup}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              <Logout userType="radiologist"/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RadioChat;
