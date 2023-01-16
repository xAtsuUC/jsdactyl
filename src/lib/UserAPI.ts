import PterodactylAPI from './index';

import ClientServer from './ClientServer';

/**
 * @class UserClient
 * @extends PterodactylAPI
 * @description This class is used to interact with the Pterodactyl API as a user.
 * @param {string} url The URL of the Pterodactyl panel.
 * @param {string} apiKey The API key of the user.
 * @example
 * import Builder from 'jsdactyl';
 * const client = new Builder('https://panel.example.com', 'API_KEY').asUser();
 */
class UserClient extends PterodactylAPI {
    constructor(url: string, apiKey: string) {
        super(url, apiKey);

        this.testConnection()
            .catch(error => {
                throw error;
            });
    }

    /**
     * @description Test the connection to the panel.
     * @returns {Promise<void>}
     * @example
     * client.testConnection().then(() => {
     *    console.log('Connection successful!');
     * }).catch(error => {
     *   console.error(error);
     * });
     */
    public testConnection(): Promise<void> {
        let solutions: unknown = {
            0: 'Most likely hostname is configured wrong causing the request never get executed.',
            401: 'Authorization header either missing or not provided.',
            403: 'Double check the password (which should be the Application Key).',
            404: 'Result not found.',
            422: 'Validation error.',
            500: 'Panel errored, check panel logs.',
        };

        return new Promise((resolve, reject) => {
            this.call('/client').then(res => {
                let error = null;

                if (res.statusCode !== 200) {
                    let { statusCode } = res;
                    error = `Non success status code received: ${statusCode}.\nPossible sulutions: ${solutions[statusCode] !== undefined ? solutions[statusCode] : 'None.'}`
                }

                if (error !== null) return reject(new Error(error));
                resolve();
            }).catch(error => reject(error));
        });
    }

    /**
     * @description Get all servers of the user.
     * @param {number} [page] The page to get.
     * @returns {Promise<ClientServer[]>}
     * @example
     * client.getClientServers().then(servers => {
     *    console.log(servers);
     * });
     */
    public getClientServers(page?: number): Promise<ClientServer[]> {
        return ClientServer.getAll(this, page);
    }

    /**
     * @description Get a server by its ID.
     * @param {string} serverId The ID of the server.
     * @returns {Promise<ClientServer>}
     * @example
     * client.getClientServer('SERVER_ID').then(server => {
     *   console.log(server);
     * });
     */
    public getClientServer(serverId: string): Promise<ClientServer> {
        return ClientServer.getById(this, serverId);
    }
}

export default UserClient;