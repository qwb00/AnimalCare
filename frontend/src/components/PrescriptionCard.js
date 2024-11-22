import React from 'react';
import { format } from 'date-fns';
import Card from '../components/Card';
import Button from '../components/Button';

const PrescriptionCard = ({ prescription, onEdit }) => {
  console.log(prescription);
  // Форматируем даты для читабельности
  const formattedStartDate = format(new Date(prescription.start), "MMM d, yyyy");
  const formattedEndDate = format(new Date(prescription.end), "MMM d, yyyy");

  const unitMapping = {
    0: "day",
    1: "week",
    2: "month",
    3: "year"
  };

  return (
    <Card
      title={`Prescription`}
      imageSrc={prescription.animalPhoto || "/icons/placeholder.png"}
      infoItems={[
        { label: "Animal", value: `${prescription.animalName} (${prescription.animalBreed || 'Unknown'})` },
        { label: "Medication", value: prescription.drug },
        { label: "Duration", value: `${formattedStartDate} - ${formattedEndDate}` },
        { label: "Frequency", value: `${prescription.count} per ${unitMapping[prescription.unit]}` },
        { label: "Description", value: prescription.description || "No description provided" },
        { label: "Diagnosis", value: prescription.diagnosis || "No diagnosis available" },
      ]}
      buttons={[
        {
          text: "Edit",
          variant: "white",
          icon: "/icons/pen.png", 
          iconSize: "h-4 w-4",
          onClick: () => onEdit(prescription.id),
          className: "px-4 py-2",
        },
      ]}
    />
  );
};

export default PrescriptionCard;
