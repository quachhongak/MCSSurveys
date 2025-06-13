import { WebPartContext } from "@microsoft/sp-webpart-base";

export interface IMcsSurveysProps {
  wpContext: WebPartContext;
  submitSurveyApiUrl?: string;
}
