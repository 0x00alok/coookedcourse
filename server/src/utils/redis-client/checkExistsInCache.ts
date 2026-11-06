import { getRedisClient } from './getRedisClient'

export const checkInCacheThenCall = async (cacheKey: string, fn: Function) => {
    // TODO: expire cache
    const client = await getRedisClient();

    let data = await client.get(cacheKey);

    if (!data) {
        // Call function and cache it's value
        await client.set(cacheKey, JSON.stringify(await fn()));
    }

    return data ? JSON.parse(data) : JSON.parse((await client.get(cacheKey))!);
}
