/*
* Author: Mikhail Vorobev xvorob01
* Component for show medical treatment card
*/

import React, { useState } from 'react';
import Card from '../components/Card';
import API_BASE_URL from '../config';
import ErrorMessages from '../components/ErrorMessages';

// Define the different examination statuses with numeric codes for clarity and consistency.
const ExaminationStatus = {
  InProgress: 0,
  Completed: 1,
  NotDecided: 2,
  Cancelled: 3,
};

const RequestCard = ({
                       request,
                       showActions,
                       onApprove,
                       onDecline,
                       onDelete,
                       onConfirm,
                     }) => {
  const token = sessionStorage.getItem('token');

  // Maintain the state of the final diagnosis (for when the examination is in progress)
  const [finalDiagnosis, setFinalDiagnosis] = useState(
      request.finalDiagnosis || ''
  );

  const [errorData, setErrorData] = useState(null);

   // Handle approving a request: sets the examination status to InProgress
  const handleApprove = async () => {
    try {
      const response = await fetch(
          `${API_BASE_URL}/examinations/${request.id}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json-patch+json',
            },
            body: JSON.stringify([
              { op: 'replace', path: '/status', value: ExaminationStatus.InProgress },
            ]),
          }
      );
      if (response.ok) {
        onApprove(request.id);
      } else {
        console.error('Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
    }
  };

  // Handle declining a request: sets the examination status to Cancelled
  const handleDecline = async () => {
    try {
      const response = await fetch(
          `${API_BASE_URL}/examinations/${request.id}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json-patch+json',
            },
            body: JSON.stringify([
              { op: 'replace', path: '/status', value: ExaminationStatus.Cancelled },
            ]),
          }
      );
      if (response.ok) {
        onDecline(request.id);
      } else {
        console.error('Failed to decline request');
      }
    } catch (error) {
      console.error('Error declining request:', error);
    }
  };

  // Handle deleting a request (available only to the caretaker if the request is cancelled)
  const handleDelete = async () => {
    try {
      const response = await fetch(
          `${API_BASE_URL}/examinations/${request.id}`,
          {
            method: 'DELETE',
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
      );
      if (response.ok) {
        onDelete(request.id);
      } else {
        console.error('Failed to delete request');
      }
    } catch (error) {
      console.error('Error deleting request:', error);
    }
  };

   // Handle confirming the final diagnosis: sets the status to Completed and updates the finalDiagnosis
  const handleConfirm = async () => {
    if (!finalDiagnosis.trim()) {
      alert('Final diagnosis cannot be empty.');
      return;
    }
    try {
      const patchData = [
        { op: 'replace', path: '/finalDiagnosis', value: finalDiagnosis },
        { op: 'replace', path: '/status', value: ExaminationStatus.Completed },
      ];
      const response = await fetch(
          `${API_BASE_URL}/examinations/${request.id}`,
          {
            method: 'PATCH',
            headers: {
              Authorization: `Bearer ${token}`,
              'Content-Type': 'application/json-patch+json',
            },
            body: JSON.stringify(patchData),
          }
      );
      if (response.ok) {
        onConfirm(request.id, finalDiagnosis);
      } else {
        const errorResponse = await response.json();
        setErrorData(errorResponse);
        return;
      }
    } catch (error) {
      console.error('Error confirming request:', error);
    }
  };

  // Determine the status text based on the status code
  const statusText =
      request.status === ExaminationStatus.InProgress
          ? 'In Progress'
          : request.status === ExaminationStatus.Completed
              ? 'Completed'
              : request.status === ExaminationStatus.Cancelled
                  ? 'Declined'
                  : request.status === ExaminationStatus.NotDecided
                      ? 'Not Decided'
                      : 'Unknown';

  const statusColor =
      request.status === ExaminationStatus.InProgress
          ? 'text-blue-500'
          : request.status === ExaminationStatus.Completed
              ? 'text-green-500'
              : request.status === ExaminationStatus.Cancelled
                  ? 'text-red-500'
                  : request.status === ExaminationStatus.NotDecided
                      ? 'text-yellow-500'
                      : 'text-gray-500';

  let buttons = [];
  // Determine which action buttons should appear on the card based on the user's role and the request status
  if (showActions === 'Veterinarian' && request.status === ExaminationStatus.NotDecided) {
    // For veterinarians: Approve or Decline when status is NotDecided
    buttons = [
      {
        text: 'Decline',
        variant: 'red',
        icon: '/icons/cancel_white.png',
        onClick: handleDecline,
        className: 'px-5 py-2',
      },
      {
        text: 'Approve',
        variant: 'blue',
        icon: '/icons/confirm_white.png',
        onClick: handleApprove,
        className: 'px-5 py-2',
      },
    ];
  } else if (
      showActions === 'InProgress' &&
      request.status === ExaminationStatus.InProgress
  ) {
    // For veterinarians: Confirm the final diagnosis when status is InProgress
    buttons = [
      {
        text: 'Confirm',
        variant: 'blue',
        icon: '/icons/confirm_white.png',
        onClick: handleConfirm,
        className: 'px-5 py-2',
      },
    ];
  } else if (showActions === 'Caretaker' && request.status === ExaminationStatus.Cancelled) {
    buttons = [
      {
        text: 'Delete',
        variant: 'red',
        icon: '/icons/cancel_white.png',
        onClick: handleDelete,
        className: 'px-5 py-2',
      },
    ];
  }

  const infoItems = [
    ...(showActions === 'Caretaker'
      ? [{ label: 'Veterinarian', value: request.veterinarianName }]
      : []),
    {
      label: 'Date',
      value: new Date(request.examinationDate).toLocaleDateString(),
    },
    {
      label: 'Type',
      value:
          request.type === 0 ? 'Planned treatment' : 'Emergency treatment',
    },
    { label: 'Description', value: request.description },
    { label: 'Status', value: statusText, customClass: statusColor },
  ];

  if (request.status === ExaminationStatus.Completed) {
    infoItems.push({
      label: 'Final Diagnosis',
      value: request.finalDiagnosis,
      customClass: 'text-green-500',
    });
  }

  return (
      <Card
          title={`Request for ${request.animalName} (${request.animalBreed})`}
          imageSrc={request.animalPhoto || '/icons/placeholder.png'}
          infoItems={infoItems}
          buttons={buttons}
      >
        {errorData && <ErrorMessages errorData={errorData} />}
        {showActions === 'InProgress' &&
            request.status === ExaminationStatus.InProgress && (
                <div className="mt-4">
                  <label className="block text-gray-700 font-semibold mb-2">
                    Final Diagnosis:
                  </label>
                  <textarea
                      className="w-3/4 p-2 border-2 border-light-blue rounded-md resize-y focus:border-main-blue outline-none"
                      placeholder="Enter final diagnosis"
                      value={finalDiagnosis}
                      onChange={(e) => setFinalDiagnosis(e.target.value)}
                  />
                </div>
            )}
      </Card>
  );
};

export default RequestCard;
