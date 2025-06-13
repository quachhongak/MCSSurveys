export type QuestionType = "multiple-choice" | "single-choice" | "true-false" | "fill-in-blank";

export interface BaseQuestion {
    type: QuestionType;
    question: string;
}

export interface SingleChoiceQuestion extends BaseQuestion {
    type: "single-choice";
    options: string[];
}

export interface MultipleChoiceQuestion extends BaseQuestion {
    type: "multiple-choice";
    options: string[];
}

export interface TrueFalseQuestion extends BaseQuestion {
    type: "true-false";
    options: string[]; // Typically ["True", "False"]
}

export interface FillInBlankQuestion extends BaseQuestion {
    type: "fill-in-blank";
}

export type Question =
    | MultipleChoiceQuestion
    | TrueFalseQuestion
    | FillInBlankQuestion
    | SingleChoiceQuestion;