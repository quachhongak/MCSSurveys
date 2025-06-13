import * as React from 'react';
import { useSurvey } from '../../context';
import Modal from '../common/Modal';
import TabContainer from '../common/TabContainer';
import ResourcesTab from './ResourcesTab';
import SurveyTab from './SurveyTab';
import './StepModal.scss';

const StepModal = () => {
  const { state, dispatch } = useSurvey();

  const handleClose = () => {
    dispatch({ type: 'CLOSE_STEP' });
  };

  if (!state.currentStep) {
    return null;
  }

  const tabs = [
    {
      id: 'resources',
      label: 'Resources',
      icon: '📚',
      content: <ResourcesTab resources={state.currentStep.resources} />
    },
    {
      id: 'survey',
      label: 'Survey',
      icon: '📝',
      content: <SurveyTab questions={state.currentStep.questions} />
    }
  ];

  return (
    <Modal
      isOpen={!!state.currentStep}
      onClose={handleClose}
      title={state.currentStep.name}
      size="extra-large"
      className="step-modal"
    >
      <div className="step-modal__content">
        <div className="step-modal__description">
          {state.currentStep.instruction}
        </div>

        <div className="step-modal__tabs">
          <TabContainer tabs={tabs} defaultTab={0} />
        </div>
      </div>
    </Modal>
  );
};

export default StepModal;