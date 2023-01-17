/* eslint-disable @typescript-eslint/no-explicit-any */
import AdminAPI from './AdminAPI';

import UserModel, { UserOptionsRaw, NewUserOptions } from './models/User';
import Pagination, { PaginationOptionsRaw } from './models/Pagination';
/**
 * @class User
 * @extends UserModel
 * @description Class for interacting with the panel's users.
 * @constructor {AdminAPI} api The API instance.
 * @constructor {UserOptionsRaw} data Raw data from a user.
 * @constructor {PaginationOptionsRaw} paginationOptions Raw data from the pagination.
 * @property {Pagination} pagination The pagination object.
 */

class User extends UserModel {
    private api: AdminAPI;
    public pagination?: Pagination;

    constructor(api: AdminAPI, data: UserOptionsRaw, paginationOptions?: PaginationOptionsRaw) {
        super(data);
        this.api = api;
        if (paginationOptions) this.pagination = new Pagination(paginationOptions);
    }

    /**
     * @description Create a new user.
     * @param {AdminAPI} api The API instance.
     * @param {NewUserOptions} options The options for the new user.
     * @returns {Promise<User>}
     * @static
     * @memberof User
     */
    public static create(api: AdminAPI, options: NewUserOptions): Promise<User> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/users`, 'POST', this.getCreateOptions(options));
                resolve(new User(api, res.data.attributes))
            } catch (error) {
                reject(error)
            }
        });
    }

    /**
     * @description Get all users from the panel.
     * @param {AdminAPI} api The API instance.
     * @param {number} page The page number.
     * @returns {Promise<User[]>}
     * @static
     * @memberof User
     */
    public static getAll(api: AdminAPI, page: number): Promise<User[]> {
        (page) ? page : page = 1;
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/users?page=${page}`);
                resolve(res.data.map((value) => new User(api, value.attributes, res.pagination)));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get a user by ID.
     * @param {AdminAPI} api The API instance.
     * @param {number} id The user's ID.
     * @returns {Promise<User>}
     * @static
     * @memberof User
     */
    public static getById(api: AdminAPI, id: number): Promise<User> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/users/${id}`);
                resolve(new User(api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get a user by username.
     * @param {AdminAPI} api The API instance.
     * @param {string} username The user's username.
     * @returns {Promise<User>}
     * @static
     * @memberof User
     */
    public static getByExternalId(api: AdminAPI, externalId: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/users/external/${externalId}`);
                resolve(new User(api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @private */
    private static getCreateOptions(options: NewUserOptions) {
        let opts: any = {
            external_id: options.externalId,
            username: options.username,
            email: options.email,
            first_name: options.firstName,
            last_name: options.lastName,
            password: options.password,
            root_admin: options.admin,
            language: options.language,
        };

        return opts;
    }


    /** @private */
    private getRequestObject(data: any) {
        let request = {
            username: this.username,
            email: this.email,
            first_name: this.firstName,
            last_name: this.lastName,
        };

        return Object.assign(request, data);
    }

    // private userId: any;
    // private internalId: string;
    // private username: string;

    // constructor(api: AdminAPI, userId: any) {
    //     this.api = api;
    //     this.userId = userId;

    //     if (!/\d/g.test(this.userId)) {
    //         this.username = this.userId;
    //         this.api.getUsers().then(users => {
    //             let user = users.filter(user => user.username === this.username);

    //             this.userId = user[0].id;
    //             this.internalId = user[0].internalId;
    //         }).catch(error => { throw error; });
    //     } else {
    //         this.getInfo().then(info => {
    //             this.username = info.username;
    //         }).catch(error => { throw error; });
    //     }
    // }

    /** @description Set an users external ID.
     * @param {string} externalId The new external ID.
     * @returns {Promise<User>}
     * @memberof User
     * @example
     * let user = await client.getUser(1);
     * user.setExternalId('new_external_id');
     * console.log(user.externalId); // new_external_id
     */
    public setExternalId(externalId: string): Promise<User> {
        this.externalId = externalId;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/users/${this.id}`, 'PATCH', this.getRequestObject({ external_id: externalId }));
                resolve(new User(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @description Set an users username.
     * @param {string} username The new username.
     * @returns {Promise<User>}
     * @memberof User
     * @example
     * let user = await client.getUser(1);
     * user.setUsername('new_username');
     * console.log(user.username); // new_username
     */
    public setUsername(username: string): Promise<User> {
        this.username = username;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/users/${this.id}`, 'PATCH', this.getRequestObject({ username }));
                resolve(new User(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @description Set an users email.
     * @param {string} email The new email.
     * @returns {Promise<User>}
     * @memberof User
     */
    public setEmail(email: string): Promise<User> {
        this.email = email;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/users/${this.id}`, 'PATCH', this.getRequestObject({ email }));
                resolve(new User(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @description Set an users first name.
     * @param {string} firstName The new first name.
     * @returns {Promise<User>}
     * @memberof User
     */
    public setFirstName(firstName: string): Promise<User> {
        this.firstName = firstName;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/users/${this.id}`, 'PATCH', this.getRequestObject({ first_name: firstName }));
                resolve(new User(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @description Set an users last name.
     * @param {string} lastName The new last name.
     * @returns {Promise<User>}
     * @memberof User
     */
    public setLastName(lastName: string): Promise<User> {
        this.lastName = lastName;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/users/${this.id}`, 'PATCH', this.getRequestObject({ last_name: lastName }));
                resolve(new User(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @description Set an users password.
     * @param {string} password The new password.
     * @returns {Promise<User>}
     * @memberof User
     */
    public setPassword(password: string): Promise<User> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/users/${this.id}`, 'PATCH', this.getRequestObject({ password }));
                resolve(new User(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @description Set an users root admin status.
     * @param {boolean} admin The new root admin status.
     * @returns {Promise<User>}
     * @memberof User
     */
    public setAdmin(admin: boolean): Promise<User> {
        this.rootAdmin = admin;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/users/${this.id}`, 'PATCH', this.getRequestObject({ root_admin: admin }));
                resolve(new User(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @description Set an users language.
     * @param {string} language The new language.
     * @returns {Promise<User>}
     * @memberof User
        */
    public setLanguage(language: string): Promise<User> {
        this.language = language;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/users/${this.id}`, 'PATCH', this.getRequestObject({ language }));
                resolve(new User(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @description Delete an user.
     * @returns {Promise<void>}
     * @memberof User
     */
    public delete(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/application/users/${this.id}`, 'DELETE');
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default User;