import React, { useEffect, useState } from 'react';
import UserHeader from "../components/UserHeader";
import UserNav from "../components/UserNav";
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import API_BASE_URL from '../config';
import RequestCard from '../components/TreatmentRequest';
import Header from '../components/Header';
import AddRequestForm from '../components/AddRequestForm';

function VeterinarianExaminations() {
    const [user, setUser] = useState(null);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showAddRequestForm, setShowAddRequestForm] = useState(false);
    const [visibleRequests, setVisibleRequests] = useState(2); // Начальное количество отображаемых карточек
    const navigate = useNavigate();
  
    useEffect(() => {
        const token = sessionStorage.getItem('token');

        const fetchUser = async () => {
            try {
                const response = await fetch(`${API_BASE_URL}/users/me`, {
                    headers: {
                        'Authorization': `Bearer ${token}`,
                    }
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
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json'
                    }
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
  
    // Фильтруем реквесты по статусу
    if (loading || !user) return <p>Loading...</p>;
    const userRequests = requests.filter(request => request.veterinarianName === user.name);
    const newRequests = userRequests.filter(request => request.status === 1);
    const completedRequests = userRequests.filter(request => request.status === 0);
    
    const handleAddRequestClick = () => {
        setShowAddRequestForm(true);
    };
    const handleFormSubmit = (formData) => {
        setShowAddRequestForm(false);
    };
    const handleApprove = (requestId) => {
        setRequests(prevRequests =>
            prevRequests.map(request =>
                request.id === requestId ? { ...request, status: 0 } : request
            )
        );
    };
    const handleDecline = (requestId) => {
        setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
    };
    const handleDelete = (requestId) => {
        setRequests(prevRequests => prevRequests.filter(request => request.id !== requestId));
    };

    const handleShowMoreRequests = () => {
        setVisibleRequests(prev => prev + 2); // Увеличиваем число отображаемых карточек на 2
    };

    return (
        <div className="container mx-auto">
            <Header />
            <UserHeader user={user} />
            <UserNav role={user.role} />

            {user.role === 'Caretaker' && (
                <>
                    <div className="w-full max-w-[1024px] mx-auto mb-8">
                        <Button text="+ New Request" variant="blue" onClick={handleAddRequestClick} />
                    </div>
                    <div className="w-full max-w-[1024px] mx-auto mb-4 mt-4">
                      <div className="flex flex-wrap gap-10">
                  
                        {requests.slice(0, visibleRequests).map((request) => (
                            <RequestCard key={request.id} request={request} showActions={'Caretaker'} onDelete={handleDelete} />
                        ))}
                    
                      </div>
                    </div>
                      {requests.length > visibleRequests && (
                          <div className="flex justify-center my-4">
                              <button
                                  onClick={handleShowMoreRequests}
                                  className="w-20 h-8 border-2 border-main-blue text-main-blue rounded-full hover:bg-light-blue"
                              >
                                  <span className="text-lg font-bold">...</span>
                              </button>
                          </div>
                    )}
                </>
            )}

            {user.role === 'Veterinarian' && (
                <>
                    <div className="w-full max-w-[1024px] mx-auto mb-4 mt-4">
                        <h2 className="text-2xl font-bold">New Requests</h2>
                    </div>
                    <div className="w-full max-w-[1024px] mx-auto mb-4 mt-4">
                      <div className="flex flex-wrap gap-10">
                        {newRequests.slice(0, visibleRequests).map((request) => (
                            <RequestCard key={request.id} request={request} showActions={'Veterinarian'}
                                onApprove={handleApprove} onDecline={handleDecline} />
                        ))}
                  
                      </div>
                    </div>
                    {newRequests.length > visibleRequests && (
                        <div className="flex justify-center my-4">
                            <button
                                onClick={handleShowMoreRequests}
                                className="w-20 h-8 border-2 border-main-blue text-main-blue rounded-full hover:bg-light-blue"
                            >
                                <span className="text-lg font-bold">...</span>
                            </button>
                        </div>
                    )}
                </>
            )}

            {user.role === 'Veterinarian' && (
                <>
                    <div className="w-full max-w-[1024px] mx-auto mb-4 mt-4">
                        <h2 className="text-2xl font-bold">Completed Treatments</h2>
                    </div>
                    <div className="w-full max-w-[1024px] mx-auto mb-4 mt-4">
                      <div className="flex flex-wrap gap-10">
                      
                        {completedRequests.slice(0, visibleRequests).map((request) => (
                            <RequestCard key={request.id} request={request} />
                        ))}
                      
                      </div>
                    </div>
                    {completedRequests.length > visibleRequests && (
                        <div className="flex justify-center my-4">
                            <button
                                onClick={handleShowMoreRequests}
                                className="w-20 h-8 border-2 border-main-blue text-main-blue rounded-full hover:bg-light-blue"
                            >
                                <span className="text-lg font-bold">...</span>
                            </button>
                        </div>
                    )}
                </>
            )}
            
            {showAddRequestForm && (
                <AddRequestForm onSubmit={handleFormSubmit} onClose={() => setShowAddRequestForm(false)} />
            )}
        </div>
    );
}

export default VeterinarianExaminations;


