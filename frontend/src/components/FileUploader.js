import React, { useState } from 'react';
import axios from 'axios';
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } from '../cloudinaryConfig';

function FileUploader({ onUpload, onStatusChange, buttonText = 'Upload Photo', buttonClassName = '', icon, iconSize = 'w-4 h-4', isButton = true }) {
    const [isUploading, setIsUploading] = useState(false);
    const [fileName, setFileName] = useState(buttonText);

    const handleFileChange = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        setIsUploading(true);
        setFileName(file.name); // Display selected file name on button
        onStatusChange && onStatusChange('uploading');

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);

        try {
            const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
                headers: { 'Content-Type': 'multipart/form-data' },
            });
            const uploadedUrl = response.data.secure_url;
            onUpload(uploadedUrl);

            setFileName(isButton ? file.name : buttonText); // Reset text depending on button type

            onStatusChange && onStatusChange('success');
        } catch (error) {
            console.error('Error uploading image to Cloudinary:', error);
            setFileName(buttonText);
            onStatusChange && onStatusChange('error');
        } finally {
            setIsUploading(false);
        }
    };

    return (
        <div>
            <input
                type="file"
                accept="image/*"
                id="fileInput"
                style={{ display: 'none' }}
                onChange={handleFileChange}
            />
            <button
                type="button"
                className={`${buttonClassName} ${isUploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => document.getElementById('fileInput').click()}
                disabled={isUploading}
            >
                {icon && <img src={icon} alt="Upload Icon" className={`${iconSize} mr-2 inline`} />}
                
                {isUploading 
                    ? (isButton 
                        ? 'Uploading...' 
                        : <div className="inline-block w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>) // Circular loading indicator
                    : (isButton ? fileName : buttonText)} {/* Display file name for button only */}
            </button>
        </div>
    );
}

export default FileUploader;
