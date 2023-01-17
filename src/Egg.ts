import AdminAPI from './AdminAPI';

import EggModel, { EggOptionsRaw } from './models/Egg';

/**
 * @class Egg
 * @extends EggModel
 * @description Class for interacting with the panel's eggs.
 * @constructor {AdminAPI} api The API instance.
 * @constructor {EggOptionsRaw} data Raw data from an egg.
 */
class Egg extends EggModel {
    private api: AdminAPI;

    constructor(api: AdminAPI, data: EggOptionsRaw) {
        super(data);
        this.api = api;
    }

    /**
     * @description Get all eggs from the panel.
     * @param {AdminAPI} api The API instance.
     * @param {number} nest The nest ID.
     * @returns {Promise<Egg[]>}
     */
    public static getAll(api: AdminAPI, nest: number): Promise<Egg[]> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/nests/${nest}/eggs`);
                resolve(res.data.map((value) => new Egg(api, value.attributes)));
            } catch (error) {
                reject(error);
            }
        });
    }

    /**
     * @description Get an egg from the panel.
     * @param {AdminAPI} api The API instance.
     * @param {number} nest The nest ID.
     * @param {number} id The egg ID.
     * @returns {Promise<Egg>}
     */
    public static async getById(api: AdminAPI, nest: number, id: number): Promise<Egg> {
        return new Promise(async (resolve, reject) => {
            try {
                let res = await api.call(`/application/nests/${nest}/eggs/${id}`);
                resolve(new Egg(api, res.data.attributes));
            } catch (error) {
                reject(error);
            }
        });
    }
}

export default Egg;