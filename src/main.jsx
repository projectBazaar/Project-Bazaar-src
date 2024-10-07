import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import { createBrowserRouter, RouterProvider,useParams } from 'react-router-dom'
import Register from './components/Register.jsx'
import Login from './components/Login.jsx'
import AuthContextProvider from './context/AuthContext.jsx'
import UserContextProvider from './context/UserContext.jsx'
import { Bounce, Flip, Slide, ToastContainer, Zoom, toast } from 'react-toastify';
import ProjectDisplay from './components/ProjectDisplay.jsx'
import ProjectForm from './components/ProjectForm.jsx'
import ProtectedRoute from './components/ProtectedRoute.jsx'
import Navbar from './components/Navbar.jsx'
import SearchPage from './components/SearchPage.jsx'


const router=createBrowserRouter([
  {
    path:"/",
    element:
    <ProtectedRoute>
      <Navbar/>
      
      <App/>
    </ProtectedRoute>
  },
  {
    path:"/register",
    element:
    <>
      <Navbar/>
    
    <Register/>
    </>
  },
  {
    path:"/login",
    element:<>
      <Navbar/>
    
      <Login/>
    </>
  },
  {
    path:"/project/:pid",
    element:<ProtectedRoute>
      <Navbar/>
    <ProjectDisplay/>
  </ProtectedRoute>
  },
  {
    path:"/search",
    element:<ProtectedRoute>
      <Navbar/>
    <SearchPage/>
  </ProtectedRoute>
  },

  {
    path:"/project/form",
    element:
    <ProtectedRoute>
      <Navbar/>
    <ProjectForm/>
  </ProtectedRoute>
  }
])

createRoot(document.getElementById('root')).render(
  <>

    <AuthContextProvider>
      <UserContextProvider>
        
         
          
          <RouterProvider router={router} basename="/project-bazaar-src/" />
          <ToastContainer />
        
      </UserContextProvider>

    </AuthContextProvider>


  </>
)
