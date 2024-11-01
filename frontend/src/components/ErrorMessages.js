import React from 'react';

const extractErrorMessages = (errorData) => {
    const errorMessages = [];

    const recursiveExtract = (data) => {
        if (typeof data === 'string' && !data.startsWith('http') && !data.includes("traceId") && !data.includes("title")) {
            errorMessages.push(data);
        } else if (Array.isArray(data)) {
            data.forEach((item) => recursiveExtract(item));
        } else if (typeof data === 'object' && data !== null) {
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

const ErrorMessages = ({ errorData }) => {
    const messages = extractErrorMessages(errorData);

    return (
        <div className="text-red-500 mb-4 text-sm">
            {messages.length > 0 ? (
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
