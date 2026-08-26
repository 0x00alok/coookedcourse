import { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

import UnitTitleHeader from '@/components/CookedPlaylist/UnitTitleHeader';
import UnitRail from '@/components/CookedPlaylist/UnitRail';
import SearchTopic from '@/components/SearchTopic';
import YTChannelSelect from '@/components/CookedPlaylist/YTChannelSelect';
import SortUnit from '@/components/CookedPlaylist/SortUnit';
import YTTopicCard from '@/components/CookedPlaylist/YTTopicCard';
import UnitDetailsCard from '@/components/CookedPlaylist/UnitDetailsCard';
import Sidebar from '@/components/Sidebar';
import { generateCourse } from '@/services/generateCourse';
import { PAPER } from '@/constants/colors'

export default function TestCp() {
    const [navChannels, setNavChannels] = useState([]);
    const [chapters, setChapters] = useState([]);
    const [activeChannelIndex, setActiveChannelIndex] = useState(0);
    const [activeChapterIndex, setActiveChapterIndex] = useState(0);
    const [analysisMap, setAnalysisMap] = useState({});

    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(false);

    // Course data to fetch 
    // const courseDataToPost = useLocation().state;
    const courseDataToPost = {
        subject: 'AI',
        syllabus: { 'Unit1': 'Knowledge Representation: Approaches and issues in knowledge representation, Knowledge Based Agents, Propositional Logic, Predicate Logic- Unification and Resolution, Weak slot –Filler Structure Strong slot- Filler structure' },
        client: "a2d2253e-1cd1-4ac7-bd9a-3b180902fd94"
    };

    const currentChapter = chapters[activeChapterIndex] || null;
    const currentChannel = navChannels[activeChannelIndex] || null;

    const currentAnalysis = (currentChannel && currentChapter)
        ? analysisMap[currentChannel]?.[currentChapter.id]
        : null;

    const { matchedSyllabusTopics, unmatchedSyllabusTopics } = currentAnalysis ? currentAnalysis : { matchedSyllabusTopics: [], unmatchedSyllabusTopics: [] };

    const rawVideos = currentAnalysis?.videos || [];
    const rawFallbackVideos = currentAnalysis?.fallbackVideos || [];

    const videos = rawVideos.map((vid) => ({
        id: vid.ytVideoId,
        title: vid.ytVideoTitle,
        duration: `${Math.random() * (15 - 1) + 1} mins`,
        viewCount: `${Math.random() * (15 - 1) + 1}k`,
        channel: currentChannel,
        unit: activeChapterIndex,
        thumbnail: `https://img.youtube.com/vi/${vid.ytVideoId}/hqdefault.jpg`,
    }))

    const fallbackVideos = rawFallbackVideos.map((video) => ({
        id: video.ytVideoId,
        title: video.ytVideoTitle,
        topicName: video.topicName,
        duration: `${Math.random() * (15 - 1) + 1} mins`,
        viewCount: `${Math.random() * (15 - 1) + 1}k`,
        insight: `Automated dynamic recovery video brought in to fully cover the missed syllabus topic: "${video.topicName}".`,
        coveragePct: 100,
        isFallback: true,
        timestamps: [
            { t: "0:00", label: `Explaining ${video.topicName}` }
        ]
    }));

    function handleChannelSelect(index) {
        setActiveChannelIndex(index);
        setActiveChapterIndex(0);
    }

    function handleChapterSelect(unitIndex) {
        setActiveChapterIndex(unitIndex);
    }

    useEffect(() => {
        async function fetchPlaylists() {
            try {
                setIsLoading(true);

                const res = await generateCourse(courseDataToPost);
                const resData = res.data ? res.data : res;
                console.log(resData);

                if (resData.message === 'success') {
                    setNavChannels(res.channels || []);
                    setChapters(res.navChapters || [])
                    setAnalysisMap(resData.analysisMap || {});
                }
            } catch (err) {
                setError(err.message);
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        }

        fetchPlaylists();
    }, []);

    return (
        <div className="min-h-screen overflow-x-hidden font-nunito" style={{ background: PAPER }}>
            <Sidebar />

            {/* Main Content */}
            <div className="ml-16 flex overflow-x-hidden">
                <div className="flex-1 min-w-0 px-10 py-8">
                    <UnitTitleHeader />

                    <SearchTopic />

                    <YTChannelSelect
                        navChannels={navChannels}
                        onChannelSelect={handleChannelSelect}
                        activeChannelIndex={activeChannelIndex}
                    />

                    <UnitRail
                        chapters={chapters}
                        onChapterSelect={handleChapterSelect} activeChapterIndex={activeChapterIndex}
                    />

                    <SortUnit />

                    <YTTopicCard videos={videos} fallbackVideos={fallbackVideos} />
                </div>

                <UnitDetailsCard
                    matchedSyllabusTopics={matchedSyllabusTopics}
                    unmatchedSyllabusTopics={unmatchedSyllabusTopics}
                    activeChapterIndex={activeChapterIndex}
                    currentChannel={currentChannel}
                    currentChapter={currentChapter}
                />
            </div>
        </div>
    );
}