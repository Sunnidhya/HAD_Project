import React, { useEffect, useState } from 'react';
import { saveAs } from 'file-saver';
import './ImageForm.css';
import DwvComponentUpload from '../../DViewer/DwvComponentUpload';
import DwvComponent from '../../DViewer/DwvComponent';
import DWVComponentPatientViewer from '../../DViewer/DWVComponentPatientViewer';

function ImageForm({ imageUrl, type }) {
  console.warn("data",imageUrl)
  const [isVisible, setIsVisible] = useState(true);
  const [image1,setImage] = useState(null);
  const [typeV, setType] = useState(null)
  const handleClose = () => {
    setIsVisible(false);
  };

  const handleDownload = async (imageSrc) => {
    fetch(imageSrc)
  .then((response) => {
    if (!response.ok) {
      throw new Error('Failed to fetch image');
    }
    return response.blob();
  })
  .then((imageBlob) => {
    const link = document.createElement('a');
    link.href = URL.createObjectURL(imageBlob);
    link.download = 'downloaded_image.jpg'; // You can change the file name and extension
    link.click();
  })
  .catch((error) => {
    console.error('Error downloading image:', error);
  });
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

useEffect(() => {
    setImage(imageUrl);
    setType(type)
  }, [imageUrl,type]);

  return (
    <>
      {isVisible && (
        <>
        <div className="overlay"></div>
        <div className="container-upload">
          <button className="close-button-upload" onClick={handleClose}>X</button>
          <div className="upload-container">
            <div className="upload-image-container">
              {typeV === 'presc' && <h3>Doctor's Prescription</h3>}
              {typeV === 'dicom' && <h3>Scanned Image</h3>}
              {typeV === 'presc' && <div className="image-preview1">
                {image1 ? (
                  <>
                    <img src={image1} alt="Uploaded" className="uploaded-image" />
                  </>
                ) : (
                  <div className="placeholder-image">No image uploaded</div>
                )}
              </div>}
              {typeV === 'dicom' && <div className="image-preview1">
                {image1 ? (
                  <>
                  <DWVComponentPatientViewer dicomProp={image1}/>
                </>
                ) : (
                  <div className="placeholder-image">No image uploaded</div>
                )}
              </div>}
            </div>
            <br />
          </div>
          <br />
          <button className="download-button" onClick={() => handleDownload(imageUrl)}>Download</button>
        </div>
        </>
      )}
    </>
  );
}

export default ImageForm;