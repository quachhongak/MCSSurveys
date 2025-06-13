import * as React from 'react';
import './McsSurveys.scss';
import type { IMcsSurveysProps } from './IMcsSurveysProps';
import { SurveyProvider } from '../../../context';
import StepsList from '../../../components/StepsList';
import StepModal from '../../../components/StepModal';

const McsSurveys = ({
  wpContext,
  submitSurveyApiUrl
}: IMcsSurveysProps) => {

  return (
    <SurveyProvider wpContext={wpContext} submitSurveyApiUrl={submitSurveyApiUrl}>
      <div className="app">
        <div className="app__container">
          <StepsList />
          <StepModal />
        </div>
      </div>
    </SurveyProvider>
  )
}

export default McsSurveys;