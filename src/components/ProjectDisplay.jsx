import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { getDocs, collection, query, where } from 'firebase/firestore';
import { db } from '../utils/creds';
import Loading from './Loading';
import { useUsers } from '../context/UserContext';

const getProjectByPid = async (pid) => {
  try {
    const q = query(collection(db, 'projects'), where('pid', '==', pid));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      const projectData = querySnapshot.docs.map(doc => doc.data());
      return projectData[0]; // Return the first matching project
    } else {
      //console.log('No project found with the given pid.');
      return null; // No project found
    }
  } catch (error) {
    console.error('Error fetching project: ', error);
    throw new Error('Failed to fetch project');
  }
};

const ProjectDisplay = () => {
  const { pid } = useParams();
  const [project, setProject] = useState(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [loading, setLoading] = useState(true);

  const { transformCloudinaryURL } = useUsers();

  // Fetch project on component mount
  useEffect(() => {
    const fetchProject = async () => {
      try {
        const projectData = await getProjectByPid(pid);
        setProject(projectData);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching project:', error);
        setLoading(false);
      }
    };

    fetchProject();
  }, [pid]);

  if (loading) {
    return <div><Loading /></div>;
  }

  if (!project) {
    return <div>No project found with the given pid.</div>;
  }

  const { title, description, tools, platform, price, media } = project;

  const handleNextSlide = () => {
    setCurrentSlide((prevSlide) => (prevSlide + 1) % media.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prevSlide) =>
      prevSlide === 0 ? media.length - 1 : prevSlide - 1
    );
  };

  // Function to check if the URL is a YouTube video
  const isYouTubeVideo = (url) => {
    return url.includes('youtube.com') || url.includes('youtu.be');
  };

  // Function to extract YouTube video ID from the URL
  const getYouTubeVideoId = (url) => {
    const match = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([a-zA-Z0-9_-]{11})/);
    return match ? match[1] : null;
  };

  // Function to autoplay the first YouTube video
  const autoplayFirstYouTube = () => {
    const firstYouTubeIndex = media.findIndex(isYouTubeVideo);
    if (firstYouTubeIndex !== -1) {
      setCurrentSlide(firstYouTubeIndex);
    }
  };

  return (
    <div className="flex flex-col items-center p-6 max-w-5xl mx-auto">
      {/* Slider */}
      <div className="relative w-full max-w-2xl">
        {media[currentSlide].includes("cloudinary") ? (
          <img
            src={transformCloudinaryURL(media[currentSlide])}
            alt={`Slide ${currentSlide + 1}`}
            className="w-full h-auto rounded-lg shadow-lg"
          />
        ) : isYouTubeVideo(media[currentSlide]) ? (
          // Render YouTube video if it's a YouTube URL
          <iframe
            src={`https://www.youtube.com/embed/${getYouTubeVideoId(media[currentSlide])}?autoplay=1`}
            title="YouTube video player"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; picture-in-picture"
            allowFullScreen
            className="w-5/6 flex justify-center h-72 rounded-md shadow-lg mx-auto"
          />
        ) : (
          // Render video for non-YouTube URLs
          <video
            autoFocus
            className="w-full h-auto rounded-lg shadow-lg"
            controls
          >
            <source src={media[currentSlide]} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        )}

        {/* Left Arrow */}
        <button
          onClick={handlePrevSlide}
          className="absolute top-1/2 left-1 bg-blue-700 text-white p-2 rounded-full shadow-md transform -translate-y-1/2"
        >
          &#8592;
        </button>
        {/* Right Arrow */}
        <button
          onClick={handleNextSlide}
          className="absolute top-1/2 right-1 bg-blue-700 text-white p-2 rounded-full shadow-md transform -translate-y-1/2"
        >
          &#8594;
        </button>
      </div>

      {/* Watch Demo Button */}
      <div>
        <button onClick={autoplayFirstYouTube}>
          <h3 className='text-blue-600 underline'>Watch Demo Video</h3>
        </button>
      </div>

      {/* Title */}
      <h2 className="text-3xl font-semibold mt-6 mb-4">Title: {title}</h2>

      {/* Description */}
      <p className="text-gray-600 text-lg mb-6">Description: {description}</p>

      {/* Tools and Platform */}
      <div className="mb-6">
        <p className="text-gray-800 font-medium">
          Tools Used: <span className="text-gray-600">{tools}</span>
        </p>
        <p className="text-gray-800 font-medium">
          Platform: <span className="text-gray-600">{platform}</span>
        </p>
      </div>

      {/* Price */}
      <p className="text-2xl font-bold text-green-600 mb-6">₹{price}</p>

      {/* Buy Button */}
      <button className="bg-blue-500 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-600 transition duration-200">
        Buy
      </button>
    </div>
  );
};

export default ProjectDisplay;
