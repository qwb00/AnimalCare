import React from 'react';
import Button from '../components/Button';

const RequestCard = ({ request }) => {
  return (
    <div className="border rounded-lg p-6 shadow-lg bg-white w-full max-w-md mx-auto hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img src="/icons/request_icon.svg" alt="Request Icon" className="w-6 h-6 mr-2" />
          <h3 className="font-bold text-lg">Request</h3>
        </div>
      </div>
      
      <div className="flex items-center space-x-4 mb-4">
        <img src={request.animalPhoto} alt={request.animalName} className="w-20 h-20 rounded-lg object-cover" />
        <div>
          <p className="text-gray-400 text-sm">Animal</p>
          <p className="font-semibold text-lg">{request.animalName} <span className="text-gray-500">({request.animalBreed})</span></p>
        </div>
      </div>
      
      <div className="text-gray-700 mb-4 space-y-2 text-sm">
        <p><span className="font-semibold">Veterinarian:</span> {request.veterinarianName}</p>
        <p><span className="font-semibold">Date:</span> {new Date(request.examinationDate).toLocaleDateString()}</p>
        <p><span className="font-semibold">Type:</span> {request.type === 0 ? "Planned treatment" : "Emergency treatment"}</p>
        <p><span className="font-semibold">Description:</span> {request.description}</p>
        <p><span className="font-semibold">Status:</span> <span className={`${request.status === 1 ? "text-blue-500" : "text-green-500"} font-semibold`}>
          {request.status === 1 ? "In progress" : "Completed"}
        </span></p>
        <p><span className="font-semibold">Final diagnosis:</span> <span className="text-green-500 font-semibold">{request.finalDiagnosis}</span></p>
      </div>
      
      <div className="flex justify-between mt-4">
        <Button text="Decline" variant="red" className="w-5/12" />
        <Button text="Approve" variant="blue" className="w-5/12" />
      </div>
    </div>
  );
};

export default RequestCard;

