import React, { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { addDoc, collection, doc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { v4 as uuidv4 } from 'uuid';
import axios from 'axios';
import Loading from './Loading';
import { storage } from "../utils/creds";
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const ProjectForm = () => {
    const { register, handleSubmit, watch, reset } = useForm();
    const [preview, setPreview] = useState([]);
    const [allFiles, setAllFiles] = useState(null);
    const [isUploading, setIsUploading] = useState(false);
    const [uploadStatus, setUploadStatus] = useState(0);
    const { db, currentUser } = useAuth();
    const navigate = useNavigate();

    const media = watch('media'); // For image/video preview

    // Handle form submission
    const onSubmit = async (data) => {
        setIsUploading(true);
        try {
            // Ensure there are files or YouTube URLs to upload
            if (!allFiles && !data.youtubeURLs) {
                alert('Please upload some media files or provide YouTube URLs.');
                setIsUploading(false);
                return;
            }

            const pid = uuidv4(); // Generate a new project ID

            // Add initial project data without media to Firestore
            const projectRef = await addDoc(collection(db, 'projects'), {
                pid: pid,
                title: data.title,
                description: data.description,
                tools: data.tools,
                platform: data.platform,
                price: data.price,
                media: [] // Start with an empty media array
            });

            // Prepare file uploads
            const uploadPromises = allFiles
                ? allFiles.map(async (file) => {
                    if (file.type.startsWith('image')) {
                        // Handle image upload to Cloudinary
                        const cloudinaryURL = `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/upload`;
                        const formData = new FormData();
                        formData.append('file', file);
                        formData.append('upload_preset', 'userProfile'); 
                        const response = await axios.post(cloudinaryURL, formData, {
                            headers: {
                                'Content-Type': 'multipart/form-data',
                            },
                        });
                        return response.data.secure_url; 
                    } else if (file.type.startsWith('video')) {
                        // Handle video upload to Firebase Storage
                        const storageRef = ref(storage, `projects/${pid}/${file.name}`);
                        const uploadTask = uploadBytesResumable(storageRef, file);

                        return new Promise((resolve, reject) => {
                            uploadTask.on(
                                'state_changed',
                                (snapshot) => {
                                    const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                                    console.log('Upload progress:', progress);
                                    setUploadStatus(progress);
                                },
                                (error) => {
                                    console.error('Error uploading video:', error);
                                    reject(error);
                                },
                                async () => {
                                    const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                                    resolve(downloadURL); // Return the Firebase Storage URL for the video
                                }
                            );
                        });
                    }
                })
                : [];

            // Split YouTube URLs and add them to media if provided
            if (data.youtubeURLs) {
                const youtubeURLs = data.youtubeURLs.split(',').map((url) => url.trim());
                uploadPromises.push(...youtubeURLs); // Add YouTube URLs to the list of media
            }

            // Wait for all uploads to complete
            const uploadedMediaURLs = await Promise.all(uploadPromises);
            console.log('Uploaded media URLs:', uploadedMediaURLs);

            // Update the Firestore project document with the media URLs
            const projectDocRef = doc(db, 'projects', projectRef.id);
            await updateDoc(projectDocRef, {
                media: arrayUnion(...uploadedMediaURLs), // Push all media URLs (files + YouTube URLs) to the media array
            });

            setIsUploading(false);
            reset();
            alert('Project added successfully!');
        } catch (error) {
            console.error('Error adding project:', error);
            setIsUploading(false);
        }
    };

    // Handle media preview
    const handleMediaPreview = (event) => {
        const files = Array.from(event.target.files);
        setAllFiles(files); // Set the selected files

        const filePreviews = files.map((file) => ({
            url: URL.createObjectURL(file),
            type: file.type.startsWith('image') ? 'image' : 'video',
        }));

        setPreview(filePreviews);
    };

    useEffect(() => {
        console.log(currentUser);

        if (currentUser?.email !== import.meta.env.VITE_EMAIL) {
            navigate("/", { replace: true });
            console.log("Not Allowed");
        }
    }, [currentUser]);

    return (
        <div className="max-w-xl mt-6 border border-blue-400 mx-auto p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl text-center font-bold mb-4">Add New Project</h2>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Title */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Title</label>
                    <input
                        type="text"
                        {...register('title', { required: true })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Project Title"
                    />
                </div>

                {/* Description */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Description</label>
                    <textarea
                        {...register('description', { required: true })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Project Description"
                        rows="3"
                    />
                </div>

                {/* Media Upload (Images/Videos) */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Media (Images/Videos)</label>
                    <input
                        type="file"
                        {...register('media')}
                        accept="image/*,video/*"
                        multiple
                        onChange={handleMediaPreview}
                        className="mt-1 block w-full text-gray-500"
                    />
                </div>

                {/* YouTube URLs */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">YouTube Video URLs (separated by commas)</label>
                    <input
                        type="text"
                        {...register('youtubeURLs')}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="https://youtube.com/video1, https://youtube.com/video2"
                    />
                </div>

                {/* Media Preview */}
                {preview.length > 0 && (
                    <div className="flex flex-wrap gap-4 mt-4">
                        {preview.map((media, index) => (
                            <div key={index} className="w-32 h-32 overflow-hidden border">
                                {media.type === 'image' ? (
                                    <img src={media.url} alt="Preview" className="w-full h-full object-cover" />
                                ) : (
                                    <video autoPlay controls className="h-full w-full object-cover">
                                        <source src={media.url} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                )}
                            </div>
                        ))}
                    </div>
                )}

                {/* Tools Used */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Tools Used</label>
                    <input
                        type="text"
                        {...register('tools', { required: true })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="React, Firebase, etc."
                    />
                </div>

                {/* Platform */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Platform</label>
                    <select
                        {...register('platform', { required: true })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="web">Web</option>
                        <option value="app">App</option>
                    </select>
                </div>

                {/* Price */}
                <div>
                    <label className="block text-sm font-medium text-gray-700">Price (in Rs.)</label>
                    <input
                        type="number"
                        {...register('price', { required: true })}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        placeholder="Price in Rs."
                    />
                </div>

                {/* Submit Button */}
                <button
                    type="submit"
                    disabled={isUploading}
                    className="w-full py-2 px-4 bg-blue-500 text-white font-semibold rounded-md hover:bg-blue-600 transition duration-300"
                >
                    Add Project
                    <span>{isUploading && <Loading type="spin" color="white"  />}</span>
                </button>
            </form>
            <h3 className='text-center text-2xl text-green-600'>{uploadStatus}%</h3>
        </div>
    );
};

export default ProjectForm;
