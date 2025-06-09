import React, { useState, useEffect, useRef } from 'react';

// Función auxiliar para normalizar cadenas (convertir a minúsculas y quitar acentos)
const normalizeString = (str) => {
  return str
    .toLowerCase()
    .normalize("NFD") // Normaliza a la forma de descomposición canónica (separa letras de acentos)
    .replace(/[\u0300-\u036f]/g, ""); // Elimina los diacríticos (acentos, tildes, etc.)
};

// Componente del Juego de Pasapalabra
function PasapalabraGame({ onGameComplete }) {
  // Estado para las preguntas del Pasapalabra
  // Las preguntas se inicializan ya ordenadas alfabéticamente para el rosco circular
  const initialQuestions = [
    { letter: 'A', question: 'Empieza por la A. Mes de verano que es ideal para irse de vacaciones.', answer: 'AGOSTO', status: 'unanswered' },
    { letter: 'B', question: 'Empieza por la B. Está en el mar y sirve para navegar.', answer: 'BARCO', status: 'unanswered' },
    { letter: 'C', question: 'Empieza por la C. Lugar de Andalucía que se llama Tacita de Plata.', answer: 'CÁDIZ', status: 'unanswered' },
    { letter: 'D', question: 'Empieza por la D. Adjetivo que dirías para definir unas vacaciones.', answer: 'DIVERTIDAS', status: 'unanswered' },
    { letter: 'E', question: 'Empieza por E. País donde vives.', answer: 'ESPAÑA', status: 'unanswered' },
    { letter: 'F', question: 'Contiene la F. Algo que se toma en el desayuno.', answer: 'CAFÉ', status: 'unanswered' },
    { letter: 'G', question: 'Empieza por G. Nombre de un chico guapo y simpático.', answer: 'GERARDO', status: 'unanswered' },
    { letter: 'H', question: 'Contiene la H. ¿Cómo le llamamos a mamá?', answer: 'CHOCHA', status: 'unanswered' },
    { letter: 'I', question: 'Empieza por I. Nombre de chica que cumple años hoy.', answer: 'ISEIA', status: 'unanswered' },
    { letter: 'J', question: 'Empieza por J. Alimento muy rico que viene del cerdo.', answer: 'JAMÓN', status: 'unanswered' },
    { letter: 'K', question: 'Contiene la K. Nombre de un gatito muy majo.', answer: 'MIKO', status: 'unanswered' },
    { letter: 'L', question: 'Empieza por L. Primer día de la semana perfecto para comenzar un viaje.', answer: 'LUNES', status: 'unanswered' },
    { letter: 'M', question: 'Empieza por M. Nombre de mamá.', answer: 'MAITE', status: 'unanswered' }, // Cambiada la respuesta de 'MUMI' a 'MAITE'
    { letter: 'N', question: 'Contiene la N. Comunidad autónoma española que está al sur y que hace mucho calorcito y se bailan sevillanas.', answer: 'ANDALUCÍA', status: 'unanswered' },
    { letter: 'Ñ', question: 'Contiene la Ñ. Desayuno que puede ser de chocolate.', answer: 'CAÑA', status: 'unanswered' },
    { letter: 'O', question: 'Empieza por la O. Nombre de chica que cumplió años el 7 de junio.', answer: 'OLAIA', status: 'unanswered' }, 
    { letter: 'P', question: 'Empieza por la P. Sitio con mar que visitaremos en verano.', answer: 'PLAYA', status: 'unanswered' },
    { letter: 'Q', question: 'Contiene la Q. Palabra que dice Iseia cuando quiere imitar a los andaluces.', answer: 'CHIQUILLO', status: 'unanswered' },
    { letter: 'R', question: 'Empieza por la R. Algo que haces cuando te lo pasas bien.', answer: 'REIR', status: 'unanswered' },
    { letter: 'S', question: 'Empieza por la S. Ciudad andaluza donde dicen Ozú.', answer: 'SEVILLA', status: 'unanswered' },
    { letter: 'T', question: 'Empieza por la T. Modo de transporte para viajar a Andalucía.', answer: 'TREN', status: 'unanswered' },
    { letter: 'U', question: 'Contiene la U. Que no os gusta que le toque a mamá.', answer: 'CULO', status: 'unanswered' },
    { letter: 'V', question: 'Empieza por V. El AVE va a mucha...', answer: 'VELOCIDAD', status: 'unanswered' },
    { letter: 'W', question: 'Empieza por W. Sitio web para comprar cositas.', answer: 'WALLAPOP', status: 'unanswered' },
    { letter: 'X', question: 'Contiene la X. Transporte público que se puede coger para ir a algún sitio.', answer: 'TAXI', status: 'unanswered' },
    { letter: 'Y', question: 'Empieza por Y. Apellido del mejor jugador del fútbol de este año.', answer: 'YAMAL', status: 'unanswered' },
    { letter: 'Z', question: 'Empieza por Z. Ciudad desde la que sale el AVE.', answer: 'ZARAGOZA', status: 'unanswered' }
  ].sort((a, b) => a.letter.localeCompare(b.letter)); // Aseguramos el orden alfabético

  const [questions, setQuestions] = useState(initialQuestions);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [answerInput, setAnswerInput] = useState('');
  const [score, setScore] = useState(0);
  const [gameEnded, setGameEnded] = useState(false);
  const inputRef = useRef(null);

  // Focus en el input cuando cambia la pregunta
  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [currentQuestionIndex, gameEnded]);

  // Maneja la lógica al enviar una respuesta
  const handleAnswerSubmit = () => {
    if (gameEnded) return;

    const currentQ = questions[currentQuestionIndex];
    // Normalizar la respuesta del usuario y la respuesta correcta para la comparación
    const normalizedUserAnswer = normalizeString(answerInput);
    const normalizedCorrectAnswer = normalizeString(currentQ.answer);

    const newQuestions = [...questions]; // Crear una copia para no mutar el estado directamente
    let newScore = score; // Usar una variable local para el score temporal

    if (normalizedUserAnswer === normalizedCorrectAnswer) {
      // Respuesta correcta
      newQuestions[currentQuestionIndex].status = 'correct';
      newScore = score + 1; // Incrementar el score local
      console.log(`[DEBUG] Letra: ${currentQ.letter}, User Input (normalizado): '${normalizedUserAnswer}', Respuesta Correcta (normalizada): '${normalizedCorrectAnswer}', Resultado: correcto`); // Log de depuración detallado
    } else {
      // Respuesta incorrecta
      newQuestions[currentQuestionIndex].status = 'incorrect';
      console.log(`[DEBUG] Letra: ${currentQ.letter}, User Input (normalizado): '${normalizedUserAnswer}', Respuesta Correcta (normalizada): '${normalizedCorrectAnswer}', Resultado: incorrecto`); // Log de depuración detallado
    }

    setQuestions(newQuestions); // Actualizar el estado de las preguntas
    setScore(newScore); // Actualizar el estado del score
    setAnswerInput('');
    moveToNextQuestion(newScore); // Pasar el score actualizado a la siguiente función
  };

  // Maneja la lógica de "Pasar Palabra"
  const handleSkip = () => {
    if (gameEnded) return;

    // Solo pasamos si la pregunta no ha sido respondida
    if (questions[currentQuestionIndex].status === 'unanswered') {
      const newQuestions = [...questions];
      newQuestions[currentQuestionIndex].status = 'skipped'; // Marcar como saltada para una segunda ronda
      setQuestions(newQuestions);
      console.log(`[DEBUG] Letra: ${questions[currentQuestionIndex].letter}, Acción: Pasada`); // Log de depuración para "Pasar"
    }
    setAnswerInput('');
    moveToNextQuestion(score); // Pasar el score actual (no cambia al pasar)
  };

  // Mueve a la siguiente pregunta no respondida o finaliza el juego
  // Recibe 'currentScore' para la evaluación final precisa
  const moveToNextQuestion = (currentScore) => {
    const totalUnansweredOrSkipped = questions.filter(q => q.status === 'unanswered' || q.status === 'skipped').length;

    if (totalUnansweredOrSkipped === 0) {
      // Todas las preguntas respondidas o saltadas, el juego ha terminado
      setGameEnded(true);
      // Calcular el score final real contando las preguntas con status 'correct'
      const finalActualScore = questions.filter(q => q.status === 'correct').length;
      console.log(`[DEBUG] Final check: Calculated Score from questions array = ${finalActualScore}, Questions Length = ${questions.length}`); // Log de depuración final
      // Notificar al componente padre que el juego ha terminado y si todas fueron correctas, pasando el score final real
      onGameComplete(finalActualScore === questions.length, finalActualScore, questions.length); 
      return;
    }

    let nextIndex = (currentQuestionIndex + 1) % questions.length;
    let attempts = 0; // Para evitar bucles infinitos
    while (questions[nextIndex].status !== 'unanswered' && questions[nextIndex].status !== 'skipped' && attempts < questions.length * 2) {
      nextIndex = (nextIndex + 1) % questions.length;
      attempts++;
    }

    if (attempts >= questions.length * 2) {
      // Si no se encontró ninguna pregunta después de múltiples intentos, el juego ha terminado.
      setGameEnded(true);
      const finalActualScore = questions.filter(q => q.status === 'correct').length;
      console.log(`[DEBUG] Final check (No more questions found): Calculated Score from questions array = ${finalActualScore}, Questions Length = ${questions.length}`);
      onGameComplete(finalActualScore === questions.length, finalActualScore, questions.length); // Pasa el score final real aquí también
    } else {
      setCurrentQuestionIndex(nextIndex);
    }
  };

  // Resetea el juego
  const resetGame = () => {
    // Volvemos a ordenar alfabéticamente para asegurar el rosco correcto al reiniciar
    const resetQ = initialQuestions.map(q => ({ ...q, status: 'unanswered' })).sort((a, b) => a.letter.localeCompare(b.letter));
    setQuestions(resetQ);
    setCurrentQuestionIndex(0);
    setAnswerInput('');
    setScore(0);
    setGameEnded(false);
  };

  // Determinar el color de la letra en el rosco
  const getLetterColorClass = (status) => {
    switch (status) {
      case 'correct':
        return 'bg-green-500'; // Correcta
      case 'incorrect':
        return 'bg-red-500'; // Incorrecta
      case 'skipped':
        return 'bg-blue-400'; // Pasada
      default:
        return 'bg-gray-400'; // Sin responder
    }
  };

  const currentQ = questions[currentQuestionIndex];

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-700 to-purple-900 p-4 font-sans text-white">
      <div className="bg-white bg-opacity-10 backdrop-filter backdrop-blur-lg rounded-2xl shadow-2xl p-8 md:p-12 text-center max-w-3xl w-full animate-fade-in-up">
        {/* El mensaje "¡Bienvenido al Pasapalabra del Regalo!" solo se muestra si el juego NO ha terminado */}
        {!gameEnded && (
          <>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
              ¡Bienvenido al Pasapalabra del Regalo!
            </h1>
            <p className="text-xl md:text-2xl mb-8 font-medium">
              Resuelve el rosco para obtener tu premio.
            </p>
          </>
        )}

        {gameEnded ? (
          // Si el juego ha terminado, y todas las respuestas son correctas,
          // el componente PasapalabraGame no renderiza nada,
          // dejando que el componente App renderice la página del premio.
          // Si no todas son correctas, muestra el mensaje de reintento.
          score === questions.length ? (
            null // NO renderiza nada aquí si todas son correctas, para que el padre controle el flujo
          ) : (
            <div className="mt-8">
              <p className="text-3xl md:text-4xl font-bold text-white mb-4">
                ¡Juego Terminado!
              </p>
              <p className="text-2xl md:text-3xl font-semibold mb-6">
                Respuestas Correctas: {score} de {questions.length}
              </p>
              <p className="text-red-300 text-2xl font-semibold mb-4">
                Parece que no acertaste todas las palabras. ¡Pero no te rindas! Inténtalo de nuevo.
              </p>
              <button
                onClick={resetGame}
                className="bg-purple-600 text-white py-3 px-6 rounded-xl text-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:bg-purple-700 focus:outline-none focus:ring-4 focus:ring-purple-300"
              >
                Intentar de Nuevo
              </button>
            </div>
          )
        ) : (
          <>
            {/* Rosco de letras: Contenedor circular */}
            <div className="relative w-[min(90vw,500px)] h-[min(90vw,500px)] mx-auto my-8">
              {questions.map((q, index) => {
                const numLetters = questions.length;
                const angleStep = (2 * Math.PI) / numLetters;
                const radius = (Math.min(window.innerWidth, 500) * 0.4);
                const centerOffset = (Math.min(window.innerWidth, 500) * 0.45);

                // Calcula el ángulo para cada letra, comenzando desde la parte superior
                const angle = index * angleStep - Math.PI / 2;
                const x = centerOffset + radius * Math.cos(angle);
                const y = centerOffset + radius * Math.sin(angle);

                return (
                  <div
                    key={q.letter}
                    className={`absolute flex items-center justify-center w-10 h-10 md:w-12 md:h-12 rounded-full font-bold text-white text-lg md:text-xl
                      ${getLetterColorClass(q.status)}
                      ${index === currentQuestionIndex ? 'border-4 border-yellow-300 animate-bounce-custom' : ''}
                      transition-all duration-300 transform hover:scale-110`}
                    style={{
                      left: `${x}px`,
                      top: `${y}px`,
                      transform: 'translate(-50%, -50%)',
                    }}
                  >
                    {q.letter}
                  </div>
                );
              })}
            </div>

            {/* Pregunta actual */}
            <div className="bg-white bg-opacity-20 rounded-lg p-4 mb-6">
              <p className="text-2xl md:text-3xl font-semibold mb-4 text-white">
                {currentQ.question}
              </p>
            </div>

            {/* Input y botones de respuesta */}
            <div className="flex flex-col md:flex-row gap-4 justify-center items-center mb-6">
              <input
                type="text"
                value={answerInput}
                onChange={(e) => setAnswerInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleAnswerSubmit();
                  }
                }}
                ref={inputRef}
                className="w-full md:w-auto flex-grow px-4 py-3 rounded-xl text-xl font-semibold text-gray-800 bg-white focus:outline-none focus:ring-4 focus:ring-purple-300 transition-all duration-300"
                placeholder="Escribe tu respuesta aquí..."
              />
              <div className="flex gap-4 w-full md:w-auto">
                <button
                  onClick={handleAnswerSubmit}
                  className="w-full py-3 px-6 rounded-xl text-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-green-500 text-white hover:bg-green-600 focus:outline-none focus:ring-4 focus:ring-green-300"
                >
                  Responder
                </button>
                <button
                  onClick={handleSkip}
                  className="w-full py-3 px-6 rounded-xl text-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg bg-blue-500 text-white hover:bg-blue-600 focus:outline-none focus:ring-4 focus:ring-blue-300"
                >
                  Pasar Palabra
                </button>
              </div>
            </div>

            <p className="text-lg md:text-xl text-white/90">
              Respuestas correctas: {score}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

// Main App component
export default function App() {
  // State to manage the current page ('countdown', 'congratulations', 'pasapalabra', or 'prize')
  const [currentPage, setCurrentPage] = useState('countdown');
  // States for the prize page logic
  const [prizeCountdown, setPrizeCountdown] = useState(10);
  const [showPrizeButton, setShowPrizeButton] = useState(false);
  const [showTickets, setShowTickets] = useState(false); 


  // Calculate the target date (June 20, 2025, 15:00:00)
  const targetDate = new Date('2025-06-20T15:00:00').getTime();
  // Calculate the initial time left in seconds
  const calculateTimeLeft = () => {
    const now = new Date().getTime();
    const difference = targetDate - now;
    // Ensure timeLeft is not negative
    return Math.max(0, Math.floor(difference / 1000));
  };

  // State for the countdown timer (in seconds)
  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
  // State for the 6-digit code entered by the user
  const [code, setCode] = useState(['', '', '', '', '', '']);
  // State to display error messages
  const [errorMessage, setErrorMessage] = useState('');
  // Refs for each input field to manage focus
  const inputRefs = useRef([]);

  // Hardcoded correct code for validation (151244)
  const CORRECT_CODE = ['1', '5', '1', '2', '4', '4'];

  // Effect hook for the main countdown timer
  useEffect(() => {
    if (timeLeft === 0 || currentPage !== 'countdown') {
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft((prevTime) => Math.max(0, prevTime - 1));
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft, currentPage]);

  // Effect hook for the prize page countdown and button visibility
  useEffect(() => {
    if (currentPage === 'prize' && prizeCountdown > 0 && !showTickets) {
      const timer = setInterval(() => {
        setPrizeCountdown((prevTime) => prevTime - 1);
      }, 1000);
      return () => clearInterval(timer);
    } else if (currentPage === 'prize' && prizeCountdown === 0 && !showTickets) {
      setShowPrizeButton(true);
    }
  }, [currentPage, prizeCountdown, showTickets]);

  // Function to handle input changes for the code fields
  const handleCodeChange = (e, index) => {
    const value = e.target.value;
    if (value.length <= 1 && /^\d*$/.test(value)) {
      const newCode = [...code];
      newCode[index] = value;
      setCode(newCode);

      if (value && index < CORRECT_CODE.length - 1) {
        inputRefs.current[index + 1]?.focus();
      }
    }
  };

  // Function to handle backspace key press
  const handleKeyDown = (e, index) => {
    if (e.key === 'Backspace' && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  // Function to validate the entered code
  const validateCode = () => {
    if (code.some(digit => digit === '')) {
      setErrorMessage('Por favor, ingresa el código completo.');
      return;
    }

    if (JSON.stringify(code) === JSON.stringify(CORRECT_CODE)) {
      setErrorMessage('');
      setCurrentPage('congratulations'); // Changed to 'congratulations' page
    } else {
      setErrorMessage('¡Este no es el código correcto!');
      setCode(['', '', '', '', '', '']);
      inputRefs.current[0]?.focus();
    }
  };

  // Helper function to format seconds into days, hours, minutes, and seconds
  const formatTime = (seconds) => {
    const days = Math.floor(seconds / (3600 * 24));
    seconds %= (3600 * 24);
    const hours = Math.floor(seconds / 3600);
    seconds %= 3600;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;

    return `${days}d ${String(hours).padStart(2, '0')}h ${String(minutes).padStart(2, '0')}m ${String(remainingSeconds).padStart(2, '0')}s`;
  };

  // Render the Countdown and Code Input page
  const renderCountdownPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-indigo-500 to-purple-600 p-4 font-sans text-white">
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-md w-full animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
          Cuenta Atrás hasta el 20 de Junio
        </h1>
        <div className="text-4xl md:text-5xl font-extrabold mb-8 text-white animate-pulse-grow">
          {timeLeft > 0 ? formatTime(timeLeft) : '¡Tiempo terminado!'}
        </div>

        {timeLeft > 0 && (
          <>
            <p className="text-xl md:text-2xl mb-6 font-medium">
              Ingresa el código secreto:
            </p>
            <div className="flex justify-center space-x-2 md:space-x-3 mb-8">
              {code.map((digit, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  value={digit}
                  onChange={(e) => handleCodeChange(e, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  ref={(el) => (inputRefs.current[index] = el)}
                  className="w-10 h-14 md:w-12 md:h-16 text-center text-3xl md:text-4xl font-bold rounded-lg bg-white bg-opacity-30 text-white border-2 border-white focus:outline-none focus:ring-4 focus:ring-purple-300 focus:ring-opacity-75 transition-all duration-300 placeholder-white/50"
                  placeholder="_"
                  disabled={timeLeft === 0}
                />
              ))}
            </div>

            {errorMessage && (
              <p className="text-red-300 mb-4 text-lg font-semibold animate-shake">
                {errorMessage}
              </p>
            )}

            <button
              onClick={validateCode}
              disabled={timeLeft === 0}
              className={`w-full py-3 px-6 rounded-xl text-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg
                ${timeLeft === 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-white text-purple-600 hover:bg-purple-100 focus:outline-none focus:ring-4 focus:ring-purple-300'
                }`}
            >
              Verificar Código
            </button>
          </>
        )}

        {timeLeft === 0 && (
          <p className="text-red-300 text-xl md:text-2xl font-semibold animate-fade-in mt-6">
            ¡El tiempo ha expirado! No puedes ingresar el código.
          </p>
        )}
      </div>
    </div>
  );

  // Render the Congratulations page with the "Ir al Regalo" button
  const renderCongratulationsPage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-green-500 to-teal-600 p-4 font-sans text-white">
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-lg w-full animate-fade-in-up">
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
          ¡Enhorabuena! ¡Habéis desbloqueado el regalo!
        </h1>
        <p className="text-xl md:text-2xl mb-8 font-medium">
          Haz clic en el botón de abajo para descubrir tu sorpresa.
        </p>
        <button
          onClick={() => setCurrentPage('pasapalabra')} // Navigate to Pasapalabra game
          className="inline-block bg-white text-teal-600 py-3 px-6 rounded-xl text-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:bg-teal-100 focus:outline-none focus:ring-4 focus:ring-teal-300"
        >
          Ir al Regalo
        </button>
      </div>
    </div>
  );

  // Render the final prize page after Pasapalabra is completed
  const renderPrizePage = () => (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-yellow-500 to-orange-600 p-4 font-sans text-white">
      <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-2xl shadow-xl p-8 md:p-12 text-center max-w-lg w-full animate-fade-in-up">
        {/* Contenido que se muestra antes o durante la cuenta atrás */}
        {!showTickets && (
          <>
            <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white drop-shadow-lg">
              ¡Enhorabuena! ¡Habéis desbloqueado el premio!
            </h1>
            <p className="text-xl md:text-2xl mb-4 font-medium">
              ¿Tenéis idea de qué es? Pensad en las palabras que han salido en el rosco... Os dejo unos segundos
            </p>
            {prizeCountdown > 0 ? (
              <p className="text-6xl md:text-7xl font-extrabold mb-8 text-white animate-pulse-grow">
                {prizeCountdown}
              </p>
            ) : (
              <button
                onClick={() => setShowTickets(true)} // Al hacer clic, mostrar los tickets
                className="inline-block bg-white text-orange-600 py-3 px-6 rounded-xl text-xl font-semibold transition-all duration-300 ease-in-out transform hover:scale-105 shadow-lg hover:bg-orange-100 focus:outline-none focus:ring-4 focus:ring-orange-300"
              >
                Accede al premio
              </button>
            )}
          </>
        )}

        {/* Billetes de tren simulados (se muestran cuando showTickets es true) */}
        {showTickets && (
          <div className="flex flex-col gap-6 w-full mt-8 animate-fade-in-up">
            {/* Billete para OLAIA */}
            <div className="bg-white text-gray-800 rounded-lg p-6 shadow-lg border-2 border-gray-300 relative overflow-hidden transform rotate-1">
              <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-l-lg"></div>
              <div className="relative z-10 flex flex-col items-center">
                <p className="text-sm font-semibold text-gray-500 mb-2">BILLETE DE TREN</p>
                <p className="text-2xl md:text-3xl font-bold text-center mb-4">
                  Nombre del viajero: <span className="text-blue-700">OLAIA</span>
                </p>
                <div className="border-t border-dashed border-gray-400 w-full my-4"></div>
                <p className="text-xl font-semibold mb-2">Destino:</p>
                <p className="text-2xl font-bold text-blue-700 text-center">
                  Miniparada en Madrid, Playita de Cádiz, Sevilla
                </p>
              </div>
              {/* Círculos decorativos del billete */}
              <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full"></div>
            </div>

            {/* Billete para ISEIA */}
            <div className="bg-white text-gray-800 rounded-lg p-6 shadow-lg border-2 border-gray-300 relative overflow-hidden transform -rotate-1">
              <div className="absolute inset-y-0 left-0 w-2 bg-gradient-to-br from-blue-400 to-blue-600 rounded-l-lg"></div>
              <div className="relative z-10 flex flex-col items-center">
                <p className="text-sm font-semibold text-gray-500 mb-2">BILLETE DE TREN</p>
                <p className="text-2xl md:text-3xl font-bold text-center mb-4">
                  Nombre del viajero: <span className="text-blue-700">ISEIA</span>
                </p>
                <div className="border-t border-dashed border-gray-400 w-full my-4"></div>
                <p className="text-xl font-semibold mb-2">Destino:</p>
                <p className="text-2xl font-bold text-blue-700 text-center">
                  Miniparada en Madrid, Playita de Cádiz, Sevilla
                </p>
              </div>
              {/* Círculos decorativos del billete */}
               <div className="absolute right-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full"></div>
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-8 h-8 bg-gray-100 rounded-full"></div>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  // Main render logic: show different pages based on state
  return (
    <div className="min-h-screen">
      {currentPage === 'countdown' && renderCountdownPage()}
      {currentPage === 'congratulations' && renderCongratulationsPage()}
      {currentPage === 'pasapalabra' && <PasapalabraGame onGameComplete={(success, score, totalQuestions) => {
        console.log("Pasapalabra completado, éxito:", success); 
        console.log("Score final del Pasapalabra:", score, "de", totalQuestions); 
        if (success) {
          setCurrentPage('prize'); // If Pasapalabra is solved, go to the prize page
          setPrizeCountdown(10); // Reset prize countdown
          setShowPrizeButton(false); // Hide the button until the countdown ends
          setShowTickets(false); // Hide tickets at the start of the prize page
        } else {
          // If not all answers are correct, PasapalabraGame handles showing the "Try Again" button
          // and we don't change the page, so the user can retry.
          setCurrentPage('pasapalabra'); // Ensure we stay on the pasapalabra page
        }
      }} />}
      {currentPage === 'prize' && renderPrizePage()}
    </div>
  );
}
