import React from 'react';
import Button from './Button';

const icons = {
    volunteer: '/icons/name.png',
    animal: '/icons/breed.png',
    date: '/icons/calendar_black.png',
    time: '/icons/time.png',
    placeholder: '/icons/name.png',
    decline: '/icons/cancel_white.png',
    approve: '/icons/confirm_white.png',
    walk: '/icons/walk.png',
};

function UserReservationCard({ reservation, onApprove, onDecline, onDelete, isNewRequest }) {
    // Format the date and time
    const reservationDate = new Date(reservation.reservationDate).toLocaleDateString();
    const startTime = reservation.startTime.slice(0, 5); // Only HH:MM
    const endTime = reservation.endTime.slice(0, 5); // Only HH:MM
    const timeRange = `${startTime} - ${endTime}`;

    return (
        <div className="border p-7 rounded-lg shadow-sm w-full max-w-md bg-white flex flex-col justify-between">
            {/* Title with Animal Name and Date */}
            <h3 className="text-xl font-semibold flex items-start mb-3">
                <span role="img" aria-label="walk" className="mr-2">
                    <img src={icons.walk} alt="Walk Icon" className="h-6 w-6 mr-0"/>
                </span> Walk with {reservation.animalName} on {reservationDate}
            </h3>
            <hr className="my-2" />
            <div className="flex items-start justify-between">
                {/* Information Section */}
                <div className="space-y-3">
                    {/* Volunteer Info */}
                    <div className="flex items-center">
                        <img src={icons.volunteer} alt="Volunteer Icon" className="h-6 w-6 mr-2" />
                        <div>
                            <p className="text-gray-500">Volunteer</p>
                            <p className="text-gray-700 font-semibold">{reservation.volunteerName}</p>
                        </div>
                    </div>
                    {/* Animal Info */}
                    <div className="flex items-center">
                        <img src={icons.animal} alt="Animal Icon" className="h-6 w-6 mr-2" />
                        <div>
                            <p className="text-gray-500">Animal</p>
                            <p className="text-gray-700 font-semibold">{reservation.animalName} ({reservation.animalBreed})</p>
                        </div>
                    </div>
                    {/* Date Info */}
                    <div className="flex items-center">
                        <img src={icons.date} alt="Date Icon" className="h-6 w-6 mr-2" />
                        <div>
                            <p className="text-gray-500">Date</p>
                            <p className="text-gray-700 font-semibold">{reservationDate}</p>
                        </div>
                    </div>
                    {/* Time Info */}
                    <div className="flex items-center">
                        <img src={icons.time} alt="Time Icon" className="h-6 w-6 mr-2" />
                        <div>
                            <p className="text-gray-500">Time</p>
                            <p className="text-gray-700 font-semibold">{timeRange}</p>
                        </div>
                    </div>
                </div>

                {/* Volunteer Photo on the right, centered with respect to the content */}
                <div className="flex-shrink-0 flex items-center ml-4">
                    <img
                        src={reservation.volunteerphoto || icons.placeholder}
                        alt="Volunteer"
                        className="w-24 h-24 rounded-2xl object-cover"
                    />
                </div>
            </div>
            <hr className="my-3" />

            {/* Buttons Section */}
            <div className="flex justify-center gap-16">
                {isNewRequest ? (
                    <>
                        <Button
                            text="Decline"
                            variant="red"
                            icon={icons.decline}
                            onClick={() => onDecline(reservation.id)}
                            className="px-5 py-2"
                        />
                        <Button
                            text="Approve"
                            variant="blue"
                            icon={icons.approve}
                            onClick={() => onApprove(reservation.id)}
                            className="px-5 py-2"
                        />
                    </>
                ) : (
                    <Button
                        text="Delete"
                        variant="red"
                        icon={icons.decline}
                        onClick={() => onDelete(reservation.id)}
                        className="px-5 py-2 w-full"
                    />
                )}
            </div>
        </div>
    );
}

export default UserReservationCard;
