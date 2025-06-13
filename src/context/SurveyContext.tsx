import { WebPartContext } from '@microsoft/sp-webpart-base';
import * as React from 'react';
import SurveyService from '../services/surveyService';
import { ISurvey, ISurveyResult } from '../models/survey';
import UserService from '../services/userService';
import { IUser } from '../models/user';
import { isPassed } from '../utils/surveyValidation';
import SurveyUserAnswerService from '../services/surveyUserAnswerService';

interface ISurveyState {
  currentUser: IUser | null,
  surveys: ISurvey[]
  currentStep: ISurvey | null;
  currentAnswers: Record<string, string>;
  surveyResults: ISurveyResult | null;
  showResults: boolean;

  isLoadingSurveys?: boolean;
  isLoadingUserAnswers?: boolean;
}

interface ISurveyAction {
  type: 'OPEN_STEP' | 'CLOSE_STEP' | 'UPDATE_ANSWER' | 'SUBMIT_SURVEY' | 'RETRY_SURVEY' | 'LOADED_SURVEYS' | 'LOADED_USER' | 'LOADING_SURVEYS' | 'LOADED_USER_ANSWERS';
  payload?: any;
}

interface ISurveyContext {
  wpContext: WebPartContext;
  submitSurveyApiUrl?: string;
  state: ISurveyState;
  dispatch: React.Dispatch<ISurveyAction>;
}

const SurveyContext = React.createContext<ISurveyContext | null>(null);

const initialState: ISurveyState = {
  currentUser: null,
  surveys: [],
  currentStep: null,
  currentAnswers: {},
  surveyResults: null,
  showResults: false,
  isLoadingSurveys: true,
  isLoadingUserAnswers: true,
};

const surveyReducer = (state: ISurveyState, action: ISurveyAction): ISurveyState => {
  switch (action.type) {
    case 'OPEN_STEP': {
      const currentStep = action.payload as ISurvey;

      return {
        ...state,
        currentStep: currentStep,
        currentAnswers: {},
        surveyResults: currentStep.surveyResult ? currentStep.surveyResult : null,
        showResults: !!currentStep.completed,
      };
    }
    case 'CLOSE_STEP':
      return {
        ...state,
        currentStep: null,
        currentAnswers: {},
        surveyResults: null,
        showResults: false,
      };

    case 'UPDATE_ANSWER':
      return {
        ...state,
        currentAnswers: {
          ...state.currentAnswers,
          [action.payload.questionId]: action.payload.answer,
        },
      };

    case 'SUBMIT_SURVEY': {
      if (!state.currentStep) {
        return state; // No current step to submit
      }

      const { results } = action.payload as { results: ISurveyResult };

      return {
        ...state,
        surveyResults: results,
        showResults: true,
        surveys: state.surveys.map(survey =>
          survey.id === state.currentStep!.id
            ? {
              ...survey,
              completed: isPassed(results),
              surveyResult: results,
            }
            : survey
        ),
      };
    }
    case 'RETRY_SURVEY':
      return {
        ...state,
        currentAnswers: {},
        surveyResults: null,
        showResults: false,
      };

    case 'LOADING_SURVEYS':
      return {
        ...state,
        isLoadingSurveys: true,
        isLoadingUserAnswers: true,
      };

    case 'LOADED_SURVEYS':
      return {
        ...state,
        surveys: action.payload,
        isLoadingSurveys: false,
      };

    case 'LOADED_USER':
      return {
        ...state,
        currentUser: action.payload,
      };

    case 'LOADED_USER_ANSWERS':
      return {
        ...state,
        surveys: action.payload,
        isLoadingUserAnswers: false,
      };

    default:
      return state;
  }
};

export const SurveyProvider = ({
  children,
  wpContext,
  submitSurveyApiUrl
}: {
  children: React.ReactNode,
  wpContext: WebPartContext,
  submitSurveyApiUrl?: string
}) => {
  const [state, dispatch] = React.useReducer(surveyReducer, initialState);

  const surveyService = new SurveyService(wpContext);
  const userService = new UserService(wpContext);
  const surveyUserAnswerService = new SurveyUserAnswerService(wpContext);

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        const currentUser = await userService.getCurrentUser();
        dispatch({
          type: 'LOADED_USER',
          payload: currentUser
        });

        dispatch({
          type: 'LOADING_SURVEYS'
        });

        let surveys = await surveyService.getSurveys(currentUser);

        dispatch({
          type: 'LOADED_SURVEYS',
          payload: surveys
        });

        const surveyIds = surveys.map(survey => survey.id);
        const userAnswers = await surveyUserAnswerService.getUserAnswersOfManySurveys(surveyIds, currentUser.id);

        surveys = surveys.map((survey) => {
          const userAnswerResult = userAnswers.find(ua => ua.surveyId === survey.id);

          if (userAnswerResult) {
            const isCompleted = isPassed({
              score: userAnswerResult.score,
              questionResults: userAnswerResult.userAnswerResults,
            });

            survey.completed = isCompleted;
            survey.surveyResult = {
              score: userAnswerResult.score,
              questionResults: userAnswerResult.userAnswerResults,
            }
          }

          return survey;
        });

        dispatch({
          type: 'LOADED_USER_ANSWERS',
          payload: surveys
        });
      } catch (error) {
        console.error('Failed to load surveys:', error);
      }
    }

    fetchData()
      .catch(e => {
        console.error('Error fetching surveys:', e);
      })
  }, []);

  return (
    <SurveyContext.Provider value={{ state, wpContext, submitSurveyApiUrl, dispatch }}>
      {children}
    </SurveyContext.Provider>
  );
};

export const useSurvey = () => {
  const context = React.useContext(SurveyContext);
  if (!context) {
    throw new Error('useSurvey must be used within a SurveyProvider');
  }
  return context;
};