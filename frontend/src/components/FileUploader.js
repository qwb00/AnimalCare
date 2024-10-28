// src/components/FileUploader.js

import React, { useState } from 'react';
import axios from 'axios';
import Button from './Button';
import { CLOUDINARY_UPLOAD_URL, CLOUDINARY_UPLOAD_PRESET } from '../cloudinaryConfig';

function FileUploader({ onUpload }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadSuccess, setUploadSuccess] = useState(false);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleUpload = async () => {
    if (!selectedFile) return;
  
    setIsUploading(true);
    const formData = new FormData();
    formData.append('file', selectedFile);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
  
    try {
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      const uploadedUrl = response.data.secure_url;
      onUpload(uploadedUrl); // Отправляем URL изображения в родительский компонент
      setUploadSuccess(true); // Устанавливаем флаг успешной загрузки
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
    } finally {
      setIsUploading(false);
    }
  };
  
  return (
    <div className="mb-2">
      <input
        type="file"
        accept="image/*"
        id="fileInput"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />
      <Button
        text={selectedFile ? selectedFile.name : 'Upload photo'}
        variant="white"
        icon="/icons/upload_photo.png"
        iconSize="w-4 h-4"
        iconPosition="right"
        className="h-8 border-2 border-black text-sm"
        onClick={() => document.getElementById('fileInput').click()}
        />

        {selectedFile && !uploadSuccess && (
        <Button
            text={isUploading ? 'Uploading...' : 'Confirm Upload'}
            variant="blue"
            className="h-8 border-2 border-main-blue text-sm ml-2"
            onClick={handleUpload}
            disabled={isUploading}
        />
        )}
    </div>
  );
}

export default FileUploader;
