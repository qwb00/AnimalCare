import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Header from "../components/Header";
import UserHeader from "../components/UserHeader";
import UserNav from "../components/UserNav";
import RequestCard from "../components/TreatmentRequest";
import Button from "../components/Button";
import AddRequestForm from "../components/AddRequestForm";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import API_BASE_URL from "../config";
import {icons} from "../components/icons";

const ExaminationStatus = {
    InProgress: 0,
    Completed: 1,
    NotDecided: 2,
    Cancelled: 3,
};

const ExaminationType = {
    PlannedTreatment: 0,
    Emergency: 1,
    Vaccination: 2,
    Surgery: 3,
};

function VeterinarianExaminations() {
    const [user, setUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddRequestForm, setShowAddRequestForm] = useState(false);

    // Caretaker visible requests
    const [visibleCancelledRequests, setVisibleCancelledRequests] = useState(2);
    const [visibleInProgressRequests, setVisibleInProgressRequests] = useState(2);
    const [visibleCompletedRequests, setVisibleCompletedRequests] = useState(2);

    // Veterinarian visible requests
    const [visibleVeterinarianRequests, setVisibleVeterinarianRequests] = useState(2);

    const navigate = useNavigate();

    const [nameFilterNewRequests, setNameFilterNewRequests] = useState("");
    const [dateFromNewRequests, setDateFromNewRequests] = useState("");
    const [dateToNewRequests, setDateToNewRequests] = useState("");
    const [typeFilterNewRequests, setTypeFilterNewRequests] = useState("");


    const [nameFilterInProgress, setNameFilterInProgress] = useState("");
    const [dateFromInProgress, setDateFromInProgress] = useState("");
    const [dateToInProgress, setDateToInProgress] = useState("");

    const [nameFilterCompleted, setNameFilterCompleted] = useState("");
    const [dateFromCompleted, setDateFromCompleted] = useState("");
    const [dateToCompleted, setDateToCompleted] = useState("");

    useEffect(() => {
        const token = sessionStorage.getItem('token');
        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/me`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch user information');
                }
                const userData = await response.json();
                setUser(userData);
            } catch (error) {
                console.error('Error fetching user data:', error);
                navigate('/login');
            }
        };

        const fetchRequests = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/examinations`, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });
                if (!response.ok) {
                    throw new Error('Failed to fetch records');
                }
                const data = await response.json();
                setRequests(data);
            } catch (error) {
                console.error('Error fetching records:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchUser();
        fetchRequests();
    }, [navigate]);

    if (loading || !user) return <p>Loading...</p>;

    // Filtering requests for Caretaker
    const cancelledRequests = requests.filter(
        (request) => request.status === ExaminationStatus.Cancelled
    );
    const inProgressRequests = requests.filter(
        (request) => request.status === ExaminationStatus.InProgress
    );
    const completedRequests = requests.filter(
        (request) => request.status === ExaminationStatus.Completed
    );

    // Filtering requests for Veterinarian
    const vetRequests = requests.filter(
        (request) => request.veterinarianName === user.name
    );
    const newRequests = vetRequests.filter(
        (request) => request.status === ExaminationStatus.NotDecided
    );
    const vetInProgressRequests = vetRequests.filter(
        (request) => request.status === ExaminationStatus.InProgress
    );
    const vetCompletedRequests = vetRequests.filter(
        (request) => request.status === ExaminationStatus.Completed
    );

    const handleAddRequestClick = () => {
        setShowAddRequestForm(true);
    };

    const handleFormSubmit = (formData) => {
        setShowAddRequestForm(false);
    };

    const handleApprove = (requestId) => {
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === requestId
                    ? { ...request, status: ExaminationStatus.InProgress }
                    : request
            )
        );
    };

    const handleConfirm = (requestId, finalDiagnosis) => {
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === requestId
                    ? { ...request, status: ExaminationStatus.Completed, finalDiagnosis }
                    : request
            )
        );
    };

    const handleDecline = (requestId) => {
        setRequests((prevRequests) =>
            prevRequests.map((request) =>
                request.id === requestId
                    ? { ...request, status: ExaminationStatus.Cancelled }
                    : request
            )
        );
    };

    const handleDelete = (requestId) => {
        setRequests((prevRequests) =>
            prevRequests.filter((request) => request.id !== requestId)
        );
    };

    const filteredNewRequests = applyFiltersToRequests(
        newRequests,
        nameFilterNewRequests,
        dateFromNewRequests,
        dateToNewRequests,
        typeFilterNewRequests
    );
    

    function applyFiltersToRequests(requestsArray, nameFilter, dateFrom, dateTo, typeFilter) {
        let result = requestsArray;
        if (nameFilter) {
            result = result.filter(request =>
                request.animalName?.toLowerCase().includes(nameFilter.toLowerCase())
            );
        }
        if (dateFrom) {
            console.log(result)
            console.log(new Date(dateFrom))
            result = result.filter(request =>
                new Date(request.examinationDate) >= new Date(dateFrom)
            );
        }
        if (dateTo) {
            result = result.filter(request =>
                new Date(request.examinationDate) <= new Date(dateTo)
            );
        }

        if (typeFilter) {
            result = result.filter((request) => {
                try {
                    const enumValue = ExaminationType[typeFilter]; 
                    return request.type === enumValue; 
                } catch {
                    return false; 
                }
            });
        }

        return result;
    }

    const filteredVetInProgress = applyFiltersToRequests(vetInProgressRequests, nameFilterInProgress, dateFromInProgress, dateToInProgress);
    const filteredVetCompleted = applyFiltersToRequests(vetCompletedRequests, nameFilterCompleted, dateFromCompleted, dateToCompleted);

    return (
        <>
            <div>
                <ToastContainer />
            </div>
            <div className="container mx-auto">
                <Header />
                <UserHeader user={user} />
                <UserNav role={user.role} />

                {user.role === 'Caretaker' && (
                    <>
                        <div className="w-full max-w-[1024px] mx-auto mb-8">
                            <Button
                                icon={icons.plus_white}
                                text="New Request"
                                variant="blue"
                                onClick={handleAddRequestClick}
                            />
                        </div>

                        {/* Cancelled Requests Section */}
                        <div className="w-full max-w-[1024px] mx-auto mb-4 mt-4">
                            <h2 className="text-2xl font-bold">Cancelled Requests</h2>
                            <div className="flex flex-wrap gap-10">
                                {cancelledRequests.slice(0, visibleCancelledRequests).map((request) => (
                                    <RequestCard
                                        key={request.id}
                                        request={request}
                                        showActions={'Caretaker'}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                            {cancelledRequests.length > visibleCancelledRequests && (
                                <div className="flex justify-center my-4">
                                    <button
                                        onClick={() => setVisibleCancelledRequests((prev) => prev + 2)}
                                        className="w-20 h-8 border-2 border-main-blue text-main-blue rounded-full hover:bg-light-blue"
                                    >
                                        <span className="text-lg font-bold">...</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* In Progress Requests Section */}
                        <div className="w-full max-w-[1024px] mx-auto mb-4 mt-4">
                            <h2 className="text-2xl font-bold">In Progress Requests</h2>
                            <div className="flex flex-wrap gap-10">
                                {inProgressRequests.slice(0, visibleInProgressRequests).map((request) => (
                                    <RequestCard
                                        key={request.id}
                                        request={request}
                                        showActions={'Caretaker'}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                            {inProgressRequests.length > visibleInProgressRequests && (
                                <div className="flex justify-center my-4">
                                    <button
                                        onClick={() => setVisibleInProgressRequests((prev) => prev + 2)}
                                        className="w-20 h-8 border-2 border-main-blue text-main-blue rounded-full hover:bg-light-blue"
                                    >
                                        <span className="text-lg font-bold">...</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Completed Requests Section */}
                        <div className="w-full max-w-[1024px] mx-auto mb-4 mt-4">
                            <h2 className="text-2xl font-bold">Completed Requests</h2>
                            <div className="flex flex-wrap gap-10">
                                {completedRequests.slice(0, visibleCompletedRequests).map((request) => (
                                    <RequestCard
                                        key={request.id}
                                        request={request}
                                        showActions={'Caretaker'}
                                        onDelete={handleDelete}
                                    />
                                ))}
                            </div>
                            {completedRequests.length > visibleCompletedRequests && (
                                <div className="flex justify-center my-4">
                                    <button
                                        onClick={() => setVisibleCompletedRequests((prev) => prev + 2)}
                                        className="w-20 h-8 border-2 border-main-blue text-main-blue rounded-full hover:bg-light-blue"
                                    >
                                        <span className="text-lg font-bold">...</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {user.role === 'Veterinarian' && (
                    <>
                        <div className="w-full max-w-[1024px] mx-auto mb-4 mt-4">
                            <div className="flex items-center justify-between mb-4">
                                <div className="flex items-center space-x-4">
                                <h2 className="text-2xl font-bold">New Requests</h2>
                                <div className="flex flex-col">
                                    <select
                                    value={typeFilterNewRequests}
                                    onChange={(e) => setTypeFilterNewRequests(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                                    >
                                    <option value="">All</option>
                                    <option value="Emergency">Emergency</option>
                                    <option value="PlannedTreatment">Planned</option>
                                    <option value="Surgery">Surgery</option>
                                    <option value="Vaccination">Vaccination</option>
                                    </select>
                                </div>
                                </div>
                            </div>

                            <div className="mb-4">
                                <input
                                type="text"
                                placeholder="Filter by Animal Name"
                                value={nameFilterNewRequests}
                                onChange={(e) => setNameFilterNewRequests(e.target.value)}
                                className="p-2 w-1/2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                                />
                            </div>


                            <div className="flex flex-wrap gap-10">
                                {filteredNewRequests.slice(0, visibleVeterinarianRequests).map((request) => (
                                    <RequestCard
                                        key={request.id}
                                        request={request}
                                        showActions={"Veterinarian"}
                                        onApprove={handleApprove}
                                        onDecline={handleDecline}
                                    />
                                ))}
                            </div>
                            {filteredNewRequests.length > visibleVeterinarianRequests && (
                                <div className="flex justify-center my-4">
                                    <button
                                        onClick={() => setVisibleVeterinarianRequests((prev) => prev + 2)}
                                        className="w-20 h-8 border-2 border-main-blue text-main-blue rounded-full hover:bg-light-blue"
                                    >
                                        <span className="text-lg font-bold">...</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* In Progress Requests with filters */}
                        <div className="w-full max-w-[1024px] mx-auto mb-4 mt-4">
                            <h2 className="text-2xl font-bold mb-4">In Progress Requests</h2>
                            
                            <div className="flex flex-wrap gap-4 mb-4">
                                <div className="flex flex-col">
                                <input
                                    placeholder="From date"
                                    onFocus={(e) => (e.target.type = "date")}
                                    onBlur={(e) => !e.target.value && (e.target.type = "text")}
                                    value={dateFromInProgress}
                                    onChange={(e) => setDateFromInProgress(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                                />
                                </div>
                                <div className="flex flex-col">
                                <input
                                    placeholder="To date"
                                    onFocus={(e) => (e.target.type = "date")}
                                    onBlur={(e) => !e.target.value && (e.target.type = "text")}
                                    value={dateToInProgress}
                                    onChange={(e) => setDateToInProgress(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                                />
                                </div>
                                <div className="flex flex-col w-full md:w-auto">
                                <input
                                    type="text"
                                    placeholder="Filter by Animal Name"
                                    value={nameFilterInProgress}
                                    onChange={(e) => setNameFilterInProgress(e.target.value)}
                                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                                />
                                </div>
                            </div>
                            <div className="flex flex-wrap gap-10">
                                {filteredVetInProgress.slice(0, visibleVeterinarianRequests).map((request) => (
                                    <RequestCard key={request.id} request={request} showActions={'InProgress'} onConfirm={handleConfirm} />
                                ))}
                            </div>
                            {filteredVetInProgress.length > visibleVeterinarianRequests && (
                                <div className="flex justify-center my-4">
                                    <button
                                        onClick={() => setVisibleVeterinarianRequests((prev) => prev + 2)}
                                        className="w-20 h-8 border-2 border-main-blue text-main-blue rounded-full hover:bg-light-blue"
                                    >
                                        <span className="text-lg font-bold">...</span>
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Completed Requests with filters */}
                        <div className="w-full max-w-[1024px] mx-auto mb-4 mt-4">
                                <h2 className="text-2xl font-bold mb-4">Completed Requests</h2>
                                <div className="flex flex-wrap gap-4 mb-4">
                                    <div className="flex flex-col">
                                        <input
                                            placeholder="From date"
                                            onFocus={(e) => (e.target.type = "date")}
                                            onBlur={(e) => !e.target.value && (e.target.type = "text")}
                                            value={dateFromCompleted}
                                            onChange={(e) => setDateFromCompleted(e.target.value)}
                                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <input
                                            placeholder="To date"
                                            onFocus={(e) => (e.target.type = "date")}
                                            onBlur={(e) => !e.target.value && (e.target.type = "text")}
                                            value={dateToCompleted}
                                            onChange={(e) => setDateToCompleted(e.target.value)}
                                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                                        />
                                    </div>
                                    <div className="flex flex-col">
                                        <input
                                            type="text"
                                            placeholder="Filter by Animal Name"
                                            value={nameFilterCompleted}
                                            onChange={(e) => setNameFilterCompleted(e.target.value)}
                                            className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                                        />
                                    </div>
                                </div>
                            <div className="flex flex-wrap gap-10">
                                {filteredVetCompleted.slice(0, visibleVeterinarianRequests).map((request) => (
                                    <RequestCard key={request.id} request={request} />
                                ))}
                            </div>
                            {filteredVetCompleted.length > visibleVeterinarianRequests && (
                                <div className="flex justify-center my-4">
                                    <button
                                        onClick={() => setVisibleVeterinarianRequests((prev) => prev + 2)}
                                        className="w-20 h-8 border-2 border-main-blue text-main-blue rounded-full hover:bg-light-blue"
                                    >
                                        <span className="text-lg font-bold">...</span>
                                    </button>
                                </div>
                            )}
                        </div>
                    </>
                )}

                {showAddRequestForm && (
                    <AddRequestForm
                        onSubmit={handleFormSubmit}
                        onClose={() => setShowAddRequestForm(false)}
                    />
                )}
            </div>
        </>
    );
}

export default VeterinarianExaminations;

