import React from 'react';
import Card from '../components/Card';
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

  const statusText = request.status === 1 ? "In Progress" : request.status === 0 ? "Completed" : "Declined";
  const statusColor = request.status === 1 ? "text-blue-500" : request.status === 0 ? "text-green-500" : "text-red-500";

  return (
    <Card
      title={`Request for ${request.animalName} (${request.animalBreed})`}
      imageSrc={request.animalPhoto || "/icons/placeholder.png"}
      infoItems={[
        { label: "Veterinarian", value: request.veterinarianName },
        { label: "Date", value: new Date(request.examinationDate).toLocaleDateString() },
        { label: "Type", value: request.type === 0 ? "Planned treatment" : "Emergency treatment" },
        { label: "Description", value: request.description },
        { label: "Status", value: statusText, customClass: statusColor },
        { label: "Final Diagnosis", value: request.finalDiagnosis, customClass: "text-green-500" },
      ]}
      buttons={
        showActions === 'Veterinarian'
          ? [
              { text: 'Decline', variant: 'red', icon: '/icons/cancel_white.png', onClick: handleDecline, className: 'px-5 py-2' },
              { text: 'Approve', variant: 'blue', icon: '/icons/confirm_white.png', onClick: handleApprove, className: 'px-5 py-2' },
            ]
          : showActions === 'Caretaker' && request.status === 2
          ? [
              { text: 'Delete', variant: 'red', icon: '/icons/cancel_white.png', onClick: handleDelete, className: 'px-5 py-2' },
            ]
          : []
      }
    />
  );
};

export default RequestCard;
