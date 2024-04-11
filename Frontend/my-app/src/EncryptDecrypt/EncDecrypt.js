import CryptoJS from 'crypto-js';

const secretKey = 'asvhxvchjv123DDFFewee'; 

export const encryptDataUser = async (password) => {
  const passwordBuffer = new TextEncoder().encode(password);
  
  const hashBuffer = await crypto.subtle.digest('SHA-256', passwordBuffer);
  
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map(byte => byte.toString(16).padStart(2, '0')).join('');
  
  return hashHex;
};


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
