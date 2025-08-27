import express from 'express';
import { QuizGenerationRequest, QuizGenerationResponse, Quiz } from '../types/quiz';
import { GeminiService } from '../services/geminiService';
import { QuizService } from '../services/quizService';

const router = express.Router();
const geminiService = new GeminiService('AIzaSyDQKa18SxnU0lw3OhrtlReT2p5xVGVMfi8');
const quizService = new QuizService();

// Function to generate unique 6-digit code
function generateUniqueCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Route for quiz generation using Gemini AI
router.post('/generate', async (req, res) => {
  try {
    const { topic, difficulty, numberOfQuestions, category }: QuizGenerationRequest = req.body;

    // Validate input
    if (!topic || !difficulty || !numberOfQuestions || !category) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: topic, difficulty, numberOfQuestions, category'
      });
    }

    // Generate quiz using Gemini AI
    const quizData = await geminiService.generateQuiz({
      topic,
      difficulty,
      numberOfQuestions,
      category
    });

    const quiz: QuizGenerationResponse = {
      success: true,
      quiz: {
        id: Date.now().toString(),
        title: quizData.title || `Quiz on ${topic}`,
        description: quizData.description || `A quiz about ${topic}`,
        questions: quizData.questions || [],
        category: category,
        difficulty: difficulty,
        createdBy: 'system',
        createdAt: new Date(),
        uniqueCode: generateUniqueCode(),
        isActive: true,
      },
    };

    res.json(quiz);
  } catch (error) {
    console.error('Error generating quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate quiz. Please try again.'
    });
  }
});

// Route to generate individual questions
router.post('/generate-questions', async (req, res) => {
  try {
    const { topic, difficulty, count } = req.body;

    if (!topic || !difficulty || !count) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: topic, difficulty, count'
      });
    }

    const questions = await geminiService.generateQuestions(topic, difficulty, count);
    res.json({ success: true, questions });
  } catch (error) {
    console.error('Error generating questions:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to generate questions'
    });
  }
});

// Route to save quiz to database
router.post('/save', async (req, res) => {
  try {
    const quiz: Quiz = req.body;

    if (!quiz || !quiz.questions || quiz.questions.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Invalid quiz data'
      });
    }

    const quizId = await quizService.saveQuiz(quiz);
    res.json({
      success: true,
      quizId,
      uniqueCode: quiz.uniqueCode,
      message: 'Quiz saved successfully'
    });
  } catch (error) {
    console.error('Error saving quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to save quiz'
    });
  }
});

// Route to get quiz by unique code
router.get('/code/:code', async (req, res) => {
  try {
    const { code } = req.params;

    if (!code || code.length !== 6) {
      return res.status(400).json({
        success: false,
        error: 'Invalid code format. Must be 6 digits'
      });
    }

    const quiz = await quizService.getQuizByCode(code);

    if (!quiz) {
      return res.status(404).json({
        success: false,
        error: 'Quiz not found'
      });
    }

    res.json({
      success: true,
      quiz
    });
  } catch (error) {
    console.error('Error retrieving quiz:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to retrieve quiz'
    });
  }
});

export default router;
