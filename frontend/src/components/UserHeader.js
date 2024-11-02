import React from 'react';

function UserHeader({ user }) {
    const roleStyles = {
        administrator: {
            backgroundColor: '#B872FF',
            borderColor: '#200E32',
            textColor: '#000000',
        },
        volunteer: {
            backgroundColor: '#D2FFCB',
            borderColor: '#35CB00',
            textColor: '#35CB00',
        },
        caretaker: {
            backgroundColor: '#CBF3FF',
            borderColor: '#4BD4FF',
            textColor: '#4BD4FF',
        },
        veterinarian: {
            backgroundColor: '#FEFFCB',
            borderColor: '#FFDC24',
            textColor: '#FFDC24',
        },
    };

    const { backgroundColor, borderColor, textColor } = roleStyles[user.role.toLowerCase()] || {};

    return (
        <div className="flex flex-col md:flex-row items-start mt-10">
            <div className="w-full max-w-[1024px] mx-auto">
                <div className="flex items-center mb-8">
                    <img
                        src={user.avatarUrl || "/icons/name.png"}
                        alt="User Avatar"
                        className="h-20 w-20 rounded mr-6"
                    />
                    <div>
                        <div className="inline-flex items-center relative">
                            <h1 className="text-3xl font-black mb-1 mr-1">{user.name}</h1>
                            <span
                                className="px-2 py-0.5 rounded-2xl font-semibold"
                                style={{
                                    backgroundColor,
                                    borderColor,
                                    color: textColor,
                                    borderWidth: '2px',
                                    borderStyle: 'solid',
                                    position: 'relative',
                                    top: '-30px',
                                }}
                            >
                        {user.role}
                    </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserHeader;
