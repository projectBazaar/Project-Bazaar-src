import React from 'react';
import { useNavigate, NavLink } from 'react-router-dom';
import { useUsers } from '../context/UserContext';



const ProjectCards = ({ proj_title, proj_media_url, proj_desc,proj_pid }) => {
  const truncate = (str, maxLength) => {
    if (str.length <= maxLength) return str;
    return str.slice(0, maxLength) + '...';
  };

  const {transformCloudinaryURL}=useUsers();

  const navigate = useNavigate();

  return (
    <>
      <div className="h-auto pt-6 mt-2 items-stretch">
        <div className="max-w-sm mx-auto bg-white dark:bg-gray-900 rounded-lg overflow-hidden shadow-lg hover:shadow-2xl transition-all hover:shadow-blue-300 h-[450px] flex flex-col justify-between">
          <div className="border-b px-4 pb-6">
            <div className="text-center my-4">
              <NavLink to={`/project-bazaar-src/project/${proj_pid}`} replace={true}>
                {proj_media_url && !proj_media_url.includes('firebasestorage') ? (
                  <img
                    className="h-48 w-full object-cover rounded-sm border-4 border-white dark:border-gray-800 mx-auto my-4"
                    src={transformCloudinaryURL(proj_media_url)}
                    alt="Project Media"
                  />
                ) : (
                  <video
                    autoPlay
                    controls
                    className="object-cover h-48 w-full rounded-sm border-2 border-white dark:border-gray-800 mx-auto my-4"
                  >
                    <source src={proj_media_url} type="video/mp4" />
                    Your browser does not support the video tag.
                  </video>
                )}
              </NavLink>
              <div className="py-2">
                <h3 className="font-bold text-xl text-gray-800 dark:text-white mb-1">
                  {truncate(proj_title, 20)}
                </h3>
                <div className="inline-flex text-gray-700 dark:text-gray-300 items-center">
                  <svg
                    className="h-5 w-5 text-gray-400 dark:text-gray-600 mr-1"
                    fill="currentColor"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox="0 0 24 24"
                    width="24"
                    height="24"
                  >
                    <path d="M5.64 16.36a9 9 0 1 1 12.72 0l-5.65 5.66a1 1 0 0 1-1.42 0l-5.65-5.66zm11.31-1.41a7 7 0 1 0-9.9 0L12 19.9l4.95-4.95zM12 14a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm0-2a2 2 0 1 0 0-4 2 2 0 0 0 0 4z" />
                  </svg>
                  {truncate(proj_desc, 28)}
                </div>
              </div>
            </div>
            <div className="flex gap-2 px-2 justify-center">
            <NavLink to={`/project-bazaar-src/project/${proj_pid}`} replace={true}>
              <button
                onClick={() => navigate(`/project/${proj_title}`)}
                className="flex-1 rounded-full bg-blue-600 dark:bg-blue-800 text-white font-bold hover:bg-blue-800 dark:hover:bg-blue-900 px-4 py-2"
              >
                View Project
              </button>
              </NavLink>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default ProjectCards;
