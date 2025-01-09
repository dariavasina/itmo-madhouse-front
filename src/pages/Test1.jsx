import React, { useState } from 'react';
import '../styles/testing.css'; // Подключение стилей

const Test1 = () => {
  const [answers, setAnswers] = useState([]);
  const [result, setResult] = useState(null);
  const [description, setDescription] = useState("");

  const questions = [
    { question: "Как вы чувствуете себя в магически насыщенной среде?", options: ["Спокойно", "Легкое беспокойство", "Головная боль", "Потеря сознания"] },
    { question: "Как вы реагируете на магический предмет?", options: ["Никак", "Любопытство", "Тревога", "Дезориентация"] },
    { question: "Когда вы используете заклинание на себе, как это влияет на вас?", options: ["Я чувствую себя уверенно", "Легкая усталость", "Неприятные побочные эффекты", "Дезориентация"] },
    { question: "Что вы чувствуете при взгляде на зеркало, показывающее ваши страхи?", options: ["Никаких эмоций", "Легкий страх", "Беспокойство", "Паника"] },
    { question: "Вам когда-либо ставили диагноз магического расстройства?", options: ["Нет", "Да, но не влияло", "Да, магическое заболевание", "Да, серьезное расстройство"] },
    { question: "Как ваше тело реагирует на сильное магическое воздействие?", options: ["Никак", "Легкое напряжение", "Головная боль или слабость", "Теряю сознание"] },
    { question: "Какую роль играют в вашей жизни магические предметы?", options: ["Не играют", "Использую время от времени", "Использую для контроля", "Зависимость"] },
    { question: "Как вы чувствуете себя при встрече с магическим существом (например, драконом)?", options: ["Восхищение", "Легкий страх", "Тревога", "Паника"] },
    { question: "Как часто вы испытываете магическое воздействие на ваше сознание?", options: ["Очень редко", "Иногда", "Часто", "Постоянно"] },
    { question: "Как вы относитесь к магическому лечению?", options: ["Не против", "Сомневаюсь", "Предпочел бы избежать", "Боюсь, что это повредит мне"] },
  ];

  const handleAnswerChange = (index, answer) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = answer;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = () => {
    let score = 0;
    answers.forEach(answer => {
      score += answer;
    });

    let diagnosis = "";
    let diagDescription = "";

    if (score < 15) {
      diagnosis = "Нормальное состояние";
      diagDescription = "Вы в хорошем психическом состоянии и не испытываете магических расстройств.";
    } else if (score < 30) {
      diagnosis = "Магическое переутомление";
      diagDescription = "Возможно, вы перенапряжены магически. Рекомендуется отдых и снижение магических нагрузок.";
    } else if (score < 45) {
      diagnosis = "Магическая депрессия";
      diagDescription = "Вы можете испытывать симптомы депрессии, связанные с магическим воздействием. Подумайте о терапии.";
    } else {
      diagnosis = "Проклятие/Магическое расстройство";
      diagDescription = "Существует серьезное магическое расстройство, возможно, проклятие. Рекомендуется немедленное лечение.";
    }

    setResult(diagnosis);
    setDescription(diagDescription);
  };

  return (
    <div className="testing-container">
      <div className="questions-container">
        {questions.map((q, index) => (
          <div key={index} className="question-block">
            <p className="question-text">{q.question}</p>
            <div className="options-container">
              {q.options.map((option, idx) => (
                <button 
                  key={idx} 
                  className={`option-button ${answers[index] === idx ? 'selected' : ''}`} 
                  onClick={() => handleAnswerChange(index, idx)}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
      <button className="submit-button" onClick={handleSubmit}>Пройти тест</button>
      {result && (
        <div className="result-container">
          <h2 className="result-text">{result}</h2>
          <p className="result-description">{description}</p>
        </div>
      )}
    </div>
  );
};

export default Test1;
