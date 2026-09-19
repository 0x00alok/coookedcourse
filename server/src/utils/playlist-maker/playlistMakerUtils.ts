import axios from 'axios'
import { LLMPassedSyllabusYoutubeTopics } from '../../types/playlistMaker';
import { CK_COOKED_PLAYLIST_LIST } from '../../constants/constants';
import { fetchTemplate } from '../redis-client/checkExistsInCache';

// Returns playlist ids
export const extractPlaylistIds = (playlists: any[]): string[] => {
    return playlists.map((playlist: any) => playlist.id.playlistId)
}

// Funtion to return all playlists of related subject 
export const fetchPlaylistsOfSubject = async (token: string, SEARCH_PLAYLIST_URL: string) => {
    // TODO: Better Key Generation
    const cacheKey = `${token}#${CK_COOKED_PLAYLIST_LIST}`

    const playlistsItem = await fetchTemplate(cacheKey, SEARCH_PLAYLIST_URL)

    return playlistsItem;
}

// Function that performs an axios GET request with a retry mechanism.
export const axiosGetWithRetry = async (url: string, retries: number = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (err) {
            console.error(`Attempt ${attempt} failed for URL: ${url}. Retrying...`);
            if (attempt === retries) {
                // If this was the last attempt, throw the error
                throw err;
            }
            await new Promise(res => setTimeout(res, 1000));
        }
    }
};

// Helper function that performs an axios POST request with a retry mechanism
export const axiosPostWithRetry =
    async (url: string,
        payload: LLMPassedSyllabusYoutubeTopics,
        retries: number = 3) => {
        for (let attempt = 1; attempt < retries; attempt++) {
            try {
                const response = await axios.post(url, payload)
                return response.data
            } catch (err) {
                console.error(`Attempt ${attempt} failed for URL: ${url}. Retrying...`);

                if (attempt == retries) {
                    throw err
                }
                // Wait 1 second before the next attempt
                await new Promise(res => setTimeout(res, 1000));
            }
        }
    }

// Fetches all video items from a list of YouTube playlist URLs
export const fetchAllVideosWithRetry = (URLS: string[], retries = 3) => {
    const promises = URLS.map(url =>
        (async () => {
            let allItems = [];
            let nextPageToken = null;
            let isFirstRequest = true;

            do {
                // Construct the URL for the current page with pageToken
                const urlToFetch = isFirstRequest ? url : `${url}&pageToken=${nextPageToken}`;

                // Fetch the data using retry helper
                const response = await axiosGetWithRetry(urlToFetch, retries);

                if (response.items) {
                    allItems.push(...response.items);
                }

                // Update the token for the next iteration
                nextPageToken = response.nextPageToken;
                isFirstRequest = false;

            } while (nextPageToken);

            return allItems;
        })()
    );

    return Promise.allSettled(promises);
};

// Helper to fetch statistics for a list of video IDs in batches of 50
export const fetchVideosStatisticsBatch = async (videoIds: string[], apiKey: string, retries = 3) => {
    const statsMap: Record<string, any> = {};
    if (!videoIds.length) return statsMap;

    const chunkArray = (arr: string[], size: number) => {
        const chunks = [];
        for (let i = 0; i < arr.length; i += size) {
            chunks.push(arr.slice(i, i + size));
        }
        return chunks;
    };

    const idChunks = chunkArray(videoIds, 50);
    const statsUrls = idChunks.map(chunk =>
        `https://youtube.googleapis.com/youtube/v3/videos?part=statistics,contentDetails&id=${chunk.join(',')}&key=${apiKey}`
    );

    // Fetch batches in parallel ???
    const results = await Promise.allSettled(
        statsUrls.map(url => axiosGetWithRetry(url, retries))
    );

    results.forEach(res => {
        if (res.status === 'fulfilled' && res.value?.items) {
            res.value.items.forEach((item: any) => {
                const rawDuration = item.contentDetails?.duration || 'PT0S';

                statsMap[item.id] = {
                    viewCount: item.statistics?.viewCount || '0',
                    durationInSeconds: parseYouTubeDuration(rawDuration),
                    durationIso: rawDuration
                };
            });
        }
    });

    return statsMap;
};


export const parseYouTubeDuration = (isoDuration: string): number => {
    const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
    if (!match) return 0;

    const hours = parseInt(match[1] || '0', 10);
    const minutes = parseInt(match[2] || '0', 10);
    const seconds = parseInt(match[3] || '0', 10);

    return hours * 3600 + minutes * 60 + seconds;
};