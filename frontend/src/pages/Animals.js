import React, { useEffect, useState } from 'react';
import Header from '../components/Header';
import Footer from '../components/Footer';
import AnimalCard from '../components/AnimalCard';
import axios from 'axios';
import API_BASE_URL from '../config'; // Импортируем базовый URL

function Animals() {
  const [allAnimals, setAllAnimals] = useState([]); // Все загруженные животные с сервера
  const [animals, setAnimals] = useState([]);        // Отображаемые животные
  const [isLoading, setIsLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);      // Флаг для проверки, есть ли еще данные
  const [loadedCount, setLoadedCount] = useState(0); // Количество загруженных животных
  const LOAD_LIMIT = 6; // Количество животных для загрузки за один раз

  // Функция загрузки всех животных с сервера
  const loadAllAnimals = async () => {
    setIsLoading(true);

    try {
      // Запрашиваем всех животных
      const response = await axios.get(`${API_BASE_URL}/animals`, {
        headers: {
          'Accept': 'application/json',
        },
      });

      const data = response.data;

      // Сохраняем всех животных в состоянии
      setAllAnimals(data);
    } catch (error) {
      console.error('Error fetching animals:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Функция загрузки порции животных из общего списка
  const loadMoreAnimals = () => {
    if (isLoading || !hasMore) return;

    setIsLoading(true);

    // Вычисляем следующую порцию животных
    const nextAnimals = allAnimals.slice(loadedCount, loadedCount + LOAD_LIMIT);

    // Если данных больше нет, прекращаем подгрузку
    if (nextAnimals.length === 0) {
      setHasMore(false);
    } else {
      // Добавляем новые животные к уже отображаемым
      setAnimals((prevAnimals) => [...prevAnimals, ...nextAnimals]);
      setLoadedCount((prevCount) => prevCount + nextAnimals.length); // Обновляем счетчик загруженных животных
    }

    setIsLoading(false);
  };

  // Функция для отслеживания скролла страницы
  const handleScroll = () => {
    if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 200 && hasMore) {
      loadMoreAnimals();
    }
  };

  useEffect(() => {
    // Загружаем всех животных с сервера при монтировании компонента
    loadAllAnimals();

    // Добавляем обработчик скролла
    window.addEventListener('scroll', handleScroll);

    // Убираем обработчик скролла при размонтировании компонента
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  useEffect(() => {
    // Загружаем первую порцию данных, как только получим всех животных
    if (allAnimals.length > 0) {
      loadMoreAnimals();
    }
  }, [allAnimals]);

  return (
    <div className="max-w-screen-lg mx-auto">
      <Header />

      <div className="container mx-auto text-center">
        <h1 className="text-4xl font-black mt-8 mb-12">OUR ANIMALS</h1>
      </div>

      <div className="container mx-auto p-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {animals.map((animal) => (
            <AnimalCard
              key={animal.id} // Используем уникальный идентификатор
              image={animal.photo} // Используем правильный ключ photo
              name={animal.name}
              age={`${animal.age} years`}
              breed={animal.breed}
            />
          ))}
        </div>

        {isLoading && (
          <div className="text-center mt-4">
            <p>Loading...</p>
          </div>
        )}
      </div>

      {/* Заголовок над футером */}
      <h2 className="text-4xl font-black text-center mt-12 mb-8">THANK YOU FOR YOUR TIME!</h2>

      {/* Футер */}
      <Footer />
    </div>
  );
}

export default Animals;
