const patientLoginAPI = "/patient/login"
const doctorLoginAPI = "/doctor/login"
const labLoginAPI = "/lab/login"
const radiologistLoginAPI = "/radiologist/login"
const patientRegisterAPI = "/patient/register"
const getCountOfUsers = "/count"
const getListOfDocs = "/doctor/getListOfDoctors"
const getListOfPatients = "/patient/getListOfPatients"
const getListOfLabs = "/lab/getListOfLabs"
const getListOfRadio = "/radilogist/getListOfRadiologists"
const registerDoctor = '/doctor/register'
const registerLab = '/lab/register'
const registerRadio = '/radiologist/register'
const removeDoctor = "/doctor/remove"
const removePatient="/patient/remove"
const removeLab="/lab/remove"
const removeRadiologist="/radiologist/remove"
const otpdoctor="/doctor/login/validateOTP"
const otplab="/lab/login/validateOTP"
const otpPatient="/patient/login/validateOTP"
const otpRadiologist ="/radiologist/login/validateOTP"
const getCasesOfRadiologists="/radiologist/getListOfCases"
const getCasesOfDoctor="/doctor/getListOfCases"
const getCasesOfLab="/lab/getListOfCases"
const getCasesofPatient="/patient/getListOfCases"
const radioProfile="/radiologist/getProfileDetails"
const radioChangePassword ="/radiologist/changePassword"
const laboratoryProfile="/lab/getProfileDetails"
const doctorProfile="/doctor/getProfileDetails"
const patientProfie="/patient/getProfileDetails"
const createcase="/doctor/createCase"

export {patientLoginAPI, 
    doctorLoginAPI,
    labLoginAPI,
    patientRegisterAPI,
    radiologistLoginAPI,
    getCountOfUsers,
    getListOfDocs,
    getListOfPatients,
    getListOfLabs,
    getListOfRadio,
    registerDoctor,
    registerLab,
    registerRadio,
    removeDoctor,
    removePatient,
    removeLab,
    removeRadiologist,
    otpdoctor,
    otplab,
    otpPatient,
    otpRadiologist,
    getCasesOfRadiologists,
    getCasesOfDoctor,
    getCasesOfLab,
    getCasesofPatient,
    radioProfile,
    radioChangePassword,
    laboratoryProfile,
    doctorProfile,
    patientProfie,
    createcase
}
