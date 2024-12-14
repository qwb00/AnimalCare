/*
* Mikhail Vorobev xvorob01
* Component for show prescription in list form
*/

import React from 'react';
import { format } from 'date-fns';
import ListItem from '../components/ListItem';

const PrescriptionCard = ({ prescription }) => {
    const formattedStartDate = format(new Date(prescription.start), "MMM d, yyyy");
    const formattedEndDate = format(new Date(prescription.end), "MMM d, yyyy");

    const unitMapping = {
        0: "day",
        1: "week",
        2: "month",
        3: "year"
    };

    return (
        <ListItem
            title="Prescription"
            infoItems={[
                { label: "Animal", value: `${prescription.animalName} (${prescription.animalBreed || 'Unknown'})` },
                { label: "Medication", value: prescription.drug },
                { label: "Duration", value: `${formattedStartDate} - ${formattedEndDate}` },
                { label: "Frequency", value: `${prescription.count} per ${unitMapping[prescription.unit]}` },
                { label: "Description", value: prescription.description || "No description provided" },
                { label: "Diagnosis", value: prescription.diagnosis || "No diagnosis available" },
            ]}
        />
    );
};

export default PrescriptionCard;