import * as React from 'react';
import StepCard from './StepCard';
import './StepsList.scss';
import { useSurvey } from '../../context';
import { Spinner, SpinnerSize } from '@fluentui/react';

const StepsList = () => {
  const { state } = useSurvey()
  const { isLoadingSurveys } = state

  return (
    <div className="steps-list">
      <div className="steps-list__header">
        <h1 className="steps-list__title">React Survey Assessment</h1>
        <p className="steps-list__description">
          Complete all 12 steps to master React development. Each step includes resources and a survey that requires 100% accuracy to pass.
        </p>
      </div>

      {
        isLoadingSurveys && (
          <Spinner
            label='Loading steps...'
            size={SpinnerSize.large}
          />
        )
      }

      <div className="steps-list__grid">
        {state.surveys.map((step, index) => (
          <StepCard
            key={step.id}
            step={step}
            disabledStart={index > 0 && state.surveys[index - 1]?.completed !== true}
          />
        ))}
      </div>
    </div>
  );
};

export default StepsList;