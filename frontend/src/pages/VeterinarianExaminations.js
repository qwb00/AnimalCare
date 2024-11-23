import React, { useEffect, useState } from 'react';
import UserHeader from '../components/UserHeader';
import UserNav from '../components/UserNav';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import API_BASE_URL from '../config';
import RequestCard from '../components/TreatmentRequest';
import Header from '../components/Header';
import AddRequestForm from '../components/AddRequestForm';
import { ToastContainer } from 'react-toastify';

const ExaminationStatus = {
    InProgress: 0,
    Completed: 1,
    Cancelled: 2,
    NotDecided: 3,
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
                                text="+ New Request"
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
                            <h2 className="text-2xl font-bold">New Requests</h2>
                            <div className="flex flex-wrap gap-10">
                                {newRequests.slice(0, visibleVeterinarianRequests).map((request) => (
                                    <RequestCard
                                        key={request.id}
                                        request={request}
                                        showActions={'Veterinarian'}
                                        onApprove={handleApprove}
                                        onDecline={handleDecline}
                                    />
                                ))}
                            </div>
                            {newRequests.length > visibleVeterinarianRequests && (
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

                        {/* In Progress Section */}
                        <div className="w-full max-w-[1024px] mx-auto mb-4 mt-4">
                            <h2 className="text-2xl font-bold">In Progress Requests</h2>
                            <div className="flex flex-wrap gap-10">
                                {vetInProgressRequests.slice(0, visibleVeterinarianRequests).map((request) => (
                                    <RequestCard
                                        key={request.id}
                                        request={request}
                                        showActions={'InProgress'}
                                        onConfirm={handleConfirm}
                                    />
                                ))}
                            </div>
                            {vetInProgressRequests.length > visibleVeterinarianRequests && (
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

                        {/* Completed Section */}
                        <div className="w-full max-w-[1024px] mx-auto mb-4 mt-4">
                            <h2 className="text-2xl font-bold">Completed Requests</h2>
                            <div className="flex flex-wrap gap-10">
                                {vetCompletedRequests.slice(0, visibleVeterinarianRequests).map((request) => (
                                    <RequestCard key={request.id} request={request} />
                                ))}
                            </div>
                            {vetCompletedRequests.length > visibleVeterinarianRequests && (
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
