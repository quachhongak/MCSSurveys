import { Question } from "./question";
import { Resource } from "./resource";

export interface ISurvey {
    id: number;
    name: string;
    instruction: string;
    displayOrder: number;
    active: boolean;

    questions: Question[];
    resources: Resource[];


    completed?: boolean;
    surveyResult?: ISurveyResult;
}

export interface ISurveyResult {
    score: number;
    questionResults: IQuestionResult[];
}

export interface IQuestionResult {
    question: string;
    userAnswer: string;
    isCorrect: boolean;
    explanation?: string;
}