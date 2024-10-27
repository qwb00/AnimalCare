import React from 'react';

function UserNav({ role }) {
    // Default to an empty role if undefined
    const normalizedRole = role.toLowerCase();

    // Define the visible menu items based on the role
    const menuItems = {
        administrator: ["General", "Volunteers", "Reservations", "Medical Treatments"],
        caretaker: ["General", "Volunteers", "Reservations", "Medical Treatments"],
        veterinarian: ["General", "Medical Treatments"],
        volunteer: ["General"],
    };

    // Get the menu items for the current role, or default to General
    const itemsToShow = menuItems[normalizedRole] || ["General"];

    return (
        <div className="flex space-x-8 mt-6 mb-8 ml-16 md:ml-24 xl:ml-36 text-gray-500 text-lg">
            {itemsToShow.includes("General") && (
                <span className="text-main-blue font-semibold border-b-2 border-main-blue cursor-pointer">
                    General
                </span>
            )}
            {itemsToShow.includes("Volunteers") && (
                <span className="cursor-pointer hover:text-main-blue">Volunteers</span>
            )}
            {itemsToShow.includes("Reservations") && (
                <span className="cursor-pointer hover:text-main-blue">Reservations</span>
            )}
            {itemsToShow.includes("Medical Treatments") && (
                <span className="cursor-pointer hover:text-main-blue">Medical Treatments</span>
            )}
        </div>
    );
}

export default UserNav;
