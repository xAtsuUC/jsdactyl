import AdminAPI from '../AdminAPI';

import ServerDatabaseModel, { ServerDatabaseOptionsRaw } from '../models/ServerDatabase';

/**
 * @class ServerDatabase
 * @extends ServerDatabaseModel
 * @description Class for interacting with the panel's server databases.
 * @constructor {AdminAPI} api The API instance.
 * @constructor {ServerDatabaseOptionsRaw} data Raw data from a server database.
 */
class ServerDatabase extends ServerDatabaseModel {
    private api: AdminAPI;

    constructor(api: AdminAPI, data: ServerDatabaseOptionsRaw) {
        super(data);
        this.api = api;
    }

    /**
     * @description Get all databases from a server.
     * @param {AdminAPI} api The API instance.
     * @param {number} server The server ID.
     * @returns {Promise<ServerDatabase[]>}
     * @static
     * @memberof ServerDatabase
     */
    public static getAll(api: AdminAPI, server: number): Promise<ServerDatabase[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/servers/${server}/databases`);
                resolve(res.data.map((value) => new ServerDatabase(api, value.attributes)));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get a database by ID.
     * @param {AdminAPI} api The API instance.
     * @param {number} server The server ID.
     * @param {number} id The database ID.
     * @returns {Promise<ServerDatabase>}
     * @static
     * @memberof ServerDatabase
     */
    public static getById(api: AdminAPI, server: number, id: number): Promise<ServerDatabase> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/servers/${server}/databases/${id}`);
                resolve(new ServerDatabase(api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Reset the database password.
     * @returns {Promise<void>}
     * @memberof ServerDatabase
     */
    public resetPassword(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/application/servers/${this.server}/databases/${this.id}/reset-password`, 'POST');
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    public delete(): Promise<void> {
        return new Promise((resolve, reject) => {
            return new Promise<void>(async (resolve, reject) => {
                try {
                    await this.api.call(`/application/servers/${this.server}/databases/${this.id}`, 'DELETE');
                    resolve();
                } catch (error) {
                    reject(error);
                }
            });
        });
    }
}

export default ServerDatabase;