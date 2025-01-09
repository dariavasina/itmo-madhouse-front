import React, { useState } from 'react';
import '../styles/testing.css'; // Подключение стилей

const Test2 = () => {
  const [answers, setAnswers] = useState({
    house: '',
    dreams: '',
    magicalCreatures: '',
    hardSubjects: '',
    unusualMagic: '',
  });
  const [result, setResult] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const questions = [
    { question: "Какой ваш дом в Хогвартсе?", type: "select", key: "house", options: ["Гриффиндор", "Слизерин", "Равенкло", "Хаффлпафф"] },
    { question: "Бывали ли у вас магические сновидения, которые вы не можете объяснить?", type: "select", key: "dreams", options: ["Да", "Нет", "Иногда"] },
    { question: "Видели ли вы когда-либо в своих снах магических существ или явления, которые не существовали в реальности?", type: "select", key: "magicalCreatures", options: ["Да", "Нет", "Иногда"] },
    { question: "Какие магические предметы вам даются с трудом (например, трансфигурация, зельеварение)?", type: "text", key: "hardSubjects" },
    { question: "Сталкивались ли вы с нестандартными проявлениями магии (например, неосознанно изменяя окружающий мир)?", type: "select", key: "unusualMagic", options: ["Да", "Нет", "Иногда"] },
  ];

  const handleAnswerChange = (key, value) => {
    setAnswers({ ...answers, [key]: value });
  };

  const handleSubmit = async () => {
    setIsSubmitting(true);

    console.log(answers); // Для проверки ответа в консоли

    // try {
    //   // Здесь мы отправляем данные на сервер
    //   const response = await fetch('/api/submit', {
    //     method: 'POST',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     },
    //     body: JSON.stringify(answers),
    //   });

    //   if (response.ok) {
    //     setResult("Ваши ответы успешно отправлены! Спасибо за участие.");
    //   } else {
    //     setResult("Произошла ошибка при отправке данных. Попробуйте еще раз.");
    //   }
    // } catch (error) {
    //   setResult("Произошла ошибка при отправке данных. Попробуйте еще раз.");
    // } finally {
    //   setIsSubmitting(false);
    // }
  };

  return (
    <div className="testing-container">
      <div className="questions-container">
        {questions.map((q, index) => (
          <div key={index} className="question-block">
            <p className="question-text">{q.question}</p>
            {q.type === "select" ? (
              <select
                value={answers[q.key] || ""}
                onChange={(e) => handleAnswerChange(q.key, e.target.value)}
                className="answer-select"
              >
                <option value="">Выберите ответ</option>
                {q.options.map((option, idx) => (
                  <option key={idx} value={option}>{option}</option>
                ))}
              </select>
            ) : (
              <textarea
                className="answer-input"
                placeholder="Ваш ответ..."
                value={answers[q.key] || ""}
                onChange={(e) => handleAnswerChange(q.key, e.target.value)}
              />
            )}
          </div>
        ))}
      </div>
      <button
        className="submit-button"
        onClick={handleSubmit}
        disabled={isSubmitting}
      >
        {isSubmitting ? "Отправка..." : "Пройти тест"}
      </button>
      {result && (
        <div className="result-container">
          <h2 className="result-text">{result}</h2>
        </div>
      )}
    </div>
  );
};

export default Test2;
