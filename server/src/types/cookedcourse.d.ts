export type CookedTopics = {
    [key: string]: [{
        title: string,
        subtopics: string[]
    }]
}

// **** Input type from client to generate course ****
export type GenerateCourseRequest = {
    syllabus: InputSyllabus,
    subject: string,
    client: string
}

export type InputSyllabus = {
    [key: string]: string
}


// **** From LLM ****
// Extracted Topics
export type ExtractedTopic = {
    unit: number,
    name: string | "",
    topics: string[]
}

export type Chapter = {
    name?: string,
    chapterData: string,
    topics: string[]
}

// Analyzed Syllabus
type AnalysisData = {
    unit_coverage_percentage: number,
    unit_name: string,
    matched_videos_titles: string[],
    matched_topics: string[],
    unmatched_topics: string[]
}
type AnalyzedChapter = {
    overall_syllabus_coverage_percentage: number,
    sylabus_analysis: AnalysisData[]
}

export type AnalyzedSyllabus = {
    channelName: string,
    analyzedPlaylistData: AnalyzedChapter
}


// **** YouTube video item ****
type YouTubeVideoResourceId = {
    kind: string,
    videoId: string
}

type YouTubeVideoSnippet = {
    channelId: string,
    channelTitle: string,
    description: string,
    playlistId: string,
    position: number,
    publishedAt: string,
    resourceId: YouTubeVideoResourceId,
    thumbnails: any,
    title: string,
    videoOwnerChannelId: string,
    videoOwnerChannelTitle: string
}

type YouTubeVideoContentDetails = {
    videoId: string,
    videoPublishedAt: string
}

export type YouTubeVideoData = {
    contentDetails: YouTubeVideoContentDetails,
    etag: string,
    id: string,
    kind: string,
    snippet: YouTubeVideoSnippet,
}

export type YouTubeVideoApiResponse = {
    status: string,
    value: YouTubeVideoData[]
}

// Video Stats
type YouTubeVideoStatItemContentDetails = {
    caption: string,
    contentRating: {},
    definition: string,
    dimension: string,
    duration: string,
    licensedContent: boolean,
    projection: string
}

type YouTubeVideoStatItem = {
    contentDetails: YouTubeVideoContentDetails,
    etag: string,
    id: string,
    kind: string,
    statistics: {
        viewCount: string,
        likeCount: string,
        favoriteCount: string,
        commentCount: string
    }
}

export type YouTubeVideoStats = {
    etag: string,
    items: YouTubeVideoStatItem[],
    kind: string,
    pageInfo: string
}

// Playlist Items
type YouTubePlaylistItemSnippet = {
    channelId: string,
    channelTitle: string,
    description: string,
    liveBroadcastContent: string,
    publishedAt: string,
    publishTime: string,
    thumbnails: any,
    title: string
}

type YouTubePlaylistItem = {
    etag: string,
    id: { kind: string, playlistId: string },
    kind: string,
    snippet: YouTubePlaylistItemSnippet
}

export type YouTubePlaylistsResponse = {
    etag: string,
    items: YouTubePlaylistItem[],
    kind: string,
    nextPageToken: string,
    pageInfo: { totalResults: number, resultsPerPage: number },
    regionCode: string
}

// **** Video Id to Stat Map ****
export type VideoIdToStats = {
    [videoId: string]: {
        viewCount: string,
        durationInSeconds: number,
        durationIso: string
    }
}

// Analysis With Channel 
export type ChannelWithAnalysis = {
    channelName: string,
    matchedSyllabusTopics: string[],
    unmatchedSyllabusTopics: string[],
    unitCoveragePercentage: number,
    chapterId: string,
    matchedYoutubeTitles: {
        create: {
            ytVideoTitle: string,
            ytVideoId: string,
            viewCount: string,
            duration: number
        }[]
    },
}

// **** From DB ****
// Playlist Generation Data 
export type PlaylistGenerationTopic = {
    id: string,
    name: string | null,
    topics: string[]
}

export type ChapterWithTopics = Omit<PlaylistGenerationTopic, 'id'>

// Chapters with Analysis and Fallback videos Data
type ChapterAnalysisFallback = {
    id: string,
    topicName: string
    ytVideoTitle: string,
    ytVideoId: string,
    viewCount: string
    duration: number,
    chapterAnalysisId: string
}

type MatchedYoutubeTitle = {
    id: string,
    ytVideoTitle: string,
    ytVideoId: string,
    viewCount: string,
    duration: number,
    chapterAnalysisId: string
}

type ChapterAnalysis = {
    id: string,
    channelName: string,
    matchedSyllabusTopics: string[],
    unmatchedSyllabusTopics: string[],
    unitCoveragePercentage: number
    chapterId: string,
    matchedYoutubeTitles: MatchedYoutubeTitle[],
    fallbackVideos: ChapterAnalysisFallback[]
}

export type ChapterWithAnalysisAndFallback = {
    id: string,
    name: string | null,
    chapterData: string,
    topics: string[],
    chapterAnalysis: ChapterAnalysis[]
}

// **** Extracted Video Datas ****
export type ExtractedVideoData = {
    itemId: string,
    title: string,
    videoId: string,
    viewCount: string,
    durationInSeconds: number,
    durationIso: string
}

export type ExtractedVideoDataWithChannelDetail = {
    channelName: string,
    channelId: string,
    playlistId: string,
    items: ExtractedVideoData[]
}

export type ChannelWithTopics = {
    [channelName: string]: string[]
}