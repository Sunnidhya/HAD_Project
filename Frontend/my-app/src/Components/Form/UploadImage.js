import React, { useState } from 'react';
import './UploadImage.css';

function UploadImage() {
  const [imageSrc1, setImageSrc1] = useState(null);
  const [imageSrc2, setImageSrc2] = useState(null);
  const [isVisible, setIsVisible] = useState(true);

  const handleImageUpload1 = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc1(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove1 = () => {
    setImageSrc1(null);
  };

  const handleImageUpload2 = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();

    reader.onload = () => {
      setImageSrc2(reader.result);
    };

    if (file) {
      reader.readAsDataURL(file);
    }
  };

  const handleImageRemove2 = () => {
    setImageSrc2(null);
  };

  const handleClose = () => {
    setIsVisible(false);
  };

  return (
    <>
      {isVisible && (
        <div className="container-upload">
          <button className="close-button-upload" onClick={handleClose}>X</button>
          <div className="upload-container">
            <div className="upload-image-container">
              <h3>Scanned Image</h3>
              <div className="image-preview">
                {imageSrc1 ? (
                  <>
                    <button className="remove-button" onClick={handleImageRemove1}>
                      X
                    </button>
                    <img src={imageSrc1} alt="Uploaded" className="uploaded-image" />
                  </>
                ) : (
                  <div className="placeholder-image">No image uploaded</div>
                )}
              </div>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageUpload1}
                className="input-file"
              />
              <label className="upload-button">
                Upload Image
                <input type="file" accept="image/*" onChange={handleImageUpload1} className="input-file" />
              </label>
            </div>
            <div className="gap"></div>
            <div className="upload-image-container">
              <h3>Prescription</h3>
              <div className="image-preview">
                {imageSrc2 ? (
                  <>
                    <button className="remove-button" onClick={handleImageRemove2}>
                      X
                    </button>
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
          <button className="btn1">Submit</button>
        </div>
      )}
    </>
  );
}

export default UploadImage;
