import * as React from 'react';
import { useSurvey } from '../../../context';
import { getAllAnswersComplete } from '../../../utils';
import Button from '../../common/Button';
import QuestionRenderer from './QuestionRenderer';
import SurveyResults from './SurveyResults';
import './SurveyTab.scss';
import { Question } from '../../../models/question';
import SurveyService from '../../../services/surveyService';

interface ISurveyTabProps {
  questions: Question[];
}

const SurveyTab = ({ questions }: ISurveyTabProps) => {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const { state, wpContext, submitSurveyApiUrl, dispatch } = useSurvey();

  const surveyService = new SurveyService(wpContext)

  const handleAnswerChange = (questionId: string, answer: string) => {
    dispatch({
      type: 'UPDATE_ANSWER',
      payload: { questionId, answer }
    });
  };

  const handleSubmit = async (e: any) => {
    e.preventDefault();

    if (!submitSurveyApiUrl) {
      console.error("Submit API URL is not defined.");
      return;
    }

    if (!state.currentUser) {
      console.error("Current user is not defined.");
      return;
    }

    if (!state.currentStep) {
      console.error("Current step is not defined.");
      return;
    }

    const userAnswers = Object.entries(state.currentAnswers).reduce((acc, [question, answer]) => {
      acc.push({
        question: question,
        userAnswer: answer
      });
      return acc;
    }, [] as { question: string; userAnswer: string }[]);

    try {
      setIsSubmitting(true);

      const results = await surveyService.submitSurvey(
        submitSurveyApiUrl,
        state.currentStep.id,
        state.currentUser.id,
        userAnswers,
      )

      dispatch({
        type: 'SUBMIT_SURVEY',
        payload: { results }
      });
    } catch (error) {
      console.error("Error submitting survey:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const isFormComplete = getAllAnswersComplete(questions, state.currentAnswers);

  // Show results if they exist
  if (state.showResults && state.surveyResults) {
    return <SurveyResults results={state.surveyResults} />;
  }

  return (
    <div className="survey-tab">
      <div className="survey-tab__header">
        <h3 className="survey-tab__title">Assessment Survey</h3>
        <p className="survey-tab__description">
          Answer all questions correctly to pass this step. You need 100% accuracy to proceed.
        </p>
        <div className="survey-tab__progress">
          <div className="survey-tab__progress-text">
            Progress: {Object.keys(state.currentAnswers).length} of {questions.length} questions answered
          </div>
          <div className="survey-tab__progress-bar">
            <div
              className="survey-tab__progress-fill"
              style={{
                width: `${(Object.keys(state.currentAnswers).length / questions.length) * 100}%`
              }}
            />
          </div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="survey-tab__form">
        <div className="survey-tab__questions">
          {questions.map((question, index: number) => (
            <QuestionRenderer
              key={question.question}
              question={question}
              answer={state.currentAnswers[question.question]}
              onAnswerChange={handleAnswerChange}
              questionNumber={index + 1}
              totalQuestions={questions.length}
              readonly={isSubmitting}
            />
          ))}
        </div>

        <div className="survey-tab__actions">
          <Button
            type="submit"
            variant="primary"
            size="large"
            disabled={!isFormComplete || isSubmitting}
            className={"survey-tab__submit-btn" + (isSubmitting ? " spinner" : "")}
          >
            Submit Survey
          </Button>

          {!isFormComplete && (
            <p className="survey-tab__incomplete-message">
              Please answer all questions before submitting.
            </p>
          )}
        </div>
      </form>
    </div>
  );
};

export default SurveyTab;