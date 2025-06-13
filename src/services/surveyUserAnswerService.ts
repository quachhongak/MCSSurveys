import { WebPartContext } from "@microsoft/sp-webpart-base";
import { SPFI, spfi, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/lists";
import "@pnp/sp/items";
import "@pnp/sp/batching";
import { ISurveyUserAnswer } from "../models/surveyUserAnswer";


export default class SurveyUserAnswerService {
    private _sp: SPFI;
    private _select = [
        "Id",
        "SurveyId",
        "SubmittedJSON",
        "Score",
        "SubmittedBy/Id",
        "SubmittedBy/Title",
        "SubmittedBy/EMail",
        "SubmittedBy/UserName",
    ];
    private _expand = ["SubmittedBy"];

    constructor(ctx: WebPartContext) {
        this._sp = spfi().using(SPFx(ctx));
    }

    public async getUserAnswersOfManySurveys(surveyIds: number[], userId: number): Promise<ISurveyUserAnswer[]> {
        if (!surveyIds || surveyIds.length === 0) {
            return [];
        }

        try {
            const [batchSP, execute] = this._sp.batched();
            const list = batchSP.web.lists.getByTitle("SurveyUserAnswers");

            const results: ISurveyUserAnswer[] = [];

            for (const surveyId of surveyIds) {
                list.items
                    .select(...this._select)
                    .expand(...this._expand)
                    .filter(`SurveyId eq ${surveyId} and SubmittedById eq ${userId}`)
                    .orderBy('Created', false)
                    .top(1)()
                    .then((items) => {
                        const userAnswer = items[0];

                        if (userAnswer) {
                            results.push({
                                id: userAnswer.Id,
                                surveyId: surveyId,
                                score: userAnswer.Score,
                                submittedBy: {
                                    id: userAnswer.SubmittedBy.Id,
                                    title: userAnswer.SubmittedBy.Title,
                                    email: userAnswer.SubmittedBy.EMail,
                                    userPrincipalName: userAnswer.SubmittedBy.UserName
                                },
                                userAnswerResults: JSON.parse(userAnswer.SubmittedJSON)
                            });
                        }
                    })
                    .catch((error) => {
                        console.error(`Error fetching answers for Survey ID ${surveyId}:`, error);
                    });
            }

            await execute();

            return results;
        } catch (error) {
            console.error("Error fetching user answers for multiple surveys:", error);
            throw error;
        }
    }


}