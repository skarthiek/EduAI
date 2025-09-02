const { GoogleGenerativeAI } = require('@google/generative-ai');
// Types are now defined as JSDoc comments in types/quiz.js

class GeminiService {
  constructor(apiKey) {
    this.genAI = new GoogleGenerativeAI(apiKey);
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
  }

  async generateQuiz(request) {
    const prompt = `
      Generate a ${request.difficulty} level quiz about "${request.topic}" with ${request.numberOfQuestions} multiple-choice questions.
      The quiz should be in the category: ${request.category}.
      
      For each question, provide:
      1. The question text
      2. 4 options (A, B, C, D)
      3. The correct answer (A, B, C, or D)
      4. A brief explanation
      
      Format the response as a JSON object with the following structure:
      {
        "title": "Quiz Title",
        "description": "Quiz Description",
        "questions": [
          {
            "question": "Question text",
            "options": ["Option A", "Option B", "Option C", "Option D"],
            "correctAnswer": "A",
            "explanation": "Brief explanation"
          }
        ]
      }
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response - handle markdown code blocks
      let jsonText = text;
      
      // Remove markdown code blocks if present
      if (jsonText.includes('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }
      
      // Clean up any other markdown artifacts
      jsonText = jsonText.trim();
      
      const quizData = JSON.parse(jsonText);
      return {
        ...quizData,
        createdAt: new Date(), // Ensure createdAt is set as a Date object
      };
    } catch (error) {
      console.error('Error generating quiz with Gemini:', error);
      throw new Error('Failed to generate quiz');
    }
  }

  async generateQuestions(topic, difficulty, count) {
    const prompt = `
      Generate ${count} ${difficulty} level multiple-choice questions about "${topic}".
      For each question, provide:
      - The question text
      - 4 options (A, B, C, D)
      - The correct answer (A, B, C, or D)
      - A brief explanation
      
      Return the questions as a JSON array.
    `;

    try {
      const result = await this.model.generateContent(prompt);
      const response = await result.response;
      const text = response.text();
      
      // Parse the JSON response - handle markdown code blocks
      let jsonText = text;
      
      // Remove markdown code blocks if present
      if (jsonText.includes('```json')) {
        jsonText = jsonText.replace(/```json\n?/g, '').replace(/```\n?/g, '');
      } else if (jsonText.includes('```')) {
        jsonText = jsonText.replace(/```\n?/g, '');
      }
      
      // Clean up any other markdown artifacts
      jsonText = jsonText.trim();
      
      const questions = JSON.parse(jsonText);
      return questions;
    } catch (error) {
      console.error('Error generating questions with Gemini:', error);
      throw new Error('Failed to generate questions');
    }
  }
}

module.exports = { GeminiService };
