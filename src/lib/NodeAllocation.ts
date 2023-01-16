import AdminAPI from './AdminAPI';

import NodeAllocationModel, { NodeAllocationOptions } from './models/NodeAllocation';
import Pagination, { PaginationOptionsRaw } from './models/Pagination';

/**
 * @class NodeAllocation
 * @extends NodeAllocationModel
 * @description Class for interacting with the panel's node allocations.
 * @constructor {AdminAPI} api The API instance.
 * @constructor {number} node The node ID.
 * @constructor {NodeAllocationOptions} data Raw data from a node allocation.
 * @constructor {PaginationOptionsRaw} paginationOptions Raw data from the pagination.
 * @property {Pagination} pagination The pagination object.
 * @property {number} node The node ID.
 */
class NodeAllocation extends NodeAllocationModel {
    private api: AdminAPI;
    public pagination?: Pagination;

    constructor(api: AdminAPI, node: number, data: NodeAllocationOptions, paginationOptions?: PaginationOptionsRaw) {
        super(data, node);
        this.api = api;
        if (paginationOptions) this.pagination = new Pagination(paginationOptions);
    }

    /**
     * @description Get all node allocations from the panel.
     * @param {AdminAPI} api The API instance.
     * @param {number} node The node ID.
     * @param {number} page The page number.
     * @returns {Promise<NodeAllocation[]>}
     * @static
     * @memberof NodeAllocation
     */
    public static getAll(api: AdminAPI, node: number, page): Promise<NodeAllocation[]> {
        (page) ? page : page = 1;
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/nodes/${node}/allocations?page=${page}`);
                resolve(res.data.map((value) => new NodeAllocation(api, node, value.attributes, res.pagination)));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Delete a node allocation.
     * @returns {Promise<NodeAllocation>}
     * @memberof NodeAllocation
     * @instance
     */
    public delete(): Promise<void> {
        return new Promise(async (resolve, reject) => {
            try {
                await this.api.call(`/application/nodes/${this.node}/allocations/${this.id}`);
                resolve();
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default NodeAllocation;