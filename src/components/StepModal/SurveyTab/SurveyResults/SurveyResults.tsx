import * as React from 'react';
import { useSurvey } from '../../../../context';
import Button from '../../../common/Button';
import './SurveyResults.scss';
import { ISurveyResult } from '../../../../models/survey';
import { isPassed } from '../../../../utils/surveyValidation';

interface ISurveyResultsProps {
  results: ISurveyResult;
}

const SurveyResults = ({ results }: ISurveyResultsProps) => {
  const { dispatch } = useSurvey();

  const handleRetry = () => {
    dispatch({ type: 'RETRY_SURVEY' });
  };

  const handleClose = () => {
    dispatch({ type: 'CLOSE_STEP' });
  };

  const getScoreColor = (score: number) => {
    if (score === 100) return 'var(--success-color)';
    if (score >= 80) return 'var(--warning-color)';
    return 'var(--danger-color)';
  };

  const getResultIcon = (isCorrect: boolean) => {
    return isCorrect ? '✓' : '✗';
  };

  const getResultClass = (isCorrect: boolean) => {
    return isCorrect ? 'survey-results__answer--correct' : 'survey-results__answer--incorrect';
  };

  return (
    <div className="survey-results">
      <div className="survey-results__header">
        <div
          className="survey-results__score"
          style={{ color: getScoreColor(results.score) }}
        >
          {(results.score / results.questionResults.length) * 100}%
        </div>
        <div className="survey-results__status">
          {isPassed(results) ? (
            <div className="survey-results__status--passed">
              <span className="survey-results__status-icon">🎉</span>
              <span className="survey-results__status-text">Congratulations! You passed!</span>
            </div>
          ) : (
            <div className="survey-results__status--failed">
              <span className="survey-results__status-icon">😔</span>
              <span className="survey-results__status-text">You need 100% to pass. Try again!</span>
            </div>
          )}
        </div>
        <div className="survey-results__summary">
          {results.questionResults.filter(q => q.isCorrect).length} out of {results.questionResults.length} questions correct
        </div>
      </div>

      <div className="survey-results__content">
        <h3 className="survey-results__title">Detailed Results</h3>

        <div className="survey-results__questions">
          {results.questionResults.map((questionResult, index: number) => (
            <div key={questionResult.question} className="survey-results__question">
              <div className="survey-results__question-header">
                <span className="survey-results__question-number">
                  Question {index + 1}
                </span>
                <span className={`survey-results__question-status ${getResultClass(questionResult.isCorrect)}`}>
                  {getResultIcon(questionResult.isCorrect)}
                </span>
              </div>

              <div className="survey-results__question-content">
                <p className="survey-results__question-text">
                  {questionResult.question}
                </p>

                <div className="survey-results__answers">
                  <div className="survey-results__answer">
                    <span className="survey-results__answer-label">Your answer:</span>
                    <span className={`survey-results__answer-value ${getResultClass(questionResult.isCorrect)}`}>
                      {questionResult.userAnswer}
                    </span>
                  </div>

                  {/* {!questionResult.isCorrect && (
                    <div className="survey-results__answer">
                      <span className="survey-results__answer-label">Correct answer:</span>
                      <span className="survey-results__answer-value survey-results__answer--correct">
                        {questionResult.correctAnswer.toString()}
                      </span>
                    </div>
                  )} */}
                </div>

                {questionResult.isCorrect && (<div className="survey-results__explanation">
                  <strong>Explanation:</strong> {questionResult.explanation}
                </div>)}
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="survey-results__actions">
        {!isPassed(results) && (
          <Button
            variant="primary"
            onClick={handleRetry}
            className="survey-results__retry-btn"
          >
            Try Again
          </Button>
        )}
        <Button
          variant={isPassed(results) ? "primary" : "outline"}
          onClick={handleClose}
        >
          {isPassed(results) ? "Continue" : "Close"}
        </Button>
      </div>
    </div>
  );
};

export default SurveyResults;