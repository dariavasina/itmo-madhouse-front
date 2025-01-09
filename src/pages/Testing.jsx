import React, { useState } from 'react';
import Test1 from './Test1';
import Test2 from './Test2';
import '../styles/testing.css'; // Подключение стилей

const Testing = () => {
  const [selectedTest, setSelectedTest] = useState('');

  const handleTestSelect = (test) => {
    setSelectedTest(test);
  };

  const handleBackToSelection = () => {
    setSelectedTest('');
  };

  return (
    <div className="testing-container">
      <h1 className="title">Магическое тестирование</h1>
      {!selectedTest ? (
        <div className="test-selection">
          <h2>Выберите тест:</h2>
          <button onClick={() => handleTestSelect('hogwarts')} className="select-button">
            Тест по дому в Хогвартсе
          </button>
          <button onClick={() => handleTestSelect('condition')} className="select-button">
            Тест на психологическое состояние
          </button>
        </div>
      ) : (
        <div>
          <button onClick={handleBackToSelection} className="back-button">
            Вернуться к выбору тестов
          </button>
          {selectedTest === 'hogwarts' ? <Test2 /> : <Test1 />}
        </div>
      )}
    </div>
  );
};

export default Testing;
