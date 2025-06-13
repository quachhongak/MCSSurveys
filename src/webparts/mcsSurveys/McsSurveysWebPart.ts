import * as React from 'react';
import * as ReactDom from 'react-dom';

import {
  PropertyPaneTextField,
  type IPropertyPaneConfiguration,
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import McsSurveys from './components/McsSurveys';
import { IMcsSurveysProps } from './components/IMcsSurveysProps';

export interface IMcsSurveysWebPartProps {
  submitSurveyApiUrl?: string;
}

export default class McsSurveysWebPart extends BaseClientSideWebPart<IMcsSurveysWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IMcsSurveysProps> = React.createElement(
      McsSurveys,
      {
        wpContext: this.context,
        submitSurveyApiUrl: this.properties.submitSurveyApiUrl,
      }
    );

    ReactDom.render(element, this.domElement);
  }

  private _setMaxWithWebPartInWorkbench() {
    if (this.context.isServedFromLocalhost) {
      const ele: HTMLDivElement | null = document.querySelector(
        "#workbenchPageContent"
      );

      if (ele) {
        ele.style.maxWidth = "100vw";
      }
    }
  }

  protected async onInit(): Promise<void> {
    this._setMaxWithWebPartInWorkbench();
    return super.onInit();
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: ''
          },
          groups: [
            {
              groupFields: [
                PropertyPaneTextField('submitSurveyApiUrl', {
                  label: 'Submit Survey API URL',
                  value: this.properties.submitSurveyApiUrl,
                }),
              ]
            }
          ]
        }
      ]
    };
  }
}
