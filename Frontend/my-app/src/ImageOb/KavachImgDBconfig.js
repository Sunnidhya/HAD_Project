import { initializeApp } from "firebase/app";
import { getStorage } from "firebase/storage";

const firebaseConfig = {
  apiKey: "AIzaSyDtA_1eC_NByMRnpnVPcmsRMEpTpYsW-iM",
  authDomain: "kavachimagedb.firebaseapp.com",
  projectId: "kavachimagedb",
  storageBucket: "kavachimagedb.appspot.com",
  messagingSenderId: "597526476120",
  appId: "1:597526476120:web:7d0b9043597774225a212d"
};

const app = initializeApp(firebaseConfig);
const imgDB = getStorage(app);

export {imgDB};