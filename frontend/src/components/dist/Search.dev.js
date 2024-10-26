"use strict";

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports["default"] = void 0;

var _react = _interopRequireWildcard(require("react"));

var _axios = _interopRequireDefault(require("axios"));

var _Button = _interopRequireDefault(require("./Button"));

var _config = _interopRequireDefault(require("../config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { "default": obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function _getRequireWildcardCache() { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || _typeof(obj) !== "object" && typeof obj !== "function") { return { "default": obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj["default"] = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

// Импортируем базовый URL
function Search(_ref) {
  var placeholder = _ref.placeholder,
      icon = _ref.icon,
      onSearch = _ref.onSearch;

  var _useState = (0, _react.useState)([]),
      _useState2 = _slicedToArray(_useState, 2),
      animals = _useState2[0],
      setAnimals = _useState2[1]; // Храним список животных


  var _useState3 = (0, _react.useState)(''),
      _useState4 = _slicedToArray(_useState3, 2),
      searchValue = _useState4[0],
      setSearchValue = _useState4[1];

  var _useState5 = (0, _react.useState)(false),
      _useState6 = _slicedToArray(_useState5, 2),
      isDropdownOpen = _useState6[0],
      setIsDropdownOpen = _useState6[1]; // Управляет состоянием выпадающего меню


  var _useState7 = (0, _react.useState)(null),
      _useState8 = _slicedToArray(_useState7, 2),
      searchResult = _useState8[0],
      setSearchResult = _useState8[1]; // Хранит результат поиска


  var _useState9 = (0, _react.useState)(false),
      _useState10 = _slicedToArray(_useState9, 2),
      isInputError = _useState10[0],
      setIsInputError = _useState10[1]; // Управляет состоянием ошибки ввода


  var dropdownRef = (0, _react.useRef)(null); // Ссылка на выпадающее меню для отслеживания кликов вне его
  // Загружаем список животных с API

  (0, _react.useEffect)(function () {
    var loadAnimals = function loadAnimals() {
      var response, animalNames;
      return regeneratorRuntime.async(function loadAnimals$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              _context.prev = 0;
              _context.next = 3;
              return regeneratorRuntime.awrap(_axios["default"].get("".concat(_config["default"], "/animals")));

            case 3:
              response = _context.sent;
              animalNames = response.data.map(function (animal) {
                return animal.name;
              });
              console.log('Loaded animals from API:', animalNames); // Лог загруженных животных

              setAnimals(animalNames);
              _context.next = 12;
              break;

            case 9:
              _context.prev = 9;
              _context.t0 = _context["catch"](0);
              console.error('Error fetching animals:', _context.t0);

            case 12:
            case "end":
              return _context.stop();
          }
        }
      }, null, null, [[0, 9]]);
    };

    loadAnimals();
  }, []); // Функция для поиска животного

  var handleSearch = function handleSearch() {
    console.log('Search value:', searchValue); // Лог значения поиска

    if (!searchValue) {
      setIsInputError(true); // Установить ошибку, если поле пустое

      return;
    }

    if (animals.includes(searchValue)) {
      console.log("Animal \"".concat(searchValue, "\" is selected!")); // Лог, если животное выбрано

      setSearchResult("Animal \"".concat(searchValue, "\" is selected!"));
      onSearch(searchValue); // Передаем выбранное имя животного в родительский компонент
    } else {
      console.log("Animal \"".concat(searchValue, "\" not found.")); // Лог, если животное не найдено

      setSearchResult("Animal \"".concat(searchValue, "\" not found."));
      onSearch(null);
    }

    setIsDropdownOpen(false); // Закрыть выпадающее меню при нажатии на кнопку Search

    setIsInputError(false); // Сбросить ошибку
  }; // Остальной код компонента не меняется...

}

var _default = Search;
exports["default"] = _default;