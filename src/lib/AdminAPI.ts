import PterodactylAPI from './index';

import User from './User';
import Node from './Node';
import Location from './Location';
import Server from './Server';
import Nest from './Nest';
import Egg from './Egg';

import { NewServerOptions } from './models/Server';
import { NewUserOptions } from './models/User';
import { NewLocationOptions } from './models/Location';
import { NewNodeOptions } from './models/Node';

/**
 * @class AdminClient
 * @extends PterodactylAPI
 * @description This class is used to interact with the Pterodactyl API as an admin.
 * @param {string} url The URL of the Pterodactyl panel.
 * @param {string} apiKey The API key of the admin.
 * @example
 * import Builder from 'jsdactyl';
 * const client = new Builder('https://panel.example.com', 'API_KEY').asAdmin();
 */
class AdminClient extends PterodactylAPI {
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
            this.call('/application/servers').then(res => {
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
     * @description Get all users from the panel.
     * @param {number} [page] The page number to get.
     * @returns {Promise<User#User[]>}
     * @example
     * client.getUsers().then(users => {
     *    console.log(users);
     * }).catch(error => {
     *  console.error(error);
     * });
     */
    public getUsers(page?: number): Promise<User[]> {
        (page) ? page : page = 1;
        return User.getAll(this, page);
    }

    /**
     * @description Get all nodes from the panel.
     * @param {number} [page] The page number to get.
     * @returns {Promise<Node[]>}
     * @example
     * client.getNodes().then(nodes => {
     *   console.log(nodes);
     * }).catch(error => {
     *  console.error(error);
     * });
     */
    public getNodes(page?: number): Promise<Node[]> {
        return Node.getAll(this, page);
    }

    /**
     * @description Get all locations from the panel.
     * @param {number} [page] The page number to get.
     * @returns {Promise<Location[]>}
     * @example
     * client.getLocations().then(locations => {
     *  console.log(locations);
     * }).catch(error => {
     *  console.error(error);
     * });
     */
    public getLocations(page?: number): Promise<Location[]> {
        return Location.getAll(this, page);
    }

    /**
     * @description Get all servers from the panel.
     * @param {number} [page] The page number to get.
     * @returns {Promise<Server[]>}
     * @example
     * client.getServers().then(servers => {
     *  console.log(servers);
     * }).catch(error => {
     *  console.error(error);
     * });
     */
    public getServers(page?: number): Promise<Server[]> {
        return Server.getAll(this, page);
    }

    /**
     * @description Get all nests from the panel.
     * @param {number} [page] The page number to get.
     * @returns {Promise<Nest[]>}
     * @example
     * client.getNests().then(nests => {
     *  console.log(nests);
     * }).catch(error => {
     *  console.error(error);
     * });
     */
    public getNests(page?: number): Promise<Nest[]> {
        return Nest.getAll(this, page);
    }

    /**
     * @description Get a specific user from the panel.
     * @param {number} userId The ID of the user.
     * @returns {Promise<User>}
     * @example
     * client.getUser(1).then(user => {
     *   console.log(user);
     * }).catch(error => {
     *  console.error(error);
     * });
     */
    public getUser(userId: number): Promise<User> {
        return User.getById(this, userId);
    }

    /**
     * @description Get a specific node from the panel.
     * @param {number} nodeId The ID of the node.
     * @returns {Promise<Node>}
     * @example
     * client.getNode(1).then(node => {
     *  console.log(node);
     * }).catch(error => {
     *  console.error(error);
     * });
     */
    public getNode(nodeId: number): Promise<Node> {
        return Node.getById(this, nodeId);
    }

    /**
     * @description Get a specific location from the panel.
     * @param {number} locationId The ID of the location.
     * @returns {Promise<Location>}
     * @example
     * client.getLocation(1).then(location => {
     *  console.log(location);
     * }).catch(error => {
     *  console.error(error);
     * });
     */
    public getLocation(locationId: number): Promise<Location> {
        return Location.getById(this, locationId);
    }

    /**
     * @description Get a specific server from the panel.
     * @param {number} serverId The ID of the server.
     * @returns {Promise<Server>}
     * @example
     * client.getServer(1).then(server => {
     *   console.log
     * }).catch(error => {
     *   console.error(error);
     * });
     */
    public getServer(serverId: number): Promise<Server> {
        return Server.getById(this, serverId);
    }

    /**
     * @description Get a specific nest from the panel.
     * @param {number} nestId The ID of the nest.
     * @returns {Promise<Nest>}
     * @example
     * client.getNest(1).then(nest => {
     *  console.log(nest);
     * }).catch(error => {
     *  console.error(error);
     * });
     */
    public getNest(nestId: number): Promise<Nest> {
        return Nest.getById(this, nestId);
    }

    /**
     * @description Get a specific egg from the panel.
     * @param {number} nestId The ID of the nest.
     * @param {number} eggId The ID of the egg.
     * @returns {Promise<Egg>}
     * @example
     * client.getEgg(1, 1).then(egg => {
     *  console.log
     * }).catch(error => {
     *  console.error(error);
     * });
     */
    public getEgg(nestId: number, eggId: number): Promise<Egg> {
        return Egg.getById(this, nestId, eggId);
    }

    /**
     * @description Create a new server on the panel.
     * @param {NewServerOptions} options The options for the new server.
     * @returns {Promise<Server>}
     * @example
     * client.createServer({
     *  name: 'Test Server',
     *  user: 1,
     *  nest: 1,
     *  egg: 1,
     *  docker_image: 'quay.io/parkervcp/pterodactyl-images:debian_nodejs',
     *  limits: {
     *    memory: 512,
     *    swap: 0,
     *    disk: 512,
     *    io: 500,
     *    cpu: 100
     * })
     * @note This will not start the server, you will need to call the start method on the server object.
     * @see Server#PowerAction
     */
    public createServer(options: NewServerOptions): Promise<Server> {
        return Server.create(this, options);
    }

    /**
     * @description Create a new user on the panel.
     * @param {NewUserOptions} options The options for the new user.
     * @returns {Promise<User>}
     * @example
     * client.createUser({
     *  username: 'TestUser',
     *  email: '
     *  first_name: 'Test',
     *  last_name: 'User',
     *  password: 'password',
     *  root_admin: false
     * }).then(user => {
     *  console.log(user);
     * }).catch(error => {
     *  console.error(error);
     * });
     */
    public createUser(options: NewUserOptions): Promise<User> {
        return User.create(this, options);
    }

    /**
     * @description Create a new location on the panel.
     * @param {NewLocationOptions} options The options for the new location.
     * @returns {Promise<Location>}
     * @example
     * client.createLocation({
     *  short: 'Test',
     *  long: 'Test Location'
     * }).then(location => {
     *  console.log(location);
     * }).catch(error => {
     *  console.error(error);
     * });
     */
    public createLocation(options: NewLocationOptions): Promise<Location> {
        return Location.create(this, options);
    }

    /**
     * @description Create a new node on the panel.
     * @param {NewNodeOptions} options The options for the new node.
     * @returns {Promise<Node>}
     * @see Node#NodeOptions
     */
    public createNode(options: NewNodeOptions): Promise<Node> {
        return Node.create(this, options);
    }
}

export default AdminClient;