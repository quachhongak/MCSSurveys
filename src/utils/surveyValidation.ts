import { Question } from "../models/question";
import { ISurveyResult } from "../models/survey";

const checkAnswer = (question: Question, userAnswer: string) => {
  if (!userAnswer) {
    return false;
  }

  switch (question.type) {
    case 'multiple-choice':
      return userAnswer === 'question.correctAnswer';

    case 'true-false':
      return userAnswer === 'question.correctAnswer';

    case 'fill-in-blank':
      // Case-insensitive comparison, trim whitespace
      return userAnswer.toString().toLowerCase().trim() ===
        'question.correctAnswer'.toString().toLowerCase().trim();

    default:
      return false;
  }
};

export const validateSurvey = (questions: Question[], answers: Record<string, string>) => {
  const results = {
    score: 0,
    passed: false,
    totalQuestions: questions.length,
    correctAnswers: 0,
    questionResults: [] as any,
  };

  questions.forEach((question) => {
    const userAnswer = answers[question.question];
    const isCorrect = checkAnswer(question, userAnswer);

    if (isCorrect) {
      results.correctAnswers++;
    }

    results.questionResults.push({
      questionId: question.question,
      userAnswer: userAnswer || '',
      correctAnswer: '',
      isCorrect,
      explanation: '',
      question: question.question,
      type: question.type,
    });
  });

  results.score = Math.round((results.correctAnswers / results.totalQuestions) * 100);
  results.passed = results.score === 100;

  return results;
};

export const isAnswerComplete = (question: Question, answer: string): boolean => {
  if (answer === null || answer === undefined) {
    return false;
  }

  switch (question.type) {
    case 'multiple-choice':
      return !!answer && answer.trim() !== '';

    case 'true-false':
      return !!answer

    case 'fill-in-blank':
      return !!answer && answer.toString().trim() !== '';

    case 'single-choice':
      return !!answer && answer.trim() !== '';

    default:
      return false;
  }
};

export const getAllAnswersComplete = (questions: Question[], answers: Record<string, string>) => {
  return questions.every((question) => isAnswerComplete(question, answers[question.question]));
};

export const isPassed = (result: ISurveyResult): boolean => {
  return result.score === result.questionResults.length;
}