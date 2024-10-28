import React from 'react';

function VolunteerCard({ volunteer, onApprove, onUnverify, onDelete, isRequest }) {
    const placeholderImage = "/icons/name.png"; // Path to the placeholder image
    const icons = {
        name: "/icons/name.png",
        phone: "/icons/phone.png",
        email: "/icons/e-mail.png",
        cancel: "/icons/cancel_white.png",
        approve: "/icons/confirm_white.png",
        unverify: "/icons/unverify_white.png"
    };

    return (
        <div className="w-[30rem] p-8 border border-gray-200 rounded-lg shadow-md bg-white flex flex-col justify-between text-xl">
            <div className="flex items-start justify-between">
                <div className="space-y-6">
                    {/* Full Name */}
                    <div className="flex items-center">
                        <img src={icons.name} alt="Name Icon" className="h-8 w-8 mr-3" />
                        <div>
                            <h3 className="text-gray-500 font-semibold mb-1">Full Name</h3>
                            <p className="text-black font-medium text-lg">{volunteer.name}</p>
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="flex items-center">
                        <img src={icons.phone} alt="Phone Icon" className="h-8 w-8 mr-3" />
                        <div>
                            <p className="text-gray-500">Phone Number</p>
                            <p className="text-black font-medium text-lg">{volunteer.phoneNumber}</p>
                        </div>
                    </div>

                    {/* E-mail */}
                    <div className="flex items-center">
                        <img src={icons.email} alt="Email Icon" className="h-8 w-8 mr-3" />
                        <div>
                            <p className="text-gray-500">E-mail</p>
                            <p className="text-black font-medium text-lg">{volunteer.email}</p>
                        </div>
                    </div>
                </div>
                <img
                    src={volunteer.photo || placeholderImage}
                    alt="Volunteer"
                    className="w-24 h-24 rounded-full object-cover"
                />
            </div>
            <div className="mt-6 border-t border-gray-300 pt-6 flex justify-between">
                {isRequest ? (
                    <>
                        <button
                            onClick={() => onDelete(volunteer.id)}
                            className="flex items-center justify-center px-6 py-2 bg-red-500 text-white border border-red-500 rounded-lg text-lg"
                        >
                            <img src={icons.cancel} alt="Cancel Icon" className="h-6 w-6 mr-2"/>
                            Delete
                        </button>
                        <button
                            onClick={() => onApprove(volunteer.id)}
                            className="flex items-center justify-center px-6 py-2 text-white bg-main-blue rounded-lg text-lg"
                        >
                            <img src={icons.approve} alt="Approve Icon" className="h-6 w-6 mr-2"/>
                            Approve
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => onDelete(volunteer.id)}
                            className="flex items-center justify-center px-6 py-2 text-white bg-red-500 rounded-lg text-lg"
                        >
                            <img src={icons.cancel} alt="Delete Icon" className="h-6 w-6 mr-2"/>
                            Delete
                        </button>

                        <button
                            onClick={() => onUnverify(volunteer.id)}
                            className="flex items-center justify-center px-6 py-2 text-white bg-yellow-500 rounded-lg text-lg"
                        >
                            <img src={icons.unverify} alt="Unverify Icon" className="h-6 w-6 mr-2"/>
                            Unverify
                        </button>
                    </>
                )}
            </div>
        </div>
    );
}

export default VolunteerCard;
