import React, { useState } from "react";
import axios from "axios";
import {
  CLOUDINARY_UPLOAD_URL,
  CLOUDINARY_UPLOAD_PRESET,
} from "../cloudinaryConfig";

// FileUploader component for uploading images to Cloudinary
function FileUploader({
  onUpload,             // Callback function triggered after a successful upload, receives the uploaded file URL
  onStatusChange,       // Callback function to report the status of the upload (e.g., "uploading", "success", "error")
  buttonText = "Upload Photo", // Default button text if no file is selected
  buttonClassName = "", // CSS class for styling the button
  icon,                 // Optional icon displayed on the button
  iconSize = "w-4 h-4", // Size of the icon if provided
  isButton = true,      // Determines if the component should display as a button or as a circular loading indicator
}) {
  // State to track if the file is currently uploading
  const [isUploading, setIsUploading] = useState(false);
  // State to store the displayed file name on the button
  const [fileName, setFileName] = useState(buttonText);

  // Function to handle file selection and uploading
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return; // Exit if no file is selected

    setIsUploading(true); // Set uploading state
    setFileName(file.name); // Display selected file name on button
    onStatusChange && onStatusChange("uploading"); // Notify about upload status

    // Prepare form data for uploading
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

    try {
      // Send the file to Cloudinary using Axios
      const response = await axios.post(CLOUDINARY_UPLOAD_URL, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      const uploadedUrl = response.data.secure_url; // Extract the uploaded file URL
      onUpload(uploadedUrl); // Trigger onUpload callback with the file URL

      // Reset button text after successful upload
      setFileName(isButton ? file.name : buttonText);
      onStatusChange && onStatusChange("success"); // Notify about successful upload
    } catch (error) {
      console.error("Error uploading image to Cloudinary:", error);
      setFileName(buttonText); // Reset button text if upload failed
      onStatusChange && onStatusChange("error"); // Notify about upload error
    } finally {
      setIsUploading(false); // End uploading state
    }
  };

  return (
    <div>
      {/* Hidden file input field to trigger file selection dialog */}
      <input
        type="file"
        accept="image/*"
        id="fileInput"
        style={{ display: "none" }}
        onChange={handleFileChange}
      />
      {/* Button to trigger file input and show uploading status */}
      <button
        type="button"
        className={`${buttonClassName} ${
          isUploading ? "opacity-50 cursor-not-allowed" : ""
        }`} // Apply additional styles if uploading
        onClick={() => document.getElementById("fileInput").click()} // Trigger file input click on button click
        disabled={isUploading} // Disable button while uploading
      >
        {icon && (
          // Display icon if provided
          <img
            src={icon}
            alt="Upload Icon"
            className={`${iconSize} mr-2 inline`}
          />
        )}
        {isUploading ? (
          isButton ? (
            "Uploading..."
          ) : (
            // Show circular loading indicator if not a button style
            <div className="inline-block w-4 h-4 border-2 border-main-blue border-t-transparent rounded-full animate-spin"></div>
          )
        ) : isButton ? (
          fileName // Show selected file name if button style
        ) : (
          buttonText // Show default button text otherwise
        )}{" "}
      </button>
    </div>
  );
}

export default FileUploader;
