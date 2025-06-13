import { WebPartContext } from "@microsoft/sp-webpart-base";
import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import { ISurvey, ISurveyResult } from "../models/survey";
import { Question, QuestionType } from "../models/question";
import { Resource } from "../models/resource";
import { IUser } from "../models/user";

export default class SurveyService {
    private _sp: SPFI;
    private _select = [
        "Id",
        "Title",
        "Instruction",
        "DisplayOrder",
        "Active",
        "Resources",
        "Question1",
        "Q1Options",
        "Question2",
        "Q2Options",
        "Question3",
        "Q3Options",
        "Question4",
        "Q4Options",
        "Question5",
        "Q5Options",
    ]

    constructor(ctx: WebPartContext) {
        this._sp = spfi().using(SPFx(ctx))
    }

    private _parseOptions = (options: string): { options?: string[], type: QuestionType } => {
        if (!options) {
            return {
                type: 'fill-in-blank'
            }
        }

        let optionList = options.split(";").map(opt => opt.trim()).filter(Boolean);

        if (optionList.length > 1) {
            return {
                options: optionList,
                type: 'single-choice'
            }
        }

        optionList = options.split('/').map(opt => opt.trim()).filter(Boolean);
        if (optionList.length === 2) {
            return {
                options: optionList,
                type: 'true-false'
            }
        }

        optionList = options.split('\n').map(opt => opt.trim()).filter(Boolean);
        if (optionList.length > 1) {
            return {
                options: optionList,
                type: 'multiple-choice'
            }
        }

        return {
            type: 'fill-in-blank'
        }
    }

    private _parseQuestions = (item: Record<string, any>): Question[] => {
        const questions: Question[] = [];

        for (let i = 1; i <= 5; i++) {
            const questionKey = `Question${i}`;
            const optionsKey = `Q${i}Options`;

            if (item[questionKey]) {
                const parsedOptions = this._parseOptions(item[optionsKey]);


                questions.push({
                    question: item[questionKey],
                    type: parsedOptions.type,
                    options: parsedOptions.options as any
                });
            }
        }
        return questions;
    }

    private _parseResources = (item: Record<string, any>): Resource[] => {
        if (!item.Resources) return [];

        const resourceItem = item.Resources.split('\n').map((r: string) => r.trim()).filter(Boolean);

        const resources: Resource[] = [];

        for (const res of resourceItem) {
            // Create regex to match format [title]url
            const regex = /^\[(.+?)\](.+)$/;
            const match = res.match(regex);
            if (match) {
                const title = match[1].trim();
                const url = match[2].trim();

                resources.push({
                    title: title || '',
                    url: url || ''
                });
            }
        }

        return resources;
    }

    private _mapApiToSurvey = (item: Record<string, any>): ISurvey => {
        const questions = this._parseQuestions(item)
        const resources = this._parseResources(item);

        return {
            id: item.Id,
            name: item.Title,
            instruction: item.Instruction,
            displayOrder: item.DisplayOrder,
            active: item.Active,
            questions: questions,
            resources: resources
        }
    }

    public async getSurveys(currentUser: IUser): Promise<ISurvey[]> {
        try {
            const items = await this._sp.web.lists.getByTitle("Surveys")
                .items
                .select(...this._select)
                .orderBy("DisplayOrder", true)
                .filter("Active eq 1")
                ();

            const results = items.map((item) => {
                const survey = this._mapApiToSurvey(item);
                return survey;
            });

            return results;
        } catch (error) {
            console.error("Error fetching surveys:", error);
            throw error;
        }
    }

    public async submitSurvey(
        apiUrl: string,
        surveyId: number,
        userId: number,
        userAnswers: {
            question: string;
            userAnswer: string;
        }[],
    ): Promise<ISurveyResult> {
        try {
            const res = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    surveyId,
                    submittedById: userId,
                    userAnswers,
                })
            });

            if (!res.ok) {
                throw new Error(`Error submitting survey: ${res.statusText}`);
            }

            const result = await res.json();
            return result;

        } catch (error) {
            console.error("Error submitting survey:", error);
            throw error;
        }
    }
}