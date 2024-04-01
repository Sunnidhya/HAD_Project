import CryptoJS from 'crypto-js';

const secretKey = 'asvhxvchjv123DDFFewee'; 

export const encryptData = (data) => {
  const encryptedData = CryptoJS.AES.encrypt(JSON.stringify(data), secretKey).toString();
  localStorage.setItem('encryptedData', encryptedData);
};

export const decryptData = () => {
  const encryptedData = localStorage.getItem('encryptedData');
  if (encryptedData) {
    const bytes = CryptoJS.AES.decrypt(encryptedData, secretKey);
    const decryptedData = JSON.parse(bytes.toString(CryptoJS.enc.Utf8));
    return decryptedData;
  }
  return null;
};
