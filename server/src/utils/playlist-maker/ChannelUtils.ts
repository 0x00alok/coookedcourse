export class ChannelUtils {
  constructor(private readonly channels, private readonly chapters) { }

  findChannel(channelName: string) {
    return this.channels.find(
      (channel) => channel.channelName === channelName
    );
  }

  findMatchedVideos(channel, titles) {
    if (!channel) return [];

    return channel.items
      .filter((video) =>
        titles.includes(video.title)
      )
      .map((video) => ({
        ytVideoTitle: video.title,
        ytVideoId: video.videoId,
      }));
  }
}