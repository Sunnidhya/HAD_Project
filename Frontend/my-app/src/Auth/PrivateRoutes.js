import { Navigate, Outlet } from 'react-router-dom'
const PrivateRoutes = () => {
  let tok = window.localStorage.getItem("authentication_token");
  let auth
  if(tok=== null){
   auth = {'token':false}}
  else
   {
    auth = {'token':true}
   }
return (
    auth.token ? <Outlet/> : <Navigate to='/'/>
  )
}

export default PrivateRoutes