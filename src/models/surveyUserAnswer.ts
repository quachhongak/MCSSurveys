import { IQuestionResult } from "./survey";
import { IUser } from "./user";

export interface ISurveyUserAnswer {
    id: number;
    surveyId: number;
    userAnswerResults: IQuestionResult[];
    score: number;
    submittedBy: IUser;
}