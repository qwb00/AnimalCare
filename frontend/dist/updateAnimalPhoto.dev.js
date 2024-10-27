"use strict";

var axios = require('axios');

var API_BASE_URL = 'https://animalcaredb-3c73ac350ab8.herokuapp.com/api'; // Замените на ваш API_BASE_URL
// Замените эти значения на реальные данные

var animalId = '5bc27217-6817-40e4-b8d1-60dc9aca3e83'; // ID животного, которое нужно обновить

var newPhotoUrl = 'https://images.unsplash.com/photo-1537204696486-967f1b7198c8?q=80&w=1887&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D'; // Новый URL фотографии
// Получите токен из sessionStorage или временно вставьте его сюда

var authToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJodHRwOi8vc2NoZW1hcy54bWxzb2FwLm9yZy93cy8yMDA1LzA1L2lkZW50aXR5L2NsYWltcy9uYW1lIjoiYWRtaW4iLCJodHRwOi8vc2NoZW1hcy5taWNyb3NvZnQuY29tL3dzLzIwMDgvMDYvaWRlbnRpdHkvY2xhaW1zL3JvbGUiOiJBZG1pbmlzdHJhdG9yIiwiZXhwIjoxNzI5OTczNDg1LCJpc3MiOiJBbmltYWxDYXJlQVBJIiwiYXVkIjoiQW55Q2xpZW50In0.ZSDw8ZF-Znhi96Oa4hYjn4cfFQB97HYB2_yi0s2ClpA'; // Вставьте сюда реальный токен

var updateAnimalPhoto = function updateAnimalPhoto(animalId, newPhotoUrl) {
  var data, response;
  return regeneratorRuntime.async(function updateAnimalPhoto$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          // Формируем данные для PATCH запроса
          data = {
            photo: newPhotoUrl // Новый URL фотографии

          }; // Отправляем PATCH запрос

          _context.next = 4;
          return regeneratorRuntime.awrap(axios.patch("".concat(API_BASE_URL, "/animals/").concat(animalId), // URL с ID животного
          data, {
            headers: {
              'Content-Type': 'application/json',
              Authorization: "Bearer ".concat(authToken) // Добавляем токен в заголовки

            }
          }));

        case 4:
          response = _context.sent;

          // Проверяем успешный ответ
          if (response.status === 200 || response.status === 204) {
            console.log('Photo URL updated successfully:', response.data);
          } else {
            console.error('Failed to update photo URL:', response.data);
          }

          _context.next = 11;
          break;

        case 8:
          _context.prev = 8;
          _context.t0 = _context["catch"](0);
          console.error('Error updating photo URL:', _context.t0);

        case 11:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 8]]);
}; // Запускаем функцию обновления


updateAnimalPhoto(animalId, newPhotoUrl);