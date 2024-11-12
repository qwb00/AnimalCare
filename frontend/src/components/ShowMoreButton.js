import React from 'react';

function ShowMoreButton({ onClick }) {
    return (
        <div className="flex justify-center my-4">
            <button
                onClick={onClick}
                className="w-20 h-8 border-2 border-main-blue text-main-blue rounded-full hover:bg-light-blue"
            >
                <span className="text-lg font-bold">...</span>
            </button>
        </div>
    );
}

export default ShowMoreButton;
