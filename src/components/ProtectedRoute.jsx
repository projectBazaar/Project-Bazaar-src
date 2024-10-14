import { Navigate,useLocation,useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext"
import notify from "./notify";
import { useEffect } from "react";

function ProtectedRoute({ children }) {
  const { currentUser } = useAuth();
  const navigate=useNavigate();
  const location=useLocation();


  useEffect(()=>{


      if( currentUser ===null)
      {

        navigate("/project-bazaar-src/login",{replace:true})
      }
    
  },[currentUser,location])
  

  return children;
}

export default ProtectedRoute;
