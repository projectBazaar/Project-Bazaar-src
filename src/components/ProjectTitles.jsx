import React,{useEffect,useState} from 'react'
import { useUsers } from '../context/UserContext';
import { NavLink } from 'react-router-dom';

const ProjectTitles = () => {

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
            //console.log(projekt);
            
            setProjects(projekt);
          }
        )
        .catch((err) => {
          console.log(err);
          
        })
        
    
    
      }, []);
    

    

  return (
    <>
    <h1 className='text-center text-2xl text-blue-800'>Projects</h1>
        <div className='mt-1'>
        <div className="flex flex-wrap gap-3 justify-center text-center">

{       projects.map((value,index,arr)=>
             <NavLink key={value.pid} to={`/project-bazaar-src/project/${value.pid}`} >
                  <div  className="rounded-lg text-blue-500 underline text-center w-60 h-auto flex flex-col justify-start items-center px-3 py-2 bg-gray-100 hover:bg-gray-200 shadow-sm">
                    {value.title}
                  </div>
                  </NavLink>

) }
        </div>
        </div>

    </>
  )
}

export default ProjectTitles;