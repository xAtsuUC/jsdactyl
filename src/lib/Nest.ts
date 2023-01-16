import AdminAPI from './AdminAPI';

import Egg from './Egg';

import NestModel, { NestOptionsRaw } from './models/Nest';
import Pagination, { PaginationOptionsRaw } from './models/Pagination';

/**
 * @class Nest
 * @extends NestModel
 * @description Class for interacting with the panel's nests.
 * @constructor {AdminAPI} api The API instance.
 * @constructor {NestOptionsRaw} data Raw data from a nest.
 * @constructor {PaginationOptionsRaw} paginationOptions Raw data from the pagination.
 * @property {Pagination} pagination The pagination object.
 */
class Nest extends NestModel {
    private api: AdminAPI;
    public pagination?: Pagination;

    constructor(api: AdminAPI, data: NestOptionsRaw, paginationOptions?: PaginationOptionsRaw) {
        super(data);
        this.api = api;
        if (paginationOptions) this.pagination = new Pagination(paginationOptions);
    }

    /**
     * @description Get all nests from the panel.
     * @param {AdminAPI} api The API instance.
     * @param {number} page The page number.
     * @returns {Promise<Nest[]>}
     * @static
     * @memberof Nest
     */
    public static getAll(api: AdminAPI, page: number): Promise<Nest[]> {
        (page) ? page : page = 1;
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/nests?page=${page}`);
                resolve(res.data.map((value) => new Nest(api, value.attributes, res.pagination)));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get a nest by ID.
     * @param {AdminAPI} api The API instance.
     * @param {number} id The nest ID.
     * @returns {Promise<Nest>}
     * @static
     * @memberof Nest
     */
    public static getById(api: AdminAPI, id: number): Promise<Nest> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/nests/${id}`);
                resolve(new Nest(api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get all eggs from the nest.
     * @returns {Promise<Egg[]>}
     * @memberof Nest
     * @instance
     */
    public getEggs(): Promise<Egg[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await Egg.getAll(this.api, this.id);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get an egg from the nest.
     * @param {number} eggId The egg ID.
     * @returns {Promise<Egg>}
     * @memberof Nest
     * @instance
     */
    public getEgg(eggId: number): Promise<Egg> {
        return new Promise(async (resolve, reject) => {
            try {
                let data = await Egg.getById(this.api, this.id, eggId);
                resolve(data);
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default Nest;