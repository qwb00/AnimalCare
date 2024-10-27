import React from 'react';

function UserBasicInfo({ user }) {
    return (
        <div className="p-6 border-2 border-gray-200 rounded-lg mt-6 ml-8 md:ml-12">
            <h3 className="text-lg font-semibold mb-4">Basic Information</h3>
            <div className="space-y-3">
                {/* Full Name */}
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <img src="/icons/name.png" alt="User Icon" className="h-8 w-8 text-black" />
                    </div>
                    <div className="ml-4">
                        <div className="flex items-center">
                            <span className="text-gray-500 font-semibold">Full Name</span>
                            <img src="/icons/pen.png" alt="Edit Icon" className="h-4 w-4 ml-2 text-gray-400" />
                        </div>
                        <div className="text-black text-md -mt-1">{user.name}</div>
                    </div>
                </div>

                {/* Role */}
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <img src="/icons/role.png" alt="Role Icon" className="h-8 w-8 text-black" />
                    </div>
                    <div className="ml-4">
                        <div className="text-gray-500 font-semibold">Role</div>
                        <div className="text-black text-md -mt-1">{user.role}</div>
                    </div>
                </div>

                {/* E-mail */}
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <img src="/icons/e-mail.png" alt="Email Icon" className="h-8 w-8 text-black" />
                    </div>
                    <div className="ml-4">
                        <div className="flex items-center">
                            <span className="text-gray-500 font-semibold">E-mail</span>
                            <img src="/icons/pen.png" alt="Edit Icon" className="h-4 w-4 ml-2 text-gray-400" />
                        </div>
                        <div className="text-black text-md -mt-1">{user.email}</div>
                    </div>
                </div>

                {/* Password */}
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <img src="/icons/password.png" alt="Password Icon" className="h-8 w-8 text-black" />
                    </div>
                    <div className="ml-4">
                        <div className="flex items-center">
                            <span className="text-gray-500 font-semibold">Password</span>
                            <img src="/icons/pen.png" alt="Edit Icon" className="h-4 w-4 ml-2 text-gray-400" />
                        </div>
                        <div className="text-black text-md -mt-1">************</div>
                    </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <img src="/icons/phone.png" alt="Phone Icon" className="h-8 w-8 text-black" />
                    </div>
                    <div className="ml-4">
                        <div className="flex items-center">
                            <span className="text-gray-500 font-semibold">Phone Number</span>
                            <img src="/icons/pen.png" alt="Edit Icon" className="h-4 w-4 ml-2 text-gray-400" />
                        </div>
                        <div className="text-black text-md -mt-1">{user.phoneNumber}</div>
                    </div>
                </div>

                {/* Registration Date */}
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <img src="/icons/calendar_black.png" alt="Registration Date Icon" className="h-8 w-8 text-black" />
                    </div>
                    <div className="ml-4">
                        <div className="text-gray-500 font-semibold">Registration Date</div>
                        <div className="text-black text-md -mt-1">{user.registrationDate}</div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default UserBasicInfo;
