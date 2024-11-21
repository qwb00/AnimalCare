import React from 'react';
import { format } from 'date-fns';
import Card from '../components/Card';
import Button from '../components/Button';

const PrescriptionCard = ({ prescription, onEdit }) => {
  console.log(prescription);
  // Форматируем даты для читабельности
  const formattedStartDate = format(new Date(prescription.start), "MMM d, yyyy");
  const formattedEndDate = format(new Date(prescription.end), "MMM d, yyyy");

  return (
    <Card
      title={`Prescription #${prescription.id}`}
      imageSrc={prescription.photo || "/icons/placeholder.png"}
      infoItems={[
        { label: "Animal", value: `${prescription.animalName} (${prescription.animalType || 'Unknown'})` },
        { label: "Medication", value: prescription.medication },
        { label: "Duration", value: `${formattedStartDate} - ${formattedEndDate}` },
        { label: "Type", value: prescription.type || "N/A" },
        { label: "Frequency", value: `${prescription.dailyDoseCount} per ${prescription.frequencyInWeeks}` },
        { label: "Description", value: prescription.description || "No description provided" },
        { label: "Diagnosis", value: prescription.diagnosis || "No diagnosis available" },
      ]}
      buttons={[
        {
          text: "Edit",
          variant: "white",
          icon: "/icons/pen.png", // Иконка редактирования
          iconSize: "h-4 w-4",
          onClick: () => onEdit(prescription.id),
          className: "px-4 py-2",
        },
      ]}
    />
  );
};

export default PrescriptionCard;
