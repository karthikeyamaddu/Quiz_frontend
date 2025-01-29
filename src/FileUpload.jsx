import React, { useState, useEffect } from 'react';
import './QuizStyles.css';

const FileUpload = () => {
    const [quizQuestions, setQuizQuestions] = useState([]);
    const [selectedAnswers, setSelectedAnswers] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [score, setScore] = useState(null);
    const [fileName, setFileName] = useState('');
    const [showQuiz, setShowQuiz] = useState(false);
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [showResults, setShowResults] = useState(false);
    const [quizId, setQuizId] = useState(null);
    const [quizStats, setQuizStats] = useState(null);
    const [resultAnalytics, setResultAnalytics] = useState(null);

    useEffect(() => {
        const particles = document.querySelectorAll('.particle');
        particles.forEach(particle => {
            particle.style.left = `${Math.random() * 100}vw`;
            particle.style.animationDuration = `${Math.random() * 3 + 2}s`;
            particle.style.opacity = Math.random();
        });
    }, []);

    const handleFileUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        if (!file.type.includes('pdf')) {
            setError('Please upload a PDF file');
            return;
        }

        setFileName(file.name);
        setLoading(true);
        setError(null);
        setQuizQuestions([]);
        setSelectedAnswers({});
        setScore(null);
        setShowQuiz(false);
        setCurrentQuestion(0);
        setShowResults(false);
        setQuizStats(null);
        setResultAnalytics(null);

        const formData = new FormData();
        formData.append('file', file);

        try {
            const response = await fetch('https://quiz-app-d38s.onrender.com/upload', { // Updated URL
                method: 'POST',
                body: formData,
            });

            if (!response.ok) throw new Error('Failed to upload file');

            const data = await response.json();
            if (data.error) throw new Error(data.error);
            if (!data.quizQuestions || !Array.isArray(data.quizQuestions)) {
                throw new Error('Invalid quiz format received');
            }

            setQuizId(data.quizId);
            setQuizQuestions(data.quizQuestions);
            setTimeout(() => setShowQuiz(true), 500);
        } catch (error) {
            setError(error.message || 'Error uploading file');
        } finally {
            setLoading(false);
        }
    };

    const handleAnswerChange = (questionIndex, answer) => {
        setSelectedAnswers(prev => ({
            ...prev,
            [questionIndex]: answer
        }));
    };

    const nextQuestion = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(prev => prev + 1);
        } else {
            calculateAndSubmitResults();
        }
    };

    const calculateAndSubmitResults = async () => {
        let totalScore = 0;
        quizQuestions.forEach((question, index) => {
            if (selectedAnswers[index] === question.correctAnswer) {
                totalScore++;
            }
        });

        setScore(totalScore);

        try {
            const response = await fetch('https://quiz-app-d38s.onrender.com/submit-result', { // Updated URL
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    quizId,
                    selectedAnswers,
                    score: totalScore,
                    totalQuestions: quizQuestions.length
                }),
            });

            if (!response.ok) throw new Error('Failed to submit results');

            const data = await response.json();
            setResultAnalytics(data.analytics);
            await fetchQuizStats();
            setShowResults(true);

        } catch (error) {
            setError('Failed to submit results: ' + error.message);
        }
    };

    const fetchQuizStats = async () => {
        try {
            const response = await fetch(`https://quiz-app-d38s.onrender.com/quiz-stats/${quizId}`); // Updated URL
            if (!response.ok) throw new Error('Failed to fetch quiz statistics');
            
            const stats = await response.json();
            setQuizStats(stats);
        } catch (error) {
            setError('Failed to fetch quiz statistics: ' + error.message);
        }
    };

    return (
        <div className="futuristic-container">
            {[...Array(20)].map((_, i) => (
                <div key={i} className="particle"></div>
            ))}

            <div className="content-wrapper">
                <header className="futuristic-header">
                    <div className="header-content">
                        <h1>Interactive Learning Hub</h1>
                        <div className="glowing-line"></div>
                        <p>Transform your knowledge through AI-powered quizzes</p>
                    </div>
                </header>

                {!showQuiz && (
                    <div className="upload-container">
                        <div className="upload-box">
                            <div className="upload-icon">
                                <span>📚</span>
                                <div className="scan-line"></div>
                            </div>
                            <label className="custom-file-upload">
                                <input
                                    type="file"
                                    onChange={handleFileUpload}
                                    accept=".pdf"
                                />
                                <span className="upload-text">
                                    {fileName || 'Choose PDF File'}
                                </span>
                            </label>
                        </div>
                    </div>
                )}

                {loading && (
                    <div className="cyber-loading">
                        <div className="cyber-spinner">
                            <div className="spinner-inner"></div>
                        </div>
                        <p>Generating Quiz</p>
                        <div className="loading-bar">
                            <div className="loading-progress"></div>
                        </div>
                    </div>
                )}

                {error && (
                    <div className="error-box">
                        <div className="error-icon">⚠️</div>
                        <p>{error}</p>
                    </div>
                )}

                {showQuiz && !showResults && (
                    <div className="quiz-interface">
                        <div className="progress-bar">
                            <div
                                className="progress"
                                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                            ></div>
                        </div>

                        <div className="question-display">
                            <div className="question-number">
                                Question {currentQuestion + 1}/{quizQuestions.length}
                            </div>

                            <div className="question-content">
                                <h3>{quizQuestions[currentQuestion].question}</h3>

                                <div className="options-container">
                                    {quizQuestions[currentQuestion].choices.map((choice, idx) => (
                                        <label
                                            key={idx}
                                            className={`option-box ${
                                                selectedAnswers[currentQuestion] === choice ? 'selected' : ''
                                            }`}
                                        >
                                            <input
                                                type="radio"
                                                name={`question${currentQuestion}`}
                                                value={choice}
                                                checked={selectedAnswers[currentQuestion] === choice}
                                                onChange={() => handleAnswerChange(currentQuestion, choice)}
                                            />
                                            <span className="option-text">{choice}</span>
                                            <div className="option-highlight"></div>
                                        </label>
                                    ))}
                                </div>
                            </div>

                            <button
                                className="next-button"
                                onClick={currentQuestion === quizQuestions.length - 1 ? calculateAndSubmitResults : nextQuestion}
                                disabled={!selectedAnswers[currentQuestion]}
                            >
                                {currentQuestion === quizQuestions.length - 1 ? 'Finish Quiz' : 'Next Question'}
                            </button>
                        </div>
                    </div>
                )}

                {showResults && score !== null && (
                    <div className="results-container">
                        <div className="results-card">
                            <h2>Quiz Complete!</h2>
                            <div className="score-circle">
                                <div className="score-number">
                                    {((score / quizQuestions.length) * 100).toFixed(0)}%
                                </div>
                                <div className="score-label">
                                    {score} out of {quizQuestions.length} correct
                                </div>
                            </div>

                            {quizStats && (
                                <div className="stats-section">
                                    <h3>Quiz Statistics</h3>
                                    <div className="stats-grid">
                                        <div className="stat-item">
                                            <span className="stat-label">Average Score</span>
                                            <span className="stat-value">
                                                {quizStats.average_score.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Highest Score</span>
                                            <span className="stat-value">
                                                {quizStats.highest_score.toFixed(1)}%
                                            </span>
                                        </div>
                                        <div className="stat-item">
                                            <span className="stat-label">Times Taken</span>
                                            <span className="stat-value">{quizStats.times_taken}</span>
                                        </div>
                                    </div>
                                </div>
                            )}

                            <button
                                className="restart-button"
                                onClick={() => window.location.reload()}
                            >
                                Take Another Quiz
                            </button>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default FileUpload;
