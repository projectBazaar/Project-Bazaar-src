import React,{useContext,createContext,useState,useEffect, useRef} from "react";
import { getFirestore, doc, setDoc,updateDoc, addDoc, collection ,getDocs,query,where,onSnapshot,getDoc} from "firebase/firestore";
import { useAuth } from './AuthContext';
import axios from 'axios'
// import { realtimeDB } from '../../utils/init-firebase';
// import { ref, onValue,get } from "firebase/database";

const UserContext=createContext({
    userArray:[],
})

export const useUsers=()=>useContext(UserContext);

export default function UserContextProvider({children})
{
    const {db,currentUser,setCurrentUser}=useAuth();

    const [progress,setProgress]=useState(0);
  const [isSearchOpen, setIsSearchOpen] = useState(false); // State for controlling search overlay

    




  const transformCloudinaryURL = (url) => {

    if(url==="https://i.pinimg.com/736x/90/d1/ac/90d1ac48711f63c6a290238c8382632f.jpg")
    {
      return url;
    }
    // Define the transformations you want to apply
    const transformations = 'q_auto,f_auto';
  
    // Find the index where '/upload' occurs
    const uploadIndex = url.indexOf('/upload') + '/upload'.length;
  
    // Insert the transformations right after '/upload'
    const transformedURL = url.slice(0, uploadIndex) + `/${transformations}` + url.slice(uploadIndex);
  
    return transformedURL;
  };









  
const getProjects=async() => { 
  try {
    // Reference to the 'projects' collection
    const projectsCollectionRef =  collection(db, "projects");
    console.log("called");
    // console.log(projectsCollectionRef);
    
    // Get all documents from the 'projects' collection
    const querySnapshot = await getDocs(projectsCollectionRef);
    // console.log(querySnapshot);

    // Create an array to store the projects
    let projects = [];

    // Iterate through each document in the snapshot
    querySnapshot.forEach((doc) => {
      // Push each document's data into the projects array
      projects.push( doc.data() );
    });

    // Return the projects
    return projects;
  } catch (error) {
    console.error("Error fetching projects:", error);
    return [];
  }
 }


  const value={
    getProjects,
    transformCloudinaryURL,
    setProgress,
    progress,
    setIsSearchOpen,
    isSearchOpen

  


    
   
}
  




    return (
        <UserContext.Provider value={value}>
            {children}
        </UserContext.Provider>
    )
}