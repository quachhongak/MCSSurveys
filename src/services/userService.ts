import { spfi, SPFI, SPFx } from "@pnp/sp";
import "@pnp/sp/webs";
import "@pnp/sp/site-users";
import { WebPartContext } from "@microsoft/sp-webpart-base";
import { IUser } from "../models/user";

export default class UserService {
    private _sp: SPFI;

    constructor(ctx: WebPartContext) {
        this._sp = spfi().using(SPFx(ctx));
    }

    public async getCurrentUser(): Promise<IUser> {
        try {
            const user = await this._sp.web.currentUser.select("Id", "Title", "UserPrincipalName", "Email")();

            return {
                id: user.Id,
                title: user.Title,
                userPrincipalName: user.UserPrincipalName!, // UserPrincipalName is always available
                email: user.Email, // Email may not be available
            };
        } catch (error) {

            console.error("Error fetching current user:", error);
            throw error;
        }
    }

}