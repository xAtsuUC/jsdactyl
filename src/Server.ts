import AdminAPI from './AdminAPI.js';

import ServerModel, { ServerOptionsRaw, ServerDetailsRequestOptions, ServerBuildConfigRequestOptions, ServerStartupRequestOptions, NewServerOptions, ServerUpdateOptions, ServerBuildOptions, ServerStartupOptions } from './models/Server.js';
import ServerDatabase from './ServerDatabase.js';
import Pagination, { PaginationOptionsRaw } from './models/Pagination.js';

/** 
 * @extends ServerModel
 * @description Class for interacting with the panel's servers.
 * @constructor {AdminAPI} api The API instance.
 * @constructor {ServerOptionsRaw} data Raw data from a server.
 * @constructor {PaginationOptionsRaw} paginationOptions Raw data from the pagination.
 * @property {Pagination} pagination The pagination object.
 */
class Server extends ServerModel {
    private api: AdminAPI;
    public pagination?: Pagination;

    constructor(api: AdminAPI, data: ServerOptionsRaw, paginationOptions?: PaginationOptionsRaw) {
        super(data);
        this.api = api;
        if (paginationOptions) this.pagination = new Pagination(paginationOptions);
    }

    /**
     * @description Create a new server.
     * @param {AdminAPI} api The API instance.
     * @param {NewServerOptions} options The options for the new server.
     * @returns {Promise<Server>}
     * @static
     * @memberof Server
     */
    public static create(api: AdminAPI, options: NewServerOptions): Promise<Server> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/servers`, 'POST', this.getCreateOptions(options));
                resolve(new Server(api, res.data.attributes))
            } catch (error) {
                reject(error)
            }
        });
    }

    /**
     * @description Get all servers from the panel.
     * @param {AdminAPI} api The API instance.
     * @param {number} page The page number.
     * @returns {Promise<Server[]>}
     * @static
     * @memberof Server
     */
    public static getAll(api: AdminAPI, page: number): Promise<Server[]> {
        (page) ? page : page = 1;
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/servers?page=${page}`);
                resolve(res.data.map((value) => new Server(api, value.attributes, res.pagination)));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get a server by its ID.
     * @param {AdminAPI} api The API instance.
     * @param {number} id The server ID.
     * @returns {Promise<Server>}
     * @static
     * @memberof Server
     */
    public static getById(api: AdminAPI, id: number): Promise<Server> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/servers/${id}`);
                resolve(new Server(api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get a server by its UUID.
     * @param {AdminAPI} api The API instance.
     * @param {string} uuid The server UUID.
     * @returns {Promise<Server>}
     * @static
     * @memberof Server
     */
    public static getByExternalId(api: AdminAPI, externalId: string): Promise<Server> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/servers/external/${externalId}`);
                resolve(new Server(api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @private */
    private static getCreateOptions(options: NewServerOptions) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        let opts: any = {
            external_id: options.externalId,
            name: options.name,
            user: options.user,
            description: options.description,
            egg: options.egg,
            pack: options.pack,
            docker_image: options.image,
            startup: options.startup,
            limits: options.limits,
            feature_limits: options.featureLimits,
            environment: options.environment,
            start_on_completion: options.startWhenInstalled,
            skip_scripts: options.skipScripts,
            oom_disabled: options.outOfMemoryKiller,
        };

        if (options.allocation) opts.allocation = options.allocation;
        if (options.deploy) opts.deploy = {
            locations: options.deploy.locations,
            dedicated_ip: options.deploy.dedicatedIp,
            port_range: options.deploy.portRange,
        };

        return opts;
    }

    /** @private */
    private getDetailsRequestObject(data) {
        let request = {
            name: this.name,
            user: this.user,
        };

        return Object.assign(request, data);
    }

    /** @private */
    private getBuildRequestObject(data) {
        let request = {
            allocation: this.allocation,
            limits: this.limits,
            feature_limits: this.featureLimits,
        };

        return Object.assign(request, data);
    }

    /** @private */
    private getStartupRequestObject(data) {
        let request = {
            startup: this.container.startupCommand,
            egg: this.egg,
            image: this.container.image,
        };

        return Object.assign(request, data);
    }

    /** 
     * @description update the server details
     * @param {ServerDetailsRequestOptions} options The options to update.
     * @returns {Promise<Server>}
     * @memberof Server
     */
    public updateDetails(options: ServerDetailsRequestOptions): Promise<Server> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/details`, 'PATCH', this.getDetailsRequestObject(options));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** 
     * @description update the server build
     * @param {ServerBuildConfigRequestOptions} options The options to update.
     * @returns {Promise<Server>}
     * @memberof Server
     */
    public updateBuild(options: ServerBuildConfigRequestOptions): Promise<Server> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/build`, 'PATCH', this.getBuildRequestObject(options));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** 
     * @description update the server startup
     * @param {ServerStartupRequestOptions} options The options to update.
     * @returns {Promise<Server>}
     * @memberof Server
    */
    public updateStartup(options: ServerStartupRequestOptions): Promise<Server> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/startup`, 'PATCH', this.getStartupRequestObject(options));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** 
     * @description Suspends the server.
     * @returns {Promise<void>}
     * @memberof Server
     */
    public suspend(): Promise<void> {
        this.suspended = true;

        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/application/servers/${this.id}/suspend`, 'POST', null, true);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /** 
     * @description Unsuspends the server.
     * @returns {Promise<void>}
     * @memberof Server
     */
    public unsuspend(): Promise<void> {
        this.suspended = false;

        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/application/servers/${this.id}/unsuspend`, 'POST', null, true);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /** 
     * @description Reinstalls the server.
     * @returns {Promise<void>}
     * @memberof Server
     */
    public reinstall(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/application/servers/${this.id}/reinstall`, 'POST');
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /** 
     * @description Rebuilds the server.
     * @returns {Promise<void>}
     * @memberof Server
     */
    public rebuild(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/application/servers/${this.id}/rebuild`, 'POST');
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /** 
     * @description Check whether the server is suspended or not.
     * @returns {Promise<boolean>}
     * @memberof Server
     * @example
     * let suspended = await server.isSuspended();
     * console.log(suspended);
     * // true or false
     */
    public isSuspended(): Promise<boolean> {
        return new Promise((resolve, reject) => {
            resolve(this.suspended);
        });
    }
    
    /** 
     * @description Set the server's name.
     * @param {string} name The new name of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     * @deprecated @see updateDetails
     */
    public setName(name: string): Promise<Server> {
        this.name = name;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/details`, 'PATCH', this.getDetailsRequestObject({ name }));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** 
     * @description Set the server's description.
     * @param {string} description The new description of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     * @deprecated @see updateDetails
     */
    public setDescription(description: string): Promise<Server> {
        this.description = description;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/details`, 'PATCH', this.getDetailsRequestObject({ description }));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set the server's user.
     * @param {number} user The new user of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     * @deprecated @see updateDetails
     */
    public setUser(user: number): Promise<Server> {
        this.user = user;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/details`, 'PATCH', this.getDetailsRequestObject({ user }));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });

    }

    /** 
     * @description Set the server's memory.
     * @param {number} memory The new memory of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     * @deprecated @see updateServerBuild
     */
    public setMemory(memory: number): Promise<Server> {
        this.limits.memory = memory;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/details`, 'PATCH', this.getDetailsRequestObject({ limits: { memory } }));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });

    }

    /** 
     * @description Set the server's CPU.
     * @param {number} cpu The new CPU of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     * @deprecated @see updateServerBuild
     */
    public setCPU(cpu: number): Promise<Server> {
        this.limits.cpu = cpu;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/build`, 'PATCH', this.getBuildRequestObject({ limits: { cpu } }));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** 
     * @description Set the server's disk.
     * @param {number} disk The new disk of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     * @deprecated @see updateServerBuild
     */
    public setDisk(disk: number): Promise<Server> {
        this.limits.disk = disk;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/build`, 'PATCH', this.getBuildRequestObject({ limits: { disk } }));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** 
     * @description Set the server's IO.
     * @param {number} io The new IO of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     * @deprecated @see updateServerBuild
     */
    public setIO(io: number): Promise<Server> {
        this.limits.io = io;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/build`, 'PATCH', this.getBuildRequestObject({ limits: { io } }));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** 
     * @description Set the server's swap.
     * @param {number} swap The new swap of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     * @deprecated @see updateServerBuild
     */
    public setSwap(swap: number): Promise<Server> {
        this.limits.swap = swap;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/build`, 'PATCH', this.getBuildRequestObject({ limits: { swap } }));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** 
     * @description Set the server's database amount.
     * @param {number} amount The new database amount of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     * @deprecated @see updateServerBuild
     */
    public setDatabaseAmount(amount: number): Promise<Server> {
        this.featureLimits.databases = amount;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/build`, 'PATCH', this.getBuildRequestObject({ feature_limits: { databases: amount } }));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** 
     * @description Set the server's allocation amount.
     * @param {number} amount The new allocation amount of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     * @deprecated @see updateServerBuild
     */
    public setAllocationAmount(amount: number): Promise<Server> {
        this.featureLimits.allocations = amount;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/build`, 'PATCH', this.getBuildRequestObject({ feature_limits: { allocations: amount } }));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** 
     * @description Set the server's startup command.
     * @param {string} command The new startup command of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     * @deprecated @see updateServerStartup
     */
    public setStartupCommand(command: string): Promise<Server> {
        this.container.startupCommand = command;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/startup`, 'PATCH', this.getStartupRequestObject({ startup: command }));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set the server's egg.
     * @param {number} egg The new egg of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     * @deprecated @see updateServerStartup
     */
    public setEgg(egg: number): Promise<Server> {
        this.egg = egg;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/startup`, 'PATCH', this.getStartupRequestObject({ egg }));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @description Set the server's pack.
     * @param {number} pack The new pack of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     * @deprecated @see updateServerStartup
     */
    public setPack(pack: number): Promise<Server> {
        this.pack = pack;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/startup`, 'PATCH', this.getStartupRequestObject({ pack }));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });

    }

    /** @description Set the server's image.
     * @param {string} image The new image of the server.
     * @note This refers to the Docker image, not the server's image.
     * @returns {Promise<Server>}
     * @memberof Server
     * @deprecated @see updateServerStartup
     */
    public setImage(image: string): Promise<Server> {
        this.container.image = image;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/startup`, 'PATCH', this.getStartupRequestObject({ image }));
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @description Create a database on the server.
     * @param {string} name The name of the database.
     * @param {string} remote The remote of the database.
     * @param {number} host The host of the database.
     * @returns {Promise<ServerDatabase>}
     * @memberof Server
     */
    public createDatabase(name: string, remote: string, host: number): Promise<ServerDatabase> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/databases`, 'POST', { database: name, remote, host });
                resolve(new ServerDatabase(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @description Get all databases on the server.
     * @returns {Promise<ServerDatabase[]>}
     * @memberof Server
     */
    public databases(): Promise<ServerDatabase[]> {
        return ServerDatabase.getAll(this.api, this.id);
    }

    /** @description Get a database on the server.
     * @param {number} database The ID of the database.
     * @returns {Promise<ServerDatabase>}
     * @memberof Server
     */
    public getDatabase(database: number): Promise<ServerDatabase> {
        return ServerDatabase.getById(this.api, this.id, database);
    }

    /** @description Delete the server.
     * @param {boolean} [force=false] Whether to force delete the server.
     * @returns {Promise<void>}
     * @memberof Server
     * @note This will delete the server permanently.
     * @note If the server is running, it will be stopped.
     */
    public delete(force?: boolean): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/application/servers/${this.id}${force ? '/force' : ''}`, 'DELETE');
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @description Update the server details
     * @param {ServerUpdateOptions} data The new details of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     */
    public updateServer(data: ServerUpdateOptions): Promise<Server> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/details`, 'PATCH', data);
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @description Update the server build
     * @param {ServerBuildOptions} data The new build of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     */
    public updateServerBuild(data: ServerBuildOptions): Promise<Server> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/build`, 'PATCH', data);
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /** @description Update the server startup
     * @param {ServerStartupOptions} data The new startup of the server.
     * @returns {Promise<Server>}
     * @memberof Server
     */
    public updateServerStartup(data: ServerStartupOptions): Promise<Server> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/servers/${this.id}/startup`, 'PATCH', data);
                resolve(new Server(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default Server;