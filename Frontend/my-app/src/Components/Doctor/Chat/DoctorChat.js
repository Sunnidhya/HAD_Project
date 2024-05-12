import imgside from "../../../Resources/AppLogo.png";
import React, { useState, useEffect, createRef, useRef } from "react";
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
import { assignNewRadio, getCaseById, getListOfRadio, insertChat } from "../../../Network/APIendpoints";
import { request } from "../../../Network/axiosHelper";
import DwvComponentUpload from "../../../DViewer/DwvComponentUpload";
import Logout from "../../Form/Logout";
import DropdownButton from "../../Form/Dropdown_button";

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
  const [showPopup, setShowPopup] = useState(false);
  const [radioList, setRadioList] = useState([]);
  const [radioSelected, setRadioSelected] = useState();
  const [markAsDoneFlag, setMarkasDone] = useState(false);

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

  const handleDropdownSelect = (selectedOption, obj, flow) => {
    if(flow === "Select Radiologist Name"){
      const data ={
        caseId: obj.caseId,
        radiologistId: selectedOption.userId
      }
      request("POST", assignNewRadio, data)
      .then((response) => {
        alert("Request for New Radiologist sent to Patient")
      })
      .catch((error) => {
        console.warn("Error", error);
      });
    }else if(flow === "Select Radiologist"){
      setRadioSelected(selectedOption)
    }
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
      let dateObject = new Date();

      // Get date and time strings
      const date = dateObject.toLocaleDateString();
      const time = dateObject.toLocaleTimeString();
      let dateTimeToBePassed = `${date} ${time}`;

      const newMessage1 = {
        caseId:caseObj.caseId,
        radioId:radioSelected.radioId,
        userName: decryptData(),
        text: inputText,
        image: image ? chatImage: null,
        timestamp: dateTimeToBePassed,
      };
      
      request("POST",insertChat , newMessage1)
      .then((response) => {
        // loadChatImage(response.data)
        setCaseObj(response.data)
        console.warn("DataChat", response.data)
        setInputText("")
        setImage(null)
        setChatImage(null)
        scrollToBottom()
        response.data.threads.map((item) => {
          // console.warn("dataTh", item)
          // console.warn("dataTh", radioSelected)
           if(item.radioId === radioSelected.radioId){
            setRadioSelected(item)
            console.warn("DataChat", item)
           }
        })
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
      console.warn("Data",obj.threads)
      setCaseObj(obj);
      if(obj.threads.length === 2){
        setRadioList(obj.threads)
        setRadioSelected(obj.threads[0])
      }else if(obj.threads.length === 1){
        setRadioSelected(obj.threads[0])
      }
      scrollToBottom()
      setMarkasDone(obj.markAsDone)
    
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

  const togglePopup = () => {
    setShowPopup(prevShowPopup => !prevShowPopup);
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
    
      request("GET", getListOfRadio, data)
      .then((response) => {
        setRadioList(response.data);
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
        <div className="DocchatLogout" onClick={togglePopup}>
          <img src={logout} alt="Logout" className="doc-input-icon1" />
        </div>
      </div>
      <div className="chatDicom">
        <div className="chat-wrapper">
          <div style={{width:'300px', marginBottom:'10px', alignItems:'center',alignContent:'center',marginRight:'10px'}}>
          {caseObj && caseObj.threads.length === 1 && 
            <div>
            <DropdownButton
                              patientValue = {radioList}
                              onSelect={(selectedValue) => handleDropdownSelect(selectedValue, caseObj, "Select Radiologist Name")}
                              flow = {"Select Radiologist Name"}/>
            </div>
          }
          {caseObj && caseObj.threads.length === 2 && 
            <div>
            <DropdownButton
                              patientValue = {radioList}
                              onSelect={(selectedValue) => handleDropdownSelect(selectedValue, caseObj, "Select Radiologist")}
                              flow = {"Select Radiologist"}/>
            </div>
          }
          </div>
       
          {radioSelected && <div className="chat-container">
            <ul className="chat-list" ref={listRef}>
              {/* {caseObj && caseObj.threads && caseObj.threads[0].threadsDTO
               && caseObj.threads[0].threadsDTO.map((message, index) => (
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
              ))} */}
              {radioSelected && radioSelected.threadsDTO.map((message, index) => (
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
          </div>}
          {!markAsDoneFlag && radioSelected && <div className="send-upload">
            <div className="inputWithButton">
              <br />
              <input 
                placeholder="Enter your text"
                className="docinput"
                id="docinput1"
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
              <input className="docinput"
                type="file"
                id="file-upload"
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
            {!markAsDoneFlag && <button onClick={downloadScreenshot} className="screenshot">
              Screenshot
            </button>}
          </div>
        )}
      </div>
      <div className="DoctorChat-about-us-section">
        <p>About Us</p>
      </div>
      <div>
        {showPopup && (
          <div className="popup-overlay" onClick={togglePopup}>
            <div className="popup-scrollable" onClick={(e) => e.stopPropagation()}>
              <Logout userType="doctor"/>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DoctorChat;
