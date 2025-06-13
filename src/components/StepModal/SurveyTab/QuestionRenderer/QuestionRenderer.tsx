import * as React from 'react';
import './QuestionRenderer.scss';
import { MultipleChoiceQuestion, Question, TrueFalseQuestion } from '../../../../models/question';

interface QuestionRendererProps {
  question: Question,
  answer?: string,
  readonly?: boolean,
  onAnswerChange: (question: string, answer: string) => void,
  questionNumber: number,
  totalQuestions: number,

}

const QuestionRenderer = ({ question, answer, readonly, onAnswerChange, questionNumber, totalQuestions }: QuestionRendererProps) => {
  const handleAnswerChange = (value: string) => {
    onAnswerChange(question.question, value);
  };

  const renderSingleChoice = () => (
    <div className="question-renderer__options">
      {'options' in question && question.options.map((option: string, index: number) => (
        <label key={index} className="question-renderer__option">
          <input
            type="radio"
            name={`question-${question.question}`}
            value={option}
            checked={answer === option}
            onChange={(e) => handleAnswerChange(e.target.value)}
            className="question-renderer__radio"
            disabled={readonly}
          />
          <span className="question-renderer__option-text">{option}</span>
        </label>
      ))}
    </div>
  );

  const renderMultipleChoice = () => (
    <div className="question-renderer__options">
      {(question as MultipleChoiceQuestion).options.map((option: string, index: number) => (
        <label key={index} className="question-renderer__option">
          <input
            type="checkbox"
            name={`question-${question.question}`}
            value={option}
            checked={answer?.includes(option)}
            onChange={(e) => {
              const newAnswer = e.target.checked
                ? [...(answer?.split(';') || []), option].join(';')
                : (answer?.split(';') || []).filter((ans) => ans !== option).join(';');
              handleAnswerChange(newAnswer);
            }}
            className="question-renderer__checkbox"
            disabled={readonly}
          />
          <span className="question-renderer__option-text">{option}</span>
        </label>
      ))}
    </div>
  );

  const renderTrueFalse = () => (
    <div className="question-renderer__options">
      {(question as TrueFalseQuestion).options.map((option: string, index: number) => (
        <label className="question-renderer__option">
          <input
            type="radio"
            name={`question-${question.question}`}
            value="true"
            checked={answer === option}
            onChange={() => handleAnswerChange(option)}
            className="question-renderer__radio"
            disabled={readonly}
          />
          <span className="question-renderer__option-text" style={{ textTransform: 'capitalize' }}>
            {option}
          </span>
        </label>
      ))}
    </div>
  );

  const renderFillInBlank = () => (
    <div className="question-renderer__input-group">
      <input
        type="text"
        value={answer || ''}
        onChange={(e) => handleAnswerChange(e.target.value)}
        placeholder="Enter your answer..."
        className="question-renderer__text-input"
        aria-label="Answer input"
        disabled={readonly}
      />
    </div>
  );

  const renderQuestionContent = () => {
    switch (question.type) {
      case 'multiple-choice':
        return renderMultipleChoice();
      case 'single-choice':
        return renderSingleChoice();
      case 'true-false':
        return renderTrueFalse();
      case 'fill-in-blank':
        return renderFillInBlank();
      default:
        return <div>Unsupported question type</div>;
    }
  };

  return (
    <div className="question-renderer">
      <div className="question-renderer__header">
        <div className="question-renderer__number">
          Question {questionNumber} of {totalQuestions}
        </div>
        <div className="question-renderer__type">
          {question.type.replace('-', ' ').replace(/\b\w/g, (l: string) => l.toUpperCase())}
        </div>
      </div>

      <div className="question-renderer__content">
        <h4 className="question-renderer__question">{question.question}</h4>
        {renderQuestionContent()}
      </div>
    </div>
  );
};

export default QuestionRenderer;