import React, { useState } from 'react';
import { ArrowRight, ArrowLeft, RotateCcw, Trophy, X, CheckCircle, XCircle, LogOut } from 'lucide-react';
import { Quiz, QuizResult } from '../types/quiz';

interface UserPanelProps {
  quizzes: Quiz[];
  onLogout: () => void;
  userName: string;
}

export function UserPanel({ quizzes, onLogout, userName }: UserPanelProps) {
  const [quizCode, setQuizCode] = useState('');
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [quizResults, setQuizResults] = useState<QuizResult[]>([]);
  const [showResults, setShowResults] = useState(false);
  const [showAnswer, setShowAnswer] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleJoinQuiz = async () => {
    if (!quizCode || quizCode.length !== 6) {
      setError('Please enter a valid 6-digit code');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const response = await fetch(`http://localhost:3001/api/quiz/code/${quizCode}`);
      const data = await response.json();

      if (data.success) {
        setCurrentQuiz(data.quiz);
        setCurrentQuestionIndex(0);
        setQuizResults([]);
        setShowResults(false);
        setSelectedAnswer(null);
        setShowAnswer(false);
      } else {
        setError(data.error || 'Quiz not found');
      }
    } catch (error) {
      setError('Failed to fetch quiz');
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    setShowAnswer(false);
  };

  const handleSubmitAnswer = () => {
    if (selectedAnswer === null || !currentQuiz) return;

    const currentQuestion = currentQuiz.questions[currentQuestionIndex];
    const isCorrect = selectedAnswer === ['A', 'B', 'C', 'D'].indexOf(currentQuestion.correctAnswer);
    
    const result: QuizResult = {
      questionId: currentQuestion.id,
      selectedAnswer,
      isCorrect
    };

    setQuizResults([...quizResults, result]);

    if (!isCorrect) {
      setShowAnswer(true);
      return;
    }

    // Move to next question or show results
    if (currentQuestionIndex < currentQuiz.questions.length - 1) {
      setTimeout(() => {
        setCurrentQuestionIndex(currentQuestionIndex + 1);
        setSelectedAnswer(null);
        setShowAnswer(false);
      }, 1500);
    } else {
      setTimeout(() => {
        setShowResults(true);
      }, 1500);
    }
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < currentQuiz!.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(null);
      setShowAnswer(false);
    } else {
      setShowResults(true);
    }
  };

  const handleRetakeQuiz = () => {
    setCurrentQuestionIndex(0);
    setQuizResults([]);
    setShowResults(false);
    setSelectedAnswer(null);
    setShowAnswer(false);
  };

  const handleBackToStart = () => {
    setCurrentQuiz(null);
    setQuizCode('');
    setCurrentQuestionIndex(0);
    setQuizResults([]);
    setShowResults(false);
    setSelectedAnswer(null);
    setShowAnswer(false);
    setError('');
  };

  const calculateScore = () => {
    const correctAnswers = quizResults.filter(result => result.isCorrect).length;
    return {
      correct: correctAnswers,
      total: quizResults.length,
      percentage: Math.round((correctAnswers / quizResults.length) * 100)
    };
  };

  // Quiz Code Entry Screen
  if (!currentQuiz) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-between items-center mb-8">
            <div>
              <h1 className="text-4xl font-bold text-gray-800 mb-2">User Dashboard</h1>
              <p className="text-gray-600">Welcome {userName}! Enter your quiz code to get started</p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-right">
                <p className="text-sm text-gray-600">Logged in as</p>
                <p className="font-semibold text-gray-800">{userName}</p>
              </div>
              <button
                onClick={onLogout}
                className="flex items-center gap-2 px-6 py-3 bg-red-500 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 hover:bg-red-600"
              >
                <LogOut className="w-5 h-5" />
                Logout
              </button>
            </div>
          </div>

          <div className="max-w-md mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Trophy className="w-8 h-8 text-white" />
                </div>
                <h2 className="text-2xl font-semibold text-gray-800 mb-2">Join Quiz</h2>
                <p className="text-gray-600">Enter the quiz code provided by your instructor</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quiz Code
                  </label>
                  <input
                    type="text"
                    value={quizCode}
                    onChange={(e) => {
                      setQuizCode(e.target.value.toUpperCase());
                      setError('');
                    }}
                    placeholder="Enter 6-digit code"
                    className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 bg-white/50 text-center text-lg font-mono tracking-widest"
                    maxLength={6}
                  />
                </div>

                {error && (
                  <div className="flex items-center gap-2 p-4 bg-red-50 border border-red-200 rounded-xl">
                    <XCircle className="w-5 h-5 text-red-500" />
                    <p className="text-red-700 text-sm">{error}</p>
                  </div>
                )}

                <button
                  onClick={handleJoinQuiz}
                  disabled={quizCode.length !== 6}
                  className={`w-full py-3 rounded-xl font-medium transition-all duration-300 flex items-center justify-center gap-2 ${
                    quizCode.length === 6
                      ? 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:-translate-y-1'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Join Quiz
                  <ArrowRight className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (showResults) {
    const score = calculateScore();
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
              <div className="text-center mb-8">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-4 ${
                  score.percentage >= 70 ? 'bg-green-100' : 'bg-orange-100'
                }`}>
                  <Trophy className={`w-10 h-10 ${
                    score.percentage >= 70 ? 'text-green-600' : 'text-orange-600'
                  }`} />
                </div>
                <h1 className="text-3xl font-bold text-gray-800 mb-2">Quiz Complete!</h1>
                <p className="text-gray-600">Here are your results for {currentQuiz.title}</p>
              </div>

              <div className="bg-gradient-to-r from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                <div className="text-center">
                  <div className="text-4xl font-bold text-purple-700 mb-2">
                    {score.percentage}%
                  </div>
                  <p className="text-gray-700">
                    {score.correct} out of {score.total} correct
                  </p>
                </div>
              </div>

              <div className="space-y-4 mb-8">
                {currentQuiz.questions.map((question, index) => {
                  const result = quizResults[index];
                  if (!result) return null;
                  
                  return (
                    <div
                      key={question.id}
                      className={`p-4 rounded-xl border-2 ${
                        result.isCorrect
                          ? 'bg-green-50 border-green-200'
                          : 'bg-red-50 border-red-200'
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {result.isCorrect ? (
                          <CheckCircle className="w-6 h-6 text-green-600 flex-shrink-0 mt-1" />
                        ) : (
                          <XCircle className="w-6 h-6 text-red-600 flex-shrink-0 mt-1" />
                        )}
                        <div className="flex-1">
                          <p className="font-medium text-gray-800 mb-2">
                            {question.question}
                          </p>
                          <p className={`text-sm ${
                            result.isCorrect ? 'text-green-700' : 'text-red-700'
                          }`}>
                            Your answer: {question.options[result.selectedAnswer]}
                          </p>
                          {!result.isCorrect && (
                            <p className="text-sm text-green-700 mt-1">
                              Correct answer: {question.options[['A', 'B', 'C', 'D'].indexOf(question.correctAnswer)]}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={handleRetakeQuiz}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <RotateCcw className="w-5 h-5" />
                  Retake Quiz
                </button>
                <button
                  onClick={handleBackToStart}
                  className="flex-1 flex items-center justify-center gap-2 px-6 py-3 bg-gray-600 text-white rounded-xl hover:bg-gray-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  <ArrowLeft className="w-5 h-5" />
                  New Quiz
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Quiz Question Screen
  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const isLastQuestion = currentQuestionIndex === currentQuiz.questions.length - 1;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50">
      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          {/* Header */}
          <div className="flex justify-between items-center mb-6">
            <div>
                <h1 className="text-2xl font-bold text-gray-800">{currentQuiz.title} Quiz</h1>
              <p className="text-gray-600">
                Question {currentQuestionIndex + 1} of {currentQuiz.questions.length}
              </p>
            </div>
            <button
              onClick={handleBackToStart}
              className="p-2 text-gray-600 hover:text-gray-800 hover:bg-white rounded-xl transition-all duration-200"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Progress Bar */}
          <div className="bg-white/60 rounded-full h-3 mb-8">
            <div
              className="bg-gradient-to-r from-purple-500 to-blue-500 h-3 rounded-full transition-all duration-500"
              style={{
                width: `${((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100}%`
              }}
            />
          </div>

          {/* Question Card */}
          <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
            <h2 className="text-xl font-semibold text-gray-800 mb-6">
              {currentQuestion.question}
            </h2>

            <div className="space-y-3 mb-6">
              {currentQuestion.options.map((option, index) => (
                <button
                  key={index}
                  onClick={() => handleAnswerSelect(index)}
                  disabled={showAnswer}
                  className={`w-full p-4 text-left rounded-xl border-2 transition-all duration-200 ${
                    selectedAnswer === index
                      ? showAnswer
                        ? index === ['A', 'B', 'C', 'D'].indexOf(currentQuestion.correctAnswer)
                          ? 'bg-green-100 border-green-300 text-green-800'
                          : 'bg-red-100 border-red-300 text-red-800'
                        : 'bg-purple-100 border-purple-300 text-purple-800'
                      : showAnswer && index === ['A', 'B', 'C', 'D'].indexOf(currentQuestion.correctAnswer)
                        ? 'bg-green-100 border-green-300 text-green-800'
                        : 'bg-white/50 border-gray-200 text-gray-800 hover:bg-purple-50 hover:border-purple-200'
                  } ${showAnswer ? 'cursor-not-allowed' : 'cursor-pointer hover:-translate-y-1 hover:shadow-md'}`}
                >
                  <div className="flex items-center justify-between">
                    <span>{option}</span>
                    {showAnswer && selectedAnswer === index && index !== ['A', 'B', 'C', 'D'].indexOf(currentQuestion.correctAnswer) && (
                      <XCircle className="w-5 h-5 text-red-600" />
                    )}
                    {showAnswer && index === ['A', 'B', 'C', 'D'].indexOf(currentQuestion.correctAnswer) && (
                      <CheckCircle className="w-5 h-5 text-green-600" />
                    )}
                  </div>
                </button>
              ))}
            </div>

            {showAnswer && (
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mb-6">
                <p className="text-blue-800 font-medium mb-2">Explanation:</p>
                <p className="text-blue-700">{currentQuestion.explanation}</p>
              </div>
            )}

            <div className="flex justify-between">
              <button
                onClick={handleBackToStart}
                className="flex items-center gap-2 px-6 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-all duration-300"
              >
                <ArrowLeft className="w-5 h-5" />
                Exit Quiz
              </button>

              {!showAnswer ? (
                <button
                  onClick={handleSubmitAnswer}
                  disabled={selectedAnswer === null}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-medium transition-all duration-300 ${
                    selectedAnswer !== null
                      ? 'bg-purple-600 text-white hover:bg-purple-700 hover:shadow-lg hover:-translate-y-1'
                      : 'bg-gray-200 text-gray-400 cursor-not-allowed'
                  }`}
                >
                  Submit Answer
                  <ArrowRight className="w-5 h-5" />
                </button>
              ) : (
                <button
                  onClick={handleNextQuestion}
                  className="flex items-center gap-2 px-6 py-3 bg-purple-600 text-white rounded-xl hover:bg-purple-700 transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
                >
                  {isLastQuestion ? 'View Results' : 'Next Question'}
                  <ArrowRight className="w-5 h-5" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}