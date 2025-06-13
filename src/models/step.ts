import { Question } from "./question";
import { Resource } from "./resource";

export interface StepData {
    id: number;
    title: string;
    description: string;
    resources: Resource[];
    questions: Question[];
}