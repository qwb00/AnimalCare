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
            console.log("User data:", userData);
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
          console.log("Req data:", data);
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
    const newRequests = userRequests.filter(request => request.status === 1); // Новый статус
    const completedRequests = userRequests.filter(request => request.status === 0); // Завершённый статус
    const handleAddRequestClick = () => {
      setShowAddRequestForm(true);
    };
    const handleFormSubmit = (formData) => {
      // Здесь выполняется логика отправки POST запроса для создания нового запроса
      console.log("Form submitted with data:", formData);
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
    return (
      <div className="container mx-auto">
        <Header/>
        <div className="flex flex-col md:flex-row items-start md:items-center mt-10 md:mt-10">
          <div className="md:ml-12 lg:ml-20 xl:ml-32">
            <UserHeader user={user} />
          </div>
        </div>
          <UserNav role={user.role} />

          {user.role === 'Caretaker' && (
            <>
                <div className="mb-4 mt-4 md:ml-24 lg:ml-32 xl:ml-36">
                    <Button text="+ New Request" variant="blue" onClick={handleAddRequestClick} />
                </div>
                    <div className="flex justify-center">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                        {requests.map((request) => (
                          <RequestCard key={request.id} request={request} showActions={'Caretaker'} onDelete={handleDelete}/>
                        ))}
                      </div>
                  </div>
            </>
          )}
        
          {user.role === 'Veterinarian' && (
            <>
                <h2 className="text-2xl font-bold mb-4 mt-4 md:ml-24 lg:ml-32 xl:ml-36">New Requests</h2>
              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {newRequests.map((request) => (
                    <RequestCard key={request.id} request={request} showActions={'Veterinarian'}
                    onApprove={handleApprove}
                    onDecline={handleDecline} />
                  ))}
                </div>
              </div>
            </>
          )}

        {user.role === 'Veterinarian' && (
          <>
          <h2 className="text-2xl font-bold mb-4 mt-4 md:ml-24 lg:ml-32 xl:ml-36">Completed treatments</h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {completedRequests.map((request) => (
                <RequestCard key={request.id} request={request} />
              ))}
            </div>
          </div>
          </>
        )}
        {showAddRequestForm && (
                <AddRequestForm onSubmit={handleFormSubmit} onClose={() => setShowAddRequestForm(false)} />
            )}
      </div>
    );
  };
  
  export default VeterinarianExaminations;
