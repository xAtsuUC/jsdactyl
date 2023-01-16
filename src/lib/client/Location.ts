import AdminAPI from '../AdminAPI';

import LocationModel, { LocationOptionsRaw, NewLocationOptions } from '../models/Location';
import Pagination, { PaginationOptionsRaw } from '../models/Pagination';

/**
 * @class Location
 * @extends LocationModel
 * @description Class for interacting with the panel's locations.
 * @constructor {AdminAPI} api The API instance.
 * @constructor {LocationOptionsRaw} data Raw data from a location.
 * @constructor {PaginationOptionsRaw} paginationOptions Raw pagination data.
 */
class Location extends LocationModel {
    private api: AdminAPI;
    public pagination?: Pagination;

    constructor(api: AdminAPI, data: LocationOptionsRaw, paginationOptions?: PaginationOptionsRaw) {
        super(data);
        this.api = api;
        if (paginationOptions) this.pagination = new Pagination(paginationOptions);
    }

    /**
     * @description Create a new location.
     * @param {AdminAPI} api The API instance.
     * @param {NewLocationOptions} options The options for the new location.
     * @returns {Promise<Location>}
     * @static
     * @memberof Location
     */
    public static create(api: AdminAPI, options: NewLocationOptions): Promise<Location> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/locations`, 'POST', { short: options.shortCode, long: options.description });
                resolve(new Location(api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get all locations from the panel.
     * @param {AdminAPI} api The API instance.
     * @param {number} page The page number.
     * @returns {Promise<Location[]>}
     * @static
     * @memberof Location
     */
    public static getAll(api: AdminAPI, page: number): Promise<Location[]> {
        (page) ? page : page = 1;
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/locations?page=${page}`);
                resolve(res.data.map((value) => new Location(api, value.attributes, res.pagination)));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get a location from the panel.
     * @param {AdminAPI} api The API instance.
     * @param {number} id The location ID.
     * @returns {Promise<Location>}
     * @static
     * @memberof Location
     */
    public static getById(api: AdminAPI, id: number): Promise<Location> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/locations/${id}`);
                resolve(new Location(api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @private
     */
    private getRequestObject(data) {
        let request = {
            short: this.shortCode,
            long: this.description,
        };

        return Object.assign(request, data);
    }

    /**
     * @description Update the location's short code.
     * @param {string} shortCode The new short code.
     * @returns {Promise<Location>}
     * @memberof Location
     * @instance
     */
    public setShortCode(shortCode: string): Promise<Location> {
        this.shortCode = shortCode;

        return new Promise((resolve, reject) => {
            return new Promise(async (resolve, reject) => {
                try {
                    let res = await this.api.call(`/application/locations`, 'POST', this.getRequestObject({ short: shortCode }));
                    resolve(new Location(this.api, res.data.attributes));
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * @description Update the location's description.
     * @param {string} description The new description.
     * @returns {Promise<Location>}
     * @memberof Location
     * @instance
     */
    public setDescription(description: string): Promise<Location> {
        this.description = description;

        return new Promise((resolve, reject) => {
            return new Promise(async (resolve, reject) => {
                try {
                    let res = await this.api.call(`/application/locations`, 'POST', this.getRequestObject({ long: description }));
                    resolve(new Location(this.api, res.data.attributes));
                } catch (error) {
                    reject(error);
                }
            });
        });
    }

    /**
     * @description Delete the location.
     * @returns {Promise<void>}
     * @memberof Location
     * @instance
     */
    public delete(): Promise<void> {
        return new Promise((resolve, reject) => {
            return new Promise((resolve, reject) => {
                return new Promise<void>(async (resolve, reject) => {
                    try {
                        await this.api.call(`/application/locations/${this.id}`, 'DELETE');
                        resolve();
                    } catch (error) {
                        reject(error);
                    }
                });
            });
        });
    }
}

export default Location;