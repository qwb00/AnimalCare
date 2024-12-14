/*
* Mikhail Vorobev xvorob01
* Component for showing messages
*/

import React from 'react';

const extractErrorMessages = (errorData) => {
    const errorMessages = []; // Array to store the extracted error messages

    // Recursive function to traverse through nested error data
    const recursiveExtract = (data) => {
         // If the data is a string and doesn't contain irrelevant information, add it to errorMessages
        if (typeof data === 'string' && !data.startsWith('http') && !data.includes("traceId") && !data.includes("title")) {
            errorMessages.push(data);
        } 
        // If the data is an array, recursively process each item in the array 
        else if (Array.isArray(data)) {
            data.forEach((item) => recursiveExtract(item));
        } 
        // If the data is an object, recursively process each key-value pair, ignoring specific irrelevant keys
        else if (typeof data === 'object' && data !== null) {
            Object.entries(data).forEach(([key, value]) => {
                if (!["traceId", "type", "title", "status"].includes(key)) {
                    recursiveExtract(value);
                }
            });
        }
    };

    recursiveExtract(errorData);
    return errorMessages;
};

// Component to display extracted error messages
const ErrorMessages = ({ errorData }) => {
    const messages = extractErrorMessages(errorData);

    return (
        <div className="text-red-500 mb-4 text-sm">
            {messages.length > 0 ? (
                // If messages were extracted, display each message as a separate paragraph
                messages.map((message, index) => (
                    <p key={index}>{message}</p>
                ))
            ) : (
                <p>Unknown error occurred.</p>
            )}
        </div>
    );
};

export default ErrorMessages;
