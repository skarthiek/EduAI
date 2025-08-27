import React, { useState } from 'react';
import { Plus, Copy, BookOpen, Users, Code, LogOut } from 'lucide-react';
import { Quiz } from '../types/quiz';

interface AdminPanelProps {
  quizzes: Quiz[];
  onCreateQuiz: (quiz: Quiz) => void;
  onLogout: () => void;
  userName: string;
}

export function AdminPanel({ quizzes, onCreateQuiz, onLogout, userName }: AdminPanelProps) {
  const [topicInput, setTopicInput] = useState('');
  const [numberOfQuestions, setNumberOfQuestions] = useState(3);
  const [difficulty, setDifficulty] = useState<'easy' | 'medium' | 'hard'>('easy');
  const [isCreating, setIsCreating] = useState(false);
  const [copiedCode, setCopiedCode] = useState('');

  const generateQuizCode = (): string => {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  };

  const handleCreateQuiz = async () => {
    if (!topicInput) return;

    setIsCreating(true);

    try {
      const response = await fetch('http://localhost:3001/api/quiz/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          topic: topicInput,
          difficulty: difficulty,
          numberOfQuestions: numberOfQuestions,
          category: 'General'
        }),
      });

      const data = await response.json();
      console.log('Backend response:', data); // Debug log

      if (data.success) {
        console.log('Quiz data received:', data.quiz); // Debug log
        
        // Save the generated quiz to database
        const saveResponse = await fetch('http://localhost:3001/api/quiz/save', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(data.quiz),
        });

        const saveData = await saveResponse.json();
        
        if (saveData.success) {
          console.log('Quiz saved successfully:', saveData);
          onCreateQuiz(data.quiz);
        } else {
          console.error('Error saving quiz:', saveData.error);
        }
      } else {
        console.error('Error generating quiz:', data.error);
      }
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setTopicInput('');
      setIsCreating(false);
    }
  };

  const copyToClipboard = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(''), 2000);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Dashboard</h1>
            <p className="text-gray-600">Welcome back, {userName}! Create and manage your quizzes</p>
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

        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 mb-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6 flex items-center gap-3">
            <Plus className="w-7 h-7 text-blue-600" />
            Create New Quiz
          </h2>
          
          <div className="flex flex-col sm:flex-row gap-4 items-end">
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Enter Topic
              </label>
              <input
                type="text"
                value={topicInput}
                onChange={(e) => setTopicInput(e.target.value)}
                placeholder="Enter topic name"
                className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
              />
            </div>
            
            <div className="flex-1">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Number of Questions
              </label>
              <input
                type="number"
                value={numberOfQuestions}
                onChange={(e) => setNumberOfQuestions(Number(e.target.value))}
                min="1"
                className="w-20 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 bg-white/50"
              />
            </div>
            
            <div className="flex-1">
              <button
                onClick={handleCreateQuiz}
                disabled={isCreating || !topicInput}
                className={`px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1 ${
                  isCreating || !topicInput ? 'opacity-50 cursor-not-allowed' : 'hover:from-blue-700 hover:to-purple-700'
                }`}
              >
                {isCreating ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                    Creating...
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    <Plus className="w-5 h-5" />
                    Create Quiz
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Created Quizzes */}
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8 border border-white/20">
          <h2 className="text-2xl font-semibold text-gray-800 mb-6">Created Quizzes</h2>
          
          {quizzes.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500 text-lg">No quizzes created yet</p>
              <p className="text-gray-400">Create your first quiz to get started!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              {quizzes.map((quiz) => (
                <div
                  key={quiz.id}
                  className="bg-white/60 rounded-xl p-6 border border-gray-100 hover:shadow-lg transition-all duration-300"
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-xl font-semibold text-gray-800 mb-2">{quiz.title}</h3>
                      <p className="text-gray-600 mb-2">{quiz.questions.length} questions</p>
                      <p className="text-sm text-gray-500">
                        Created {new Date(quiz.createdAt).toLocaleDateString()}
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="bg-gradient-to-r from-blue-100 to-purple-100 rounded-lg px-4 py-2">
                        <div className="flex items-center gap-2">
                          <Code className="w-4 h-4 text-blue-600" />
                          <span className="font-mono text-lg font-bold text-blue-700">
                            {quiz.uniqueCode}
                          </span>
                        </div>
                      </div>
                      
                      <button
                        onClick={() => copyToClipboard(quiz.uniqueCode)}
                        className={`p-2 rounded-lg transition-all duration-200 ${
                          copiedCode === quiz.uniqueCode
                            ? 'bg-green-100 text-green-600'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                      >
                        <Copy className="w-5 h-5" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
