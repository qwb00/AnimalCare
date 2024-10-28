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
        body: JSON.stringify([{ op: "replace", path: "/status", value: 0 }]) // Обновляем статус на "Completed"
      });
      if (response.ok) {
        onApprove(request.id); // Сообщаем об успешном обновлении
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
        body: JSON.stringify([{ op: "replace", path: "/status", value: 2 }]) 
      });
      if (response.ok) {
        onDecline(request.id); 
      } else {
        console.error('Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
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
    <div className="border rounded-lg p-6 shadow-lg bg-white w-full max-w-md mx-auto hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center">
          <img src="/icons/request.png" alt="Request Icon" className="w-6 h-6 mr-2" />
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
        <p><span className="font-semibold">Status:</span> 
          <span className={`${request.status === 1 ? "text-blue-500" : request.status === 0 ? "text-green-500" : "text-red-500"} font-semibold`}>
            {request.status === 1 ? " In Progress" : request.status === 0 ? " Completed" : " Declined"}
          </span>
        </p>
        <p><span className="font-semibold">Final diagnosis:</span> <span className="text-green-500 font-semibold">{request.finalDiagnosis}</span></p>
      </div>
      
      {showActions === 'Veterinarian' && (
          <div className="flex justify-between mt-4">
              <Button text="Decline" variant="red" className="w-1/2 mr-2" onClick={handleDecline}/>
              <Button text="Approve" variant="blue" className="w-1/2 ml-2" onClick={handleApprove}/>
          </div>
       )}
      {showActions === 'Caretaker' && request.status === 2 && (
        <div className="flex justify-end mt-4">
          <Button text="Delete" variant="red" onClick={handleDelete} />
        </div>
      )}
    </div>
  );
};

export default RequestCard;

