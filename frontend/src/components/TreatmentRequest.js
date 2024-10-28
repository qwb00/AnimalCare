import React from 'react';
import Button from '../components/Button';
import API_BASE_URL from '../config';

const RequestCard = ({ request, showActions, onApprove, onDecline, onDelete }) => {
  const token = sessionStorage.getItem('token');

  const handleApprove = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/examinations/${request.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify([{ op: "replace", path: "/status", value: 0 }]),
      });
      if (response.ok) {
        onApprove(request.id);
      } else {
        console.error('Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  const handleDecline = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/examinations/${request.id}`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json-patch+json',
        },
        body: JSON.stringify([{ op: "replace", path: "/status", value: 2 }]),
      });
      if (response.ok) {
        onDecline(request.id);
      } else {
        console.error('Failed to decline request');
      }
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/examinations/${request.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });
      if (response.ok) {
        onDelete(request.id);
      } else {
        console.error('Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

  return (
    <div className="w-[38rem] p-6 border border-gray-200 rounded-lg shadow-md bg-white flex flex-col justify-between text-lg">
      <div className="flex items-start justify-between">
        <div className="space-y-5 w-3/4"> {/* Увеличены отступы и ширина текста */}
          {/* Request Information */}
          <div className="flex items-center">
            <img src="/icons/request.png" alt="Request Icon" className="h-8 w-8 mr-4" />
            <div>
              <h3 className="text-gray-500 font-semibold text-base mb-1">Request</h3>
              <p className="text-black font-medium text-lg">{request.animalName} ({request.animalBreed})</p>
            </div>
          </div>

          {/* Veterinarian */}
          <div>
            <p className="text-gray-500 text-sm">Veterinarian</p>
            <p className="text-black font-medium text-lg">{request.veterinarianName}</p>
          </div>

          {/* Date */}
          <div>
            <p className="text-gray-500 text-sm">Date</p>
            <p className="text-black font-medium text-lg">{new Date(request.examinationDate).toLocaleDateString()}</p>
          </div>

          {/* Type */}
          <div>
            <p className="text-gray-500 text-sm">Type</p>
            <p className="text-black font-medium text-lg">{request.type === 0 ? "Planned treatment" : "Emergency treatment"}</p>
          </div>

          {/* Description */}
          <div>
            <p className="text-gray-500 text-sm">Description</p>
            <p className="text-black font-medium text-lg">{request.description}</p>
          </div>

          {/* Status */}
          <div>
            <p className="text-gray-500 text-sm">Status</p>
            <p className={`font-medium text-lg ${request.status === 1 ? "text-blue-500" : request.status === 0 ? "text-green-500" : "text-red-500"}`}>
              {request.status === 1 ? "In Progress" : request.status === 0 ? "Completed" : "Declined"}
            </p>
          </div>

          {/* Final Diagnosis */}
          <div>
            <p className="text-gray-500 text-sm">Final Diagnosis</p>
            <p className="text-green-500 font-medium text-lg">{request.finalDiagnosis}</p>
          </div>
        </div>

        {/* Animal Image */}
        <img
          src={request.animalPhoto || "/icons/placeholder.png"}
          alt="Animal"
          className="w-36 h-36 rounded-full object-cover ml-6" // Увеличено изображение
        />
      </div>

      {/* Action Buttons */}
      <div className="mt-6 border-t border-gray-300 pt-5 flex justify-center gap-12">
        {showActions === 'Veterinarian' && (
          <>
            <Button
              text="Decline"
              variant="red"
              icon="/icons/cancel_white.png"
              onClick={handleDecline}
              className="px-8 py-3 text-base"
            />
            <Button
              text="Approve"
              variant="blue"
              icon="/icons/confirm_white.png"
              onClick={handleApprove}
              className="px-8 py-3 text-base"
            />
          </>
        )}
        {showActions === 'Caretaker' && request.status === 2 && (
          <Button
            text="Delete"
            variant="red"
            icon="/icons/cancel_white.png"
            onClick={handleDelete}
            className="px-8 py-3 text-base"
          />
        )}
      </div>
    </div>
  );
};

export default RequestCard;

