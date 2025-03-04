import React, { useState, useEffect, useRef } from 'react';
import './QuizStyles.css';
import { motion, AnimatePresence } from 'framer-motion';
import Confetti from 'react-confetti';

const FileUpload = () => {
  const [quizQuestions, setQuizQuestions] = useState([]);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(null);
  const [fileName, setFileName] = useState('');
  const [showQuiz, setShowQuiz] = useState(false);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showResults, setShowResults] = useState(false);
  const [quizId, setQuizId] = useState(null);
  const [quizStats, setQuizStats] = useState(null);
  const [resultAnalytics, setResultAnalytics] = useState(null);
  const [reviewMode, setReviewMode] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [timerActive, setTimerActive] = useState(false);
  const [theme, setTheme] = useState('cyber');
  const [achievements, setAchievements] = useState([]);
  const [hints, setHints] = useState({});
  const [maxStreak, setMaxStreak] = useState(0);

  const fileInputRef = useRef(null);
  const timerRef = useRef(null);

  useEffect(() => {
    if (timerActive) {
      timerRef.current = setInterval(() => setTimeSpent((prev) => prev + 1), 1000);
      return () => clearInterval(timerRef.current);
    }
  }, [timerActive]);

  useEffect(() => {
    if (loading) {
      const interval = setInterval(() => {
        setLoadingProgress((prev) => (prev < 95 ? prev + Math.random() * 10 : 95));
      }, 200);
      return () => clearInterval(interval);
    } else {
      setLoadingProgress(0);
    }
  }, [loading]);

  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'ArrowRight') nextQuestion();
      if (e.key === 'ArrowLeft') prevQuestion();
    };
    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [currentQuestion, selectedAnswers]);

  const handleFileUpload = async (event) => {
    const file = event.target?.files?.[0] || event;
    if (!file || !file.type || !file.type.includes('pdf')) {
      setError('Please upload a PDF file');
      return;
    }
    setFileName(file.name);
    setLoading(true);
    setError(null);
    resetQuizState();
    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('https://quiz-app-cfhf.onrender.com/upload', {
        method: 'POST',
        body: formData,
      });
      if (!response.ok) throw new Error('Failed to upload file');
      const data = await response.json();
      if (data.error) throw new Error(data.error);
      setLoadingProgress(100);
      setTimeout(() => {
        setQuizId(data.quizId);
        setQuizQuestions(data.quizQuestions);
        setShowQuiz(true);
        setTimerActive(true);
        setLoading(false);
      }, 500);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const resetQuizState = () => {
    setQuizQuestions([]);
    setSelectedAnswers({});
    setScore(null);
    setShowQuiz(false);
    setCurrentQuestion(0);
    setShowResults(false);
    setQuizStats(null);
    setResultAnalytics(null);
    setTimeSpent(0);
    setReviewMode(false);
    setAchievements([]);
    setHints({});
    setMaxStreak(0);
  };

  const handleAnswerChange = (questionIndex, answer) => {
    const isCorrect = answer === quizQuestions[questionIndex].correctAnswer;
    setSelectedAnswers((prev) => ({ ...prev, [questionIndex]: answer }));
    setHints((prev) => (isCorrect ? { ...prev, [questionIndex]: undefined } : {
      ...prev,
      [questionIndex]: quizQuestions[questionIndex].explanation || 'Review the key concepts.',
    }));
  };

  const nextQuestion = () => {
    if (currentQuestion < quizQuestions.length - 1) setCurrentQuestion((prev) => prev + 1);
    else calculateAndSubmitResults();
  };

  const prevQuestion = () => {
    if (currentQuestion > 0) setCurrentQuestion((prev) => prev - 1);
  };

  const calculateAndSubmitResults = async () => {
    setTimerActive(false);
    let totalScore = 0;
    let currentStreak = 0;
    let maxStreakTemp = 0;
    const questionAnalytics = {};

    quizQuestions.forEach((question, index) => {
      const isCorrect = selectedAnswers[index] === question.correctAnswer;
      if (isCorrect) {
        currentStreak++;
        maxStreakTemp = Math.max(maxStreakTemp, currentStreak);
        totalScore++;
      } else {
        currentStreak = 0;
      }
      questionAnalytics[index] = { isCorrect, selectedAnswer: selectedAnswers[index], correctAnswer: question.correctAnswer };
    });

    setMaxStreak(maxStreakTemp);
    setScore(totalScore);
    setAchievements([
      ...(totalScore === quizQuestions.length ? ['Perfect Score!'] : []),
      ...(maxStreakTemp >= 5 ? [`${maxStreakTemp}-Streak Master`] : []),
    ]);
    setResultAnalytics({ questionAnalytics, timeSpent, averageTimePerQuestion: timeSpent / quizQuestions.length });

    try {
      const response = await fetch('https://quiz-app-cfhf.onrender.com/submit-result', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ quizId, selectedAnswers, score: totalScore, totalQuestions: quizQuestions.length, timeSpent }),
      });
      if (!response.ok) throw new Error('Failed to submit results');
      await fetchQuizStats();
      setShowResults(true);
    } catch (err) {
      setError('Failed to submit results: ' + err.message);
    }
  };

  const fetchQuizStats = async () => {
    try {
      const response = await fetch(`https://quiz-app-cfhf.onrender.com/quiz-stats/${quizId}`);
      if (!response.ok) throw new Error('Failed to fetch stats');
      setQuizStats(await response.json());
    } catch (err) {
      setError('Failed to fetch stats: ' + err.message);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' + secs : secs}`;
  };

  const toggleReviewMode = () => setReviewMode((prev) => !prev && setCurrentQuestion(0) || !prev);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files?.[0]) handleFileUpload(e.dataTransfer.files[0]);
  };

  const progressPercentage = quizQuestions.length ? ((currentQuestion + 1) / quizQuestions.length) * 100 : 0;

  const toggleTheme = () => setTheme((prev) => ['cyber', 'neon', 'minimal'][(['cyber', 'neon', 'minimal'].indexOf(prev) + 1) % 3]);

  return (
    <div className={`futuristic-container theme-${theme}`}>
      {[...Array(15)].map((_, i) => <div key={i} className="particle" />)}
      <motion.div className="theme-toggle" whileHover={{ scale: 1.1 }} onClick={toggleTheme}>
        <span className="theme-icon">🎨</span>
      </motion.div>
      <div className="content-wrapper">
        <header className="futuristic-header">
          <motion.h1 className="title" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            Interactive Learning Hub
          </motion.h1>
          <div className="glowing-line" />
          <motion.p className="subtitle" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.4, duration: 0.6 }}>
            Master your material with AI-powered quizzes
          </motion.p>
        </header>

        {!showQuiz && !showResults && (
          <motion.div
            className={`upload-container ${dragActive ? 'drag-active' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="upload-box">
              <motion.div
                className="upload-icon"
                animate={{ rotateX: [0, 15, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <span role="img" aria-label="book">📖</span>
              </motion.div>
              <h3>Upload Learning Material</h3>
              <p>Drop a PDF or click to browse</p>
              <label className="custom-file-upload">
                <input ref={fileInputRef} type="file" onChange={handleFileUpload} accept=".pdf" />
                <motion.span
                  className="upload-text"
                  whileHover={{ backgroundColor: 'rgba(0,255,255,0.2)' }}
                  transition={{ duration: 0.2 }}
                >
                  {fileName || 'Select PDF'}
                </motion.span>
              </label>
            </div>
          </motion.div>
        )}

        <AnimatePresence>
          {loading && (
            <motion.div
              className="loading-container"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="spinner" />
              <p>Generating Quiz... {loadingProgress.toFixed(0)}%</p>
              <div className="loading-bar">
                <motion.div
                  className="loading-progress"
                  initial={{ width: '0%' }}
                  animate={{ width: `${loadingProgress}%` }}
                  transition={{ duration: 0.5 }}
                />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {error && (
            <motion.div
              className="error-message"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              ⚠️ {error}
              <button className="close-btn" onClick={() => setError(null)}>✕</button>
            </motion.div>
          )}
        </AnimatePresence>

        {showQuiz && !showResults && (
          <motion.div
            className="quiz-interface"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="quiz-header">
              <div className="progress-bar">
                <motion.div
                  className="progress"
                  initial={{ width: '0%' }}
                  animate={{ width: `${progressPercentage}%` }}
                  transition={{ duration: 0.3 }}
                />
                <span>{currentQuestion + 1} / {quizQuestions.length}</span>
              </div>
              <div className="timer">⏱️ {formatTime(timeSpent)}</div>
            </div>
            <AnimatePresence mode="wait">
              <motion.div
                key={currentQuestion}
                className="question"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -30 }}
                transition={{ duration: 0.3 }}
              >
                <h3>{quizQuestions[currentQuestion].question}</h3>
                <div className="options">
                  {quizQuestions[currentQuestion].choices.map((choice, idx) => (
                    <motion.label
                      key={idx}
                      className={`option ${selectedAnswers[currentQuestion] === choice ? 'selected' : ''}`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <input
                        type="radio"
                        name={`q${currentQuestion}`}
                        value={choice}
                        checked={selectedAnswers[currentQuestion] === choice}
                        onChange={() => handleAnswerChange(currentQuestion, choice)}
                      />
                      {choice}
                      {hints[currentQuestion] && selectedAnswers[currentQuestion] === choice && (
                        <motion.span
                          className="hint"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                          transition={{ duration: 0.3 }}
                        >
                          💡 {hints[currentQuestion]}
                        </motion.span>
                      )}
                    </motion.label>
                  ))}
                </div>
              </motion.div>
            </AnimatePresence>
            <div className="navigation">
              <motion.button
                className="nav-btn prev"
                onClick={prevQuestion}
                disabled={currentQuestion === 0}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Previous
              </motion.button>
              <motion.button
                className="nav-btn next"
                onClick={nextQuestion}
                disabled={!selectedAnswers[currentQuestion]}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {currentQuestion === quizQuestions.length - 1 ? 'Finish' : 'Next'}
              </motion.button>
            </div>
          </motion.div>
        )}

        {showResults && score !== null && (
          <motion.div
            className="results"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            <h2>Quiz Completed!</h2>
            <div className="score">
              <svg viewBox="0 0 100 100" className="score-circle">
                <circle cx="50" cy="50" r="45" className="bg" />
                <motion.circle
                  cx="50"
                  cy="50"
                  r="45"
                  className="fg"
                  strokeDasharray="283"
                  strokeDashoffset={283 - (283 * (score / quizQuestions.length))}
                  initial={{ strokeDashoffset: 283 }}
                  animate={{ strokeDashoffset: 283 - (283 * (score / quizQuestions.length)) }}
                  transition={{ duration: 1.5, ease: 'easeOut' }}
                />
                <text x="50" y="55" textAnchor="middle">{((score / quizQuestions.length) * 100).toFixed(0)}%</text>
              </svg>
              <div>
                <p>{score} / {quizQuestions.length} correct</p>
                <p>Time: {formatTime(timeSpent)}</p>
                <p>Max Streak: {maxStreak}</p>
              </div>
            </div>
            {achievements.length > 0 && (
              <motion.div className="achievements" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                <h3>Achievements</h3>
                {achievements.map((ach, idx) => (
                  <motion.div
                    key={idx}
                    className="achievement"
                    initial={{ x: -100 }}
                    animate={{ x: 0 }}
                    transition={{ delay: idx * 0.2, duration: 0.5 }}
                  >
                    🏆 {ach}
                  </motion.div>
                ))}
              </motion.div>
            )}
            <div className="stats">
              <h3>Performance</h3>
              <div className="metrics">
                <div>⚡ Avg. Time: {(timeSpent / quizQuestions.length).toFixed(1)}s</div>
                <div>🎯 Accuracy: {((score / quizQuestions.length) * 100).toFixed(1)}%</div>
                <div>🏆 Rank: {quizStats && (score / quizQuestions.length) * 100 > quizStats.average_score ? 'Above Avg' : 'Keep Going'}</div>
              </div>
              {quizStats && (
                <>
                  <h3>Class Stats</h3>
                  <div className="metrics">
                    <div>📊 Avg: {quizStats.average_score.toFixed(1)}%</div>
                    <div>🥇 Top: {quizStats.highest_score.toFixed(1)}%</div>
                    <div>👥 Taken: {quizStats.times_taken}</div>
                  </div>
                </>
              )}
            </div>
            <div className="actions">
              <motion.button className="action-btn" onClick={toggleReviewMode} whileHover={{ scale: 1.05 }}>
                {reviewMode ? 'Hide Review' : 'Review Answers'}
              </motion.button>
              <motion.button className="action-btn" onClick={() => window.location.reload()} whileHover={{ scale: 1.05 }}>
                New Quiz
              </motion.button>
            </div>
            <AnimatePresence>
              {reviewMode && (
                <motion.div
                  className="review"
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: 'auto', opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.4 }}
                >
                  <div className="review-nav">
                    <button onClick={prevQuestion} disabled={currentQuestion === 0}>←</button>
                    <span>{currentQuestion + 1} / {quizQuestions.length}</span>
                    <button onClick={nextQuestion} disabled={currentQuestion === quizQuestions.length - 1}>→</button>
                  </div>
                  <div className="review-content">
                    <h4>{quizQuestions[currentQuestion].question}</h4>
                    {quizQuestions[currentQuestion].choices.map((choice, idx) => {
                      const isSelected = selectedAnswers[currentQuestion] === choice;
                      const isCorrect = choice === quizQuestions[currentQuestion].correctAnswer;
                      return (
                        <div
                          key={idx}
                          className={`review-option ${isSelected ? 'selected' : ''} ${isCorrect ? 'correct' : isSelected ? 'incorrect' : ''}`}
                        >
                          {choice} {isCorrect ? '✓' : isSelected && !isCorrect ? '✗' : ''}
                        </div>
                      );
                    })}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
        {showResults && <Confetti recycle={false} numberOfPieces={score === quizQuestions.length ? 400 : 150} />}
      </div>
    </div>
  );
};

export default FileUpload;