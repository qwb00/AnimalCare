const axios = require('axios');
const API_BASE_URL = 'https://animalcaredb-3c73ac350ab8.herokuapp.com/api'; // Замените на ваш API_BASE_URL

// Замените эти значения на реальные данные
const animalId = '5bc27217-6817-40e4-b8d1-60dc9aca3e83'; // ID животного, которое нужно обновить
const newPhotoUrl = 'https://images.unsplash.com/photo-1537204696486-967f1b7198c8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Новый URL фотографии

// Получите токен из sessionStorage или временно вставьте его сюда
const authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbmlzdHJhdG9yIiwiZXhwIjoxNzI5OTczNDg1LCJpc3MiOiJBbmltYWxDYXJlQVBJIiwiYXVkIjoiQW55Q2xpZW50In0.ZSDw8ZF-Znhi96Oa4hYjn4cfFQB97HYB2_yi0s2ClpA'; // Вставьте сюда реальный токен

const updateAnimalPhoto = async (animalId, newPhotoUrl) => {
  try {
    // Формируем данные для PATCH запроса
    const data = {
      photo: newPhotoUrl, // Новый URL фотографии
    };

    // Отправляем PATCH запрос
    const response = await axios.patch(
      `${API_BASE_URL}/animals/${animalId}`, // URL с ID животного
      data,
      {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${authToken}`, // Добавляем токен в заголовки
        },
      }
    );

    // Проверяем успешный ответ
    if (response.status === 200 || response.status === 204) {
      console.log('Photo URL updated successfully:', response.data);
    } else {
      console.error('Failed to update photo URL:', response.data);
    }
  } catch (error) {
    console.error('Error updating photo URL:', error);
  }
};

// Запускаем функцию обновления
updateAnimalPhoto(animalId, newPhotoUrl);
