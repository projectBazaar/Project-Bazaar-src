import { useEffect, useState } from 'react'
import './App.css'
import Register from './components/Register'
// import {getProjects} from './context/UserContext'
import { useUsers } from './context/UserContext';
import ProjectCards from './components/ProjectCards'
function App() {

  const { getProjects } = useUsers();
  const [projects, setProjects] = useState([]);
  const {currentUser}=useUsers()

  const projekt=[];


  useEffect(() => {

    
    getProjects()
    .then(
      (res) => {
          res.forEach(element => 
          {
            projekt.push(element)
          }
        );
        console.log(projekt);
        
        setProjects(projekt);
      }
    )
    .catch((err) => {
      console.log(err);
      
    })
    


  }, []);




  useEffect(() => {
    console.log(currentUser);

  }, [currentUser]);
  


  return (
    <>
    <div className='flex gap-2 justify-evenly flex-wrap mx-2 '>
  {
    
    projects?.map((ele)=>

      <ProjectCards key={ele.title} proj_title={ele.title} proj_desc={ele.description} proj_media_url={ele.media[0]} proj_pid={ele.pid}/>

    )
  }
  </div >

    </>
  )
}

export default App;