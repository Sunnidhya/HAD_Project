import React, { useState } from 'react';
import './UploadImage.css';
import DwvComponent from '../../DViewer/DwvComponent';
import DwvComponentUpload from '../../DViewer/DwvComponentUpload';
import { imgDB } from '../../ImageOb/KavachImgDBconfig';
import { getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { v4 } from 'uuid';
import { uploadImages } from '../../Network/APIendpoints';
import { request } from '../../Network/axiosHelper';

function UploadImage() {
  const [imageSrc1, setImageSrc1] = useState(null);
  const [imageSrc2, setImageSrc2] = useState(null);
  const [isVisible, setIsVisible] = useState(true);
  const [dicomImage, setDicomImage] = useState(null);
  const [dicomImageURL, setDicomImageURL] = useState(null);
  const [prescriptionURLV, setPrescriptionURL] = useState(null);
  const [caseIdV, setCaseId] = useState(''); // Initialize state for caseId

  const handleChange = (event) => {
      setCaseId(event.target.value);
  };

  const handleImageUpload1 = (e) => {
    if (e.target && e.target.files) {
      const img = ref(imgDB, `Imgs/${v4()}`);
      uploadBytes(img, e.target.files[0]).then(data=>{
        getDownloadURL(data.ref).then(value=>{
        setDicomImageURL(value);
        loadImageFromUrl(value);
        })
      })
    }
  };

  const loadImageFromUrl = async (url) => {
    try {
      // Fetch the image from the URL
      const response = await fetch(url);
      const blob = await response.blob(); // Convert the response to a blob
  
      // Create a file object
      const filename = url.substring(url.lastIndexOf('/') + 1); // Extract filename from the URL
      const file = new File([blob], filename);
      setDicomImage(file)
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  const handleImageRemove1 = () => {
    setImageSrc1(null);
  };

  const handleImageUpload2 = (e) => {
    if (e.target && e.target.files) {
      const img = ref(imgDB, `Imgs/${v4()}`);
      uploadBytes(img, e.target.files[0]).then(data=>{
        getDownloadURL(data.ref).then(value=>{
        setPrescriptionURL(value)
        loadImageFromUrlP(value);
        })
      })
    }
  };

  const loadImageFromUrlP = async (url) => {
    try {
      // Fetch the image from the URL
      const response = await fetch(url);
      const blob = await response.blob(); // Convert the response to a blob
      const imageUrl = URL.createObjectURL(blob)
      setImageSrc2(imageUrl)
    } catch (error) {
      console.error('Error loading image:', error);
    }
  };

  const handleImageRemove2 = () => {
    setImageSrc2(null);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  const assignVal = () => {
    const data = {
      caseId:caseIdV,
      prescriptionURL: prescriptionURLV,
      scannedImageURL: dicomImageURL
    }

    request("POST",uploadImages , data)
      .then((response) => {
        alert(response.data.message)
        window.location.reload();
      })
      .catch((error) => {
        console.warn("Error", error);
      });
  }

  return (
    <>
      {isVisible && (
        <div className="container-upload">
          <button className="close-button-upload" onClick={handleClose}>X</button>
          <br/>
          <br/>
          <input
            type="text"
            placeholder="Enter case id"
            className="case-id-input"
            value={caseIdV} // Bind the value of the input to the caseId state
            onChange={handleChange}
          />
          <br/>
          <br/>
          <div className="upload-container">
            <div className="upload-image-container">
              <h3>Scanned Image</h3>
              <div className="image-preview">
                {dicomImage ? (
                  <>
                    <DwvComponentUpload dicomProp={dicomImage}/>
                  </>
                ) : (
                  <div className="placeholder-image">No image uploaded</div>
                )}
              </div>
              <input
                type="file"
                onChange={handleImageUpload1}
                className="input-file"
              />
              <label className="upload-button">
                Upload Image
                <input type="file" onChange={handleImageUpload1} className="input-file" />
              </label>
            </div>
            <div className="gap"></div>
            <div className="upload-image-container">
              <h3>Prescription</h3>
              <div className="image-preview">
                {imageSrc2 ? (
                  <>
                    <img src={imageSrc2} alt="Uploaded" className="uploaded-image" />
                  </>
                ) : (
                  <div className="placeholder-image">No image uploaded</div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload2}
                className="input-file"
              />
              <label className="upload-button">
                Upload Image
                <input type="file" accept="image/*" onChange={handleImageUpload2} className="input-file" />
              </label>
            </div>
            <br />
          </div>
          <button className="btn1" onClick={()=>assignVal()}>Submit</button>
        </div>
      )}
    </>
  );
}

export default UploadImage;
