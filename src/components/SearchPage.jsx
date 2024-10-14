import React, { useState, useEffect } from 'react';
import { getFirestore, query, where, getDocs, collection, orderBy, limit } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';
import { useDebounce } from './Debounce';
import { NavLink } from 'react-router-dom';
import { useUsers } from '../context/UserContext';

const SearchPage = () => {
  const { db } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [projectSearchResults, setProjectSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [show, setShow] = useState(false);
  const {isSearchOpen, setIsSearchOpen} = useUsers(); // State for controlling search overlay


  const [debouncedSearch] = useDebounce(searchTerm);

  const highlightText = (text, searchTerm) => {
    if (!searchTerm) return text;
    const parts = text.split(new RegExp(`(${searchTerm})`, 'gi')); // Split by the search term, case-insensitive
    return parts.map((part, index) =>
      part.toLowerCase() === searchTerm.toLowerCase() ? (
        <span key={index} className="text-blue-500">{part}</span>
      ) : (
        part
      )
    );
  };

  useEffect(() => {
    const searchProjects = async () => {
      if (!debouncedSearch || searchTerm === "") {
        setProjectSearchResults([]);
        return;
      }
      setLoading(true);

      // Query Firestore to find projects with titles that match the search term
      const q = query(
        collection(db, 'projects'),
        orderBy('title'),
        limit(50)
      );

      const querySnapshot = await getDocs(q);
      const allProjects = querySnapshot.docs.map((doc) => doc.data());

      // Filter projects by matching the title with the search term (case-insensitive)
      const filteredProjects = allProjects.filter((project) =>
        project.title.toLowerCase().includes(debouncedSearch.toLowerCase())
      );

      setProjectSearchResults(filteredProjects);
      setLoading(false);
      setShow(true);
    };

    searchProjects();
  }, [debouncedSearch, db]);

  return (
    <div className="max-w-md mx-auto bg-white   p-6 mt-0 ">
      {/* <h2 className="text-2xl font-semibold text-center text-gray-800 mb-4">Search Projects</h2> */}
      <div className="flex flex-col space-y-2">
        <div className="relative">
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              if (e.target.value === "") {
                setShow(false);
              }
            }}
            className="w-full rounded-lg px-3 py-2 bg-gray-100 text-gray-800 outline-none focus:ring-2 ring-2 ring-blue-900 focus:ring-blue-500 focus:ring-opacity-50 shadow-sm"
            placeholder="Search Projects...🔍"
          />
        </div>
        {loading ? (
          <div className="text-center">Loading...</div>
        ) : (
          <div className="mt-4">
            {/* <h3 className="text-lg font-semibold">Projects</h3> */}
            <div className="flex flex-wrap gap-3 justify-start text-center">
              {projectSearchResults.length > 0 ? (
                projectSearchResults.map((project) => (
                    <NavLink key={project} to={`/project-bazaar-src/project/${project.pid}`} onClick={()=>{
                        setIsSearchOpen(false)
                    }}>
                  <div key={project.pid} className="rounded-lg w-60 h-auto flex flex-col justify-start items-start px-3 py-2 bg-gray-100 hover:bg-gray-200 shadow-sm">
                    <div className="font-medium text-blue-500 mb-1">
                      {highlightText(project.title, debouncedSearch)}
                    </div>
                  </div>
                  </NavLink>
                ))
              ) : (
                show && (
                  <div className="text-gray-500 w-full text-center">
                    No projects found matching "{debouncedSearch}".
                  </div>
                )
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchPage;
