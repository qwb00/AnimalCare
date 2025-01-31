/*
* Author: Mikhail Vorobev xvorob01
* Page for medical treatments where caretaker and veterinarian can manage treatments
*/

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
import { icons } from "../components/icons";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import TreatmentListItem from '../components/TreatmentListItem'

// Define the possible examination statuses with numeric codes for easy reference
const ExaminationStatus = {
  InProgress: 0,
  Completed: 1,
  NotDecided: 2,
  Cancelled: 3,
};

// Define the possible examination types for filtering and display purposes
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
  const [viewMode, setViewMode] = useState("card");

  // Caretaker visible requests
  const [visibleCancelledRequests, setVisibleCancelledRequests] = useState(2);
  // (In Progress + Completed)
  const [visibleCaretakerActiveRequests, setVisibleCaretakerActiveRequests] = useState(2);

  // Veterinarian visible requests
  const [visibleVeterinarianRequests, setVisibleVeterinarianRequests] = useState(2);

  const navigate = useNavigate();

  // State variables for filters applied in the caretaker's view
  const [nameFilterCaretaker, setNameFilterCaretaker] = useState("");
  const [nameVetFilterCaretaker, setNameVetFilterCaretaker] = useState("");
  const [dateFromCaretaker, setDateFromCaretaker] = useState("");
  const [dateToCaretaker, setDateToCaretaker] = useState("");
  const [typeFilterCaretaker, setTypeFilterCaretaker] = useState("");
  const [statusFilterCaretaker, setStatusFilterCaretaker] = useState("");

  // Filters for veterinarian's "New Requests"
  const [nameFilterNewRequests, setNameFilterNewRequests] = useState("");
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
  
  const caretakerActiveRequests = [...inProgressRequests, ...completedRequests];

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
    // Once form is submitted, hide the form
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

  // A generic filtering function to apply multiple filters to an array of requests
  function applyFiltersToRequests(
    requestsArray,
    nameFilter,
    nameVetFilter,
    dateFrom,
    dateTo,
    typeFilter,
    statusFilter
  ) {
    let result = requestsArray;
    console.log(result);
    if (nameFilter) {
      result = result.filter((request) =>
        request.animalName?.toLowerCase().includes(nameFilter.toLowerCase())
      );
    }
    if (nameVetFilter) {
      result = result.filter((request) =>
        request.veterinarianName?.toLowerCase().includes(nameVetFilter.toLowerCase())
      );
    }
    if (dateFrom) {
      result = result.filter(
        (request) => new Date(request.examinationDate) >= new Date(dateFrom)
      );
    }
    if (dateTo) {
      result = result.filter(
        (request) => new Date(request.examinationDate) <= new Date(dateTo)
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

    if (statusFilter) {
      if (statusFilter === "InProgress") {
        result = result.filter((req) => req.status === ExaminationStatus.InProgress);
      } else if (statusFilter === "Completed") {
        result = result.filter((req) => req.status === ExaminationStatus.Completed);
      }
    }

    return result;
  }

  // Apply filters to different request subsets based on the currently active filters
  const filteredNewRequests = applyFiltersToRequests(
    newRequests,
    nameFilterNewRequests,
    typeFilterNewRequests
  );

  const filteredVetInProgress = applyFiltersToRequests(
    vetInProgressRequests,
    nameFilterInProgress,
    "",
    dateFromInProgress,
    dateToInProgress
  );
  const filteredVetCompleted = applyFiltersToRequests(
    vetCompletedRequests,
    nameFilterCompleted,
    "",
    dateFromCompleted,
    dateToCompleted
  );

  const filteredCaretakerActiveRequests = applyFiltersToRequests(
    caretakerActiveRequests,
    nameFilterCaretaker,
    nameVetFilterCaretaker,
    dateFromCaretaker,
    dateToCaretaker,
    typeFilterCaretaker,
    statusFilterCaretaker
  );

  return (
    <>
      <div>
        <ToastContainer />
      </div>
      <div className="container mx-auto">
        <Header />
        <UserHeader user={user} />
        <UserNav role={user.role} />

        {/* Caretaker view: Allows creation of new requests, shows cancelled and active requests */}
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

             {/* Cancelled requests for caretaker */}
            <div className="w-full max-w-[1024px] mx-auto mb-4 mt-4">
              <h2 className="text-2xl font-bold mb-4">Cancelled Requests</h2>
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
              
              {/* Active requests for caretaker with filters and view mode toggle */}
            <div className="w-full max-w-[1024px] mx-auto mb-4 mt-4">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-4">
                    <h2 className="text-2xl font-bold">Active Requests</h2>
                    <select
                        value={typeFilterCaretaker}
                        onChange={(e) => setTypeFilterCaretaker(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                    >
                        <option value="">All Types</option>
                        <option value="Emergency">Emergency</option>
                        <option value="PlannedTreatment">Planned Treatment</option>
                        <option value="Surgery">Surgery</option>
                        <option value="Vaccination">Vaccination</option>
                    </select>

                    <select
                        value={statusFilterCaretaker}
                        onChange={(e) => setStatusFilterCaretaker(e.target.value)}
                        className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                    >
                        <option value="">All Statuses</option>
                        <option value="InProgress">In Progress</option>
                        <option value="Completed">Completed</option>
                    </select>
                  
                    </div>
                    <Button
                      icon={viewMode === "card" ? "/icons/switch_off.png" : "/icons/switch_on.png"}
                      text={`Switch to ${viewMode === "card" ? "List" : "Card"} View`}
                      variant="white"
                      onClick={() => setViewMode((prev) => (prev === "card" ? "list" : "card"))}
                    />
                </div>
              {/* Filters for caretaker's active requests: date range, name, vet name */}
              <div className="flex flex-wrap gap-4 mb-4 items-end">
                  <div className="flex flex-col relative">
                    <DatePicker
                      selected={dateFromCaretaker}
                      onChange={(date) => setDateFromCaretaker(date)}
                      selectsStart
                      startDate={dateFromCaretaker}
                      endDate={dateToCaretaker}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="From date (dd.mm.yyyy)"
                      showYearDropdown
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                    />
                  </div>

                  <div className="flex flex-col relative">
                    <DatePicker
                      selected={dateToCaretaker}
                      onChange={(date) => setDateToCaretaker(date)}
                      selectsEnd
                      startDate={dateFromCaretaker}
                      endDate={dateToCaretaker}
                      minDate={dateFromCaretaker}
                      dateFormat="yyyy/MM/dd"
                      placeholderText="To date (dd.mm.yyyy)"
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                    />
                  </div>
                <div className="flex flex-col">
                  <input
                    type="text"
                    placeholder="Filter by Animal Name"
                    value={nameFilterCaretaker}
                    onChange={(e) => setNameFilterCaretaker(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                  />
                </div>
                <div className="flex flex-col">
                  <input
                    type="text"
                    placeholder="Filter by Veterinarian"
                    value={nameVetFilterCaretaker}
                    onChange={(e) => setNameVetFilterCaretaker(e.target.value)}
                    className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                  />
                </div>
              </div>
              
              {/* Display caretaker active requests either as cards or list items */}
              <div className="flex flex-wrap gap-10">
              {viewMode === "card"
                ? filteredCaretakerActiveRequests.slice(0, visibleCaretakerActiveRequests).map((request) => (
                  <RequestCard
                    key={request.id}
                    request={request}
                    showActions={'Caretaker'}
                    onDelete={handleDelete}
                  />
                ))
                : filteredCaretakerActiveRequests.map((request) => (
                  <TreatmentListItem
                    key={request.id}
                    request={request}
                    showActions={'Caretaker'}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
              {filteredCaretakerActiveRequests.length > visibleCaretakerActiveRequests && viewMode === "card" &&(
                <div className="flex justify-center my-4">
                  <button
                    onClick={() => setVisibleCaretakerActiveRequests((prev) => prev + 2)}
                    className="w-20 h-8 border-2 border-main-blue text-main-blue rounded-full hover:bg-light-blue"
                  >
                    <span className="text-lg font-bold">...</span>
                  </button>
                </div>
              )}
            </div>
          </>
        )}

        {/* Veterinarian view: Shows new, in-progress, and completed requests with various filters */}
        {user.role === 'Veterinarian' && (
          <>
           {/* New Requests with filters */}
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
                    <DatePicker
                      selected={dateFromInProgress}
                      onChange={(date) => setDateFromInProgress(date)}
                      selectsStart
                      startDate={dateFromInProgress}
                      endDate={dateToInProgress}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="From date (dd.mm.yyyy)"
                      showYearDropdown
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                    />
                  </div>
                  <div className="flex flex-col">
                    <DatePicker
                      selected={dateToInProgress}
                      onChange={(date) => setDateToInProgress(date)}
                      selectsEnd
                      startDate={dateFromInProgress}
                      endDate={dateToInProgress}
                      minDate={dateFromInProgress}
                      dateFormat="yyyy/MM/dd"
                      placeholderText="To date (dd.mm.yyyy)"
                      showYearDropdown
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
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold mb-4">Completed Requests</h2>
                <Button
                  icon={viewMode === "card" ? "/icons/switch_off.png" : "/icons/switch_on.png"}
                  text={`Switch to ${viewMode === "card" ? "List" : "Card"} View`}
                  variant="white"
                  onClick={() => setViewMode((prev) => (prev === "card" ? "list" : "card"))}
                />
              </div>
              <div className="flex flex-wrap gap-4 mb-4">
                <div className="flex flex-col">
                    <DatePicker
                      selected={dateFromCompleted}
                      onChange={(date) => setDateFromCompleted(date)}
                      selectsStart
                      startDate={dateFromCompleted}
                      endDate={dateToCompleted}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="From date (dd.mm.yyyy)"
                      showYearDropdown
                      className="p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-main-blue"
                    />
                  </div>
                  <div className="flex flex-col">
                    <DatePicker
                      selected={dateToCompleted}
                      onChange={(date) => setDateToCompleted(date)}
                      selectsEnd
                      startDate={dateFromCompleted}
                      endDate={dateToCompleted}
                      minDate={dateFromCompleted}
                      dateFormat="dd/MM/yyyy"
                      placeholderText="To date (dd.mm.yyyy)"
                      showYearDropdown
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
              {viewMode === "card"
                  ? filteredVetCompleted.slice(0, visibleVeterinarianRequests).map((request) => (
                      <RequestCard key={request.id} request={request} />
                  ))
                  : filteredVetCompleted.map((request) => (
                      <TreatmentListItem key={request.id} request={request} />
              ))}
              </div>
              {filteredVetCompleted.length > visibleVeterinarianRequests && viewMode === "card" &&(
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


