import AdminAPI from './AdminAPI';

import NodeModel, { NodeOptionsRaw, NewNodeOptions } from './models/Node';
import NodeAllocation from './NodeAllocation';
import Pagination, { PaginationOptionsRaw } from './models/Pagination';

/**
 * @class Node
 * @extends NodeModel
 * @description Class for interacting with the panel's nodes.
 * @constructor {AdminAPI} api The API instance.
 * @constructor {NodeOptionsRaw} data Raw data from a node.
 * @constructor {PaginationOptionsRaw} paginationOptions Raw data from the pagination.
 * @property {Pagination} pagination The pagination object.
 */
class Node extends NodeModel {
    private api: AdminAPI;
    public pagination?: Pagination;

    constructor(api: AdminAPI, data: NodeOptionsRaw, paginationOptions?: PaginationOptionsRaw) {
        super(data);
        this.api = api;
        if (paginationOptions) this.pagination = new Pagination(paginationOptions);
    }

    /**
     * @description Create a new node.
     * @param {AdminAPI} api The API instance.
     * @param {NewNodeOptions} options The options for the new node.
     * @returns {Promise<Node>}
     * @static
     * @memberof Node
     */
    public static create(api: AdminAPI, options: NewNodeOptions): Promise<Node> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/nodes`, 'POST', this.getCreateOptions(options));
                resolve(new Node(api, res.data.attributes))
            } catch (error) {
                reject(error)
            }
        });
    }

    /**
     * @description Get all nodes from the panel.
     * @param {AdminAPI} api The API instance.
     * @param {number} page The page number.
     * @returns {Promise<Node[]>}
     * @static
     * @memberof Node
     */
    public static getAll(api: AdminAPI, page: number): Promise<Node[]> {
        (page) ? page : page = 1;
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/nodes?page=${page}`);
                resolve(res.data.map((value) => new Node(api, value.attributes, res.pagination)));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get a node from the panel.
     * @param {AdminAPI} api The API instance.
     * @param {number} id The node ID.
     * @returns {Promise<Node>}
     * @static
     * @memberof Node
     */
    public static getById(api: AdminAPI, id: number): Promise<Node> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/nodes/${id}`);
                resolve(new Node(api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @private
     * @static
     * @memberof Node
     */
    private static getCreateOptions(options: NewNodeOptions) {
        let opts = {
            name: options.name,
            description: options.description,
            location_id: options.locationId,
            public: options.public,
            fqdn: options.fqdn,
            scheme: options.scheme,
            behind_proxy: options.behindProxy,
            memory: options.memory,
            memory_overallocate: options.memoryOverAllocate,
            disk: options.disk,
            disk_overallocate: options.diskOverAllocate,
            daemon_base: options.daemonBase,
            daemon_listen: options.daemonPort,
            daemon_sftp: options.daemonSftpPort,
            maintenance_mode: options.maintenanceMode,
            upload_size: options.uploadSize,
        };

        return opts;
    }

    /**
     * @private
     * @memberof Node
     */
    private getRequestObject(data) {
        let request = {
            name: this.name,
            location_id: this.locationId,
            fqdn: this.fqdn,
            scheme: this.scheme,
            memory: this.memory,
            memory_overallocate: this.memoryOverAllocate,
            disk: this.disk,
            disk_overallocate: this.diskOverAllocate,
            daemon_sftp: this.daemonSftp,
            daemon_listen: this.daemonListen,
        };

        return Object.assign(request, data);
    }

    /**
     * @description Set a node as public.
     * @param {boolean} isPublic Whether the node is public or not.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setPublic(isPublic: boolean): Promise<Node> {
        this.public = isPublic;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ public: isPublic }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set a node's name.
     * @param {string} name The new name for the node.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setName(name: string): Promise<Node> {
        this.name = name;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ name }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set a node's description.
     * @param {string} description The new description for the node.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setDescription(description: string): Promise<Node> {
        this.description = description;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ description }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set a node's location.
     * @param {number} locationId The new location ID for the node.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setLocation(locationId: number): Promise<Node> {
        this.locationId = locationId;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ location_id: locationId }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set a node's FQDN.
     * @param {string} fqdn The new FQDN for the node.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setFQDN(fqdn: string): Promise<Node> {
        this.fqdn = fqdn;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ fqdn }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set a node's scheme.
     * @param {string} scheme The new scheme for the node.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setScheme(scheme: string): Promise<Node> {
        this.scheme = scheme;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ scheme }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set whether a node is behind a proxy or not.
     * @param {string} behindProxy Whether the node is behind a proxy or not.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setBehindProxy(behindProxy: string): Promise<Node> {
        this.behindProxy = behindProxy;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ behind_proxy: behindProxy }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set a node's maintenance mode.
     * @param {boolean} maintenanceMode Whether the node is in maintenance mode or not.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setMaintenanceMode(maintenanceMode: boolean): Promise<Node> {
        this.maintenanceMode = maintenanceMode;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ maintenance_mode: maintenanceMode }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set a node's upload size.
     * @param {number} size The new upload size for the node.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setUploadSize(size: number): Promise<Node> {
        this.uploadSize = size;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ upload_size: size }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set a node's memory.
     * @param {number} memory The new memory for the node.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setMemory(memory: number): Promise<Node> {
        this.memory = memory;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ memory }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set a node's memory over allocate.
     * @param {number} memoryOverAllocate The new memory over allocate for the node.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setMemoryOverAllocate(memoryOverAllocate: number): Promise<Node> {
        this.memoryOverAllocate = memoryOverAllocate;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ memory_overallocate: memoryOverAllocate }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set a node's disk.
     * @param {number} disk The new disk for the node.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setDisk(disk: number): Promise<Node> {
        this.disk = disk;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ disk }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set a node's disk over allocate.
     * @param {number} diskOverAllocate The new disk over allocate for the node.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setDiskOverAllocate(diskOverAllocate: number): Promise<Node> {
        this.diskOverAllocate = diskOverAllocate;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ disk_overallocate: diskOverAllocate }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set a node's daemon listen port.
     * @param {number} port The new daemon listen port for the node.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setDaemonPort(port: number): Promise<Node> {
        this.daemonListen = port;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ daemon_listen: port }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set a node's daemon sftp port.
     * @param {number} port The new daemon sftp port for the node.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setDaemonSftpPort(port: number): Promise<Node> {
        this.daemonSftp = port;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ daemon_sftp: port }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Set a node's daemon base directory.
     * @param {string} baseDirectory The new daemon base directory for the node.
     * @returns {Promise<Node>}
     * @memberof Node
     */
    public setDaemonBase(baseDirectory: string): Promise<Node> {
        this.daemonBase = baseDirectory;

        return new Promise(async (resolve, reject) => {
            try {
                let res = await this.api.call(`/application/nodes/${this.id}`, 'PATCH', this.getRequestObject({ daemon_base: baseDirectory }));
                resolve(new Node(this.api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get all allocations for a node.
     * @param {number} [page] The page to get allocations for.
     * @returns {Promise<NodeAllocation[]>}
     * @memberof Node
     */
    public getAllocations(page?: number): Promise<NodeAllocation[]> {
        return NodeAllocation.getAll(this.api, this.id, page);
    }

    /**
     * @description Create a new allocation for a node.
     * @param {string} ip The IP address to create the allocation on.
     * @param {string} alias The alias to give the allocation.
     * @param {string[]} ports The ports to create the allocation on.
     * @returns {Promise<void>}
     * @memberof Node
     */
    public createAllocations(ip: string, alias: string, ports: string[]): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/application/nodes/${this.id}/allocations`, 'POST', { ip, alias, ports });
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Delete a node.
     * @returns {Promise<void>}
     * @memberof Node
     */
    public delete(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/application/nodes/${this.id}`, 'DELETE');
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default Node;