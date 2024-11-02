import React, {useEffect, useState} from 'react';
import { Link, useLocation  } from 'react-router-dom';

function UserNav({ role }) {
    // Default to an empty role if undefined
    const location = useLocation();
    const normalizedRole = role.toLowerCase();
    const [userID, setUserID] = useState(null);

    useEffect(() => {
        const storedUserID = sessionStorage.getItem('userID');
        if (storedUserID) {
            setUserID(storedUserID);
        }
    }, []);

    // Define the visible menu items based on the role
    const menuItems = {
        administrator: ["General", "Users", "Reservations", "Medical Treatments"],
        caretaker: ["General", "Volunteers", "Reservations", "Medical Treatments"],
        veterinarian: ["General", "Medical Treatments"],
        volunteer: ["General"],
    };

    // Get the menu items for the current role, or default to General
    const itemsToShow = menuItems[normalizedRole] || ["General"];

    const getLinkClass = (pathSegment) => {
        return location.pathname.includes(pathSegment)
            ? "text-main-blue font-semibold border-b-2 border-main-blue cursor-pointer"
            : "cursor-pointer hover:text-main-blue";
    };

    return (
        <div className="w-full max-w-[1024px] mx-auto flex space-x-8 mt-6 mb-8 text-gray-500 text-lg">
            {itemsToShow.includes("General") && (
                 <Link to={`/${userID}/general`} className={getLinkClass(`/general`)}>
                    General
                </Link>
            )}
            {itemsToShow.includes("Volunteers") && (
                <Link to={`/${userID}/volunteers`} className={getLinkClass(`/volunteers`)}>
                    Volunteers
                </Link>
            )}
            {itemsToShow.includes("Users") && (
                <Link to={`/${userID}/users`} className={getLinkClass(`/users`)}>
                    Users
                </Link>
            )}
            {itemsToShow.includes("Reservations") && (
                <Link to={`/${userID}/user-reservations`} className={getLinkClass(`/user-reservations`)}>
                    Reservations
                </Link>
            )}
            {itemsToShow.includes("Medical Treatments") && (
                <Link to={`/${userID}/veterinarian-examinations`} className={getLinkClass(`/veterinarian-examinations`)}>
                    Medical Treatments
                </Link>

            )}
        </div>
    );
}

export default UserNav;
