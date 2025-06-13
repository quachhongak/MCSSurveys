import * as React from 'react';
import { useSurvey } from '../../../context';
import './StepCard.scss';
import { ISurvey } from '../../../models/survey';
import { Shimmer } from '@fluentui/react';

interface IStepCardProps {
  step: ISurvey;
  disabledStart?: boolean;
}

const StepCard = ({ step, disabledStart }: IStepCardProps) => {
  const { state, dispatch } = useSurvey();
  const { isLoadingUserAnswers } = state;

  const handleClick = () => {
    if (disabledStart || isLoadingUserAnswers) {
      return;
    }

    dispatch({ type: 'OPEN_STEP', payload: step });
  };

  const handleKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      handleClick();
    }
  };

  return (
    <div
      className={`step-card ${step.completed ? 'step-card--completed' : ''}`}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      tabIndex={0}
      role="button"
      aria-label={`Open ${step.name}`}
    >
      <div className="step-card__header">
        <h3 className="step-card__title">{step.name}</h3>
        {
          isLoadingUserAnswers
            ? (
              <Shimmer />
            )
            : (
              <div className={`step-card__status ${step.completed ? 'step-card__status--completed' : 'step-card__status--pending'
                }`}>
                {step.completed ? (
                  <span className="step-card__status-icon">✓</span>
                ) : (
                  <span className="step-card__status-icon">○</span>
                )}
                <span className="step-card__status-text">
                  {step.completed ? 'Completed' : 'Pending'}
                </span>
              </div>
            )
        }
      </div>

      <div className="step-card__content">
        <p className="step-card__description">{step.instruction}</p>

        <div className="step-card__meta">
          <div className="step-card__resources">
            <span className="step-card__meta-label">Resources:</span>
            <span className="step-card__meta-value">{step.resources.length}</span>
          </div>
          <div className="step-card__questions">
            <span className="step-card__meta-label">Questions:</span>
            <span className="step-card__meta-value">{step.questions.length}</span>
          </div>
        </div>
      </div>

      <div className="step-card__footer">
        {
          isLoadingUserAnswers
            ? (
              <Shimmer />
            )
            : (
              !disabledStart
                ? (<span className="step-card__cta">
                  {step.completed ? 'Review' : 'Start'} →
                </span>)
                : (
                  <span className="step-card__cta">
                    Complete previous steps first
                  </span>
                )

            )
        }
      </div>
    </div>
  );
};

export default StepCard;