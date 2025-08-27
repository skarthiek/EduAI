import { MongoClient, WithId, Document } from 'mongodb';
import { Quiz } from '../types/quiz';

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const client = new MongoClient(uri);
const dbName = 'EduAI';

export class QuizService {
  constructor() {
    client.connect();
  }

  async saveQuiz(quiz: Quiz): Promise<string> {
    const db = client.db(dbName);
    const collection = db.collection('quizzes');
    const result = await collection.insertOne(quiz);
    return result.insertedId.toString();
  }

  async getQuizByCode(code: string): Promise<Quiz | null> {
    const db = client.db(dbName);
    const collection = db.collection('quizzes');
    const quizDocument: WithId<Document> | null = await collection.findOne({ uniqueCode: code });
    
    if (!quizDocument) return null;

    const quiz: Quiz = {
      id: quizDocument._id.toString(),
      title: quizDocument.title,
      description: quizDocument.description,
      questions: quizDocument.questions,
      category: quizDocument.category,
      difficulty: quizDocument.difficulty,
      createdBy: quizDocument.createdBy,
      createdAt: quizDocument.createdAt,
      uniqueCode: quizDocument.uniqueCode,
      isActive: quizDocument.isActive,
    };

    return quiz;
  }
}
