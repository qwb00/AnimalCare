import React from 'react';
import Button from './Button';

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
        <div className="w-[28rem] p-6 border border-gray-200 rounded-lg shadow-md bg-white flex flex-col justify-between text-lg">
            <div className="flex items-start justify-between">
                <div className="space-y-4">
                    {/* Full Name */}
                    <div className="flex items-center">
                        <img src={icons.name} alt="Name Icon" className="h-7 w-7 mr-3" />
                        <div>
                            <h3 className="text-gray-500 font-semibold text-sm mb-1">Full Name</h3>
                            <p className="text-black font-medium text-base">{volunteer.name}</p>
                        </div>
                    </div>

                    {/* Phone Number */}
                    <div className="flex items-center">
                        <img src={icons.phone} alt="Phone Icon" className="h-7 w-7 mr-3" />
                        <div>
                            <p className="text-gray-500 text-sm">Phone Number</p>
                            <p className="text-black font-medium text-base">{volunteer.phoneNumber}</p>
                        </div>
                    </div>

                    {/* E-mail */}
                    <div className="flex items-center">
                        <img src={icons.email} alt="Email Icon" className="h-7 w-7 mr-3" />
                        <div>
                            <p className="text-gray-500 text-sm">E-mail</p>
                            <p className="text-black font-medium text-base">{volunteer.email}</p>
                        </div>
                    </div>
                </div>
                <img
                    src={volunteer.photo || placeholderImage}
                    alt="Volunteer"
                    className="w-28 h-28 rounded-full object-cover"
                />
            </div>
            <div className="mt-6 border-t border-gray-300 pt-5 flex justify-center gap-24">
                {isRequest ? (
                    <>
                        <Button
                            text="Delete"
                            variant="red"
                            icon={icons.cancel}
                            onClick={() => onDelete(volunteer.id)}
                            className="px-6 py-2.5 text-sm"
                        />
                        <Button
                            text="Approve"
                            variant="blue"
                            icon={icons.approve}
                            onClick={() => onApprove(volunteer.id)}
                            className="px-6 py-2.5 text-sm"
                        />
                    </>
                ) : (
                    <>
                        <Button
                            text="Delete"
                            variant="red"
                            icon={icons.cancel}
                            onClick={() => onDelete(volunteer.id)}
                            className="px-6 py-2.5 text-sm"
                        />
                        <Button
                            text="Unverify"
                            variant="yellow"
                            icon={icons.unverify}
                            onClick={() => onUnverify(volunteer.id)}
                            className="px-6 py-2.5 text-sm"
                        />
                    </>
                )}
            </div>
        </div>
    );
}

export default VolunteerCard;
