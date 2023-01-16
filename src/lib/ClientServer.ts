import UserAPI from './UserAPI';

import ClientServerModel, { ServerOptionsRaw, } from './models/ClientServer';
import Pagination, { PaginationOptionsRaw, } from './models/Pagination';

interface UtilizationData {
    cpu: {
        total: number;
        current: number;
    }
    memory: {
        total: number;
        current: number;
    }
    disk: {
        total: number;
        current: number;
    }
}

/**
 * @class ClientServer
 * @extends ClientServerModel
 * @description Class for interacting with the API
 * @constructor {UserAPI} api The API instance.
 * @constructor {ServerOptionsRaw} data Raw data from a server
 * @constructor {PaginationOptionsRaw} [paginationOptions] The pagination options.
 */
class ClientServer extends ClientServerModel {
    private api: UserAPI;
    public pagination?: Pagination;

    constructor(api: UserAPI, data: ServerOptionsRaw, paginationOptions?: PaginationOptionsRaw) {
        super(data);
        this.api = api;
        if (paginationOptions) this.pagination = new Pagination(paginationOptions);
    }

    /**
     * @description Get all servers from the panel.
     * @param {UserAPI} api The API instance.
     * @param {number} [page] The page number to get.
     * @returns {Promise<ClientServer[]>}
     */
    public static getAll(api: UserAPI, page: number): Promise<ClientServer[]> {
        (page) ? page : page = 1;
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/client?page=${page}`);
                resolve(res.data.map((value) => new ClientServer(api, value.attributes, res.pagination)));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get a server from the panel.
     * @param {UserAPI} api The API instance.
     * @param {string} id The server ID.
     * @returns {Promise<ClientServer>}
     */
    public static getById(api: UserAPI, id: string): Promise<ClientServer> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/client/servers/${id}`);
                resolve(new ClientServer(api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get the server's utilization data.
     * @returns {Promise<UtilizationData>}
     * @example
     * server.utilization().then((data) => {
     *    console.log(data.cpu.current);
     * });
     */
    public resourceUtilization(): Promise<UtilizationData> {
        return new Promise(async (resolve, reject) => {
            try {
                let res1 = await this.api.call(`/client/servers/${this.identifier}/resources`);
                let res2 = await this.api.call(`/client/servers/${this.identifier}`);
                let data:UtilizationData = {
                    cpu: {
                        total: res2.data.attributes.limits.cpu,
                        current: res1.data.resources.cpu_absolute,
                    },
                    memory: {
                        total: res2.data.attributes.limits.memory,
                        current: res1.data.resources.memory_bytes,
                    },
                    disk: {
                        total: res2.data.attributes.limits.disk,
                        current: res1.data.resources.disk_bytes,
                    }

                }
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }


    /**
     * @description Get the server's current state.
     * @returns {Promise<string>}
     * @example
     * server.powerState().then((state) => {
     *   console.log(state);
     * });
     */
    public powerState(): Promise<string> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/client/servers/${this.identifier}/resources`);
                resolve(res.data.attributes.current_state);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Send a power action to the server.
     * @param {string} signal The signal to send.
     * @returns {Promise<void>}
     * @example
     * server.powerAction('start').then(() => {
     *  console.log('Server started!');
     * });
     */
    public powerAction(signal: 'start' | 'stop' | 'restart' | 'kill'): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/client/servers/${this.identifier}/power`, 'POST', { signal }, true);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Start the server.
     * @returns {Promise<void>}
     * @example
     * server.start().then(() => {
     *  console.log('Server started!');
     * });
     */
    public start(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/client/servers/${this.identifier}/power`, 'POST', { signal: 'start' }, true);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Stop the server.
     * @returns {Promise<void>}
     * @example
     * server.stop().then(() => {
     *  console.log('Server stopped!');
     * });
     */
    public stop(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/client/servers/${this.identifier}/power`, 'POST', { signal: 'stop' }, true);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Restart the server.
     * @returns {Promise<void>}
     * @example
     * server.restart().then(() => {
     *  console.log('Server restarted!');
     * });
     */
    public restart(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/client/servers/${this.identifier}/power`, 'POST', { signal: 'restart' }, true);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Kill the server.
     * @returns {Promise<void>}
     * @example
     * server.kill().then(() => {
     *  console.log('Server killed!');
     * });
     */
    public kill(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/client/servers/${this.identifier}/power`, 'POST', { signal: 'kill' }, true);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get the server's database limits.
     * @returns {Promise<number>}
     * @example
     * server.databases().then((databases) => {
     *  console.log(databases);
     * });
     */
    public databases(): Promise<number> {
        return Promise.resolve(this.featureLimits.databases);
    }

    /**
     * @description Get the server's allocation limits.
     * @returns {Promise<number>}
     * @example
     * server.allocations().then((allocations) => {
     *  console.log(allocations);
     * });
     */
    public allocations(): Promise<number> {
        return Promise.resolve(this.featureLimits.allocations);
    }

    /**
     * @description Send a command to the server.
     * @param {string} command The command to send.
     * @returns {Promise<void>}
     * @example
     * server.sendCommand('say Hello World!').then(() => {
     *  console.log('Command sent!');
     * });
     */
    public sendCommand(command: string): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/client/servers/${this.identifier}/command`, 'POST', { command });
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default ClientServer;