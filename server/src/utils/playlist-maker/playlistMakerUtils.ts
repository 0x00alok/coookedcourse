import axios from 'axios';

// Returns playlist ids
export const extractPlaylistIds = (playlists: any[]): string[] => {
  return playlists.map((playlist: any) => playlist.id.playlistId)
}

// Function that performs GET request with a retry mechanism
export const axiosGetWithRetry =
  async (
    url: string,
    retries: number = 3
  ) => {
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

// Helper function that performs POST request with a retry mechanism
export const axiosPostWithRetry =
  async (
    url: string,
    payload: any,
    retries: number = 3
  ) => {
    for (let attempt = 1; attempt < retries; attempt++) {
      try {
        const response = await axios.post(url, payload)
        return response.data;
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

export const parseYouTubeDuration = (isoDuration: string): number => {
  const match = isoDuration.match(/PT(?:(\d+)H)?(?:(\d+)M)?(?:(\d+)S)?/);
  if (!match) return 0;

  const hours = parseInt(match[1] || '0', 10);
  const minutes = parseInt(match[2] || '0', 10);
  const seconds = parseInt(match[3] || '0', 10);

  return hours * 3600 + minutes * 60 + seconds;
};