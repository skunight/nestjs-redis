import * as Redis from 'ioredis';
import { v4 as uuidv4 } from 'uuid';
import { REDIS_CLIENT, REDIS_MODULE_OPTIONS } from './redis.constants';
export class RedisClientError extends Error {
}
async function getClient(options) {
    const { onClientReady, url, ...opt } = options;
    const client = url ? new Redis(url) : new Redis(opt);
    if (onClientReady) {
        onClientReady(client);
    }
    return client;
}
export const createClient = () => ({
    provide: REDIS_CLIENT,
    useFactory: async (options) => {
        const clients = new Map();
        let defaultKey = uuidv4();
        if (Array.isArray(options)) {
            await Promise.all(options.map(async (o) => {
                const key = o.name || defaultKey;
                if (clients.has(key)) {
                    throw new RedisClientError(`${o.name || 'default'} client is exists`);
                }
                clients.set(key, await getClient(o));
            }));
        }
        else {
            if (options.name && options.name.length !== 0) {
                defaultKey = options.name;
            }
            clients.set(defaultKey, await getClient(options));
        }
        return {
            defaultKey,
            clients,
            size: clients.size,
        };
    },
    inject: [REDIS_MODULE_OPTIONS],
});
export const createAsyncClientOptions = (options) => ({
    provide: REDIS_MODULE_OPTIONS,
    useFactory: options.useFactory,
    inject: options.inject,
});
