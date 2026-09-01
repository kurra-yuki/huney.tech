import { videos } from "@/config/videos";

export function getAllVideos() {
    return [...videos].sort((a, b) => {
        if (!a.publishedAt && !b.publishedAt) return a.title.localeCompare(b.title, "ja");
        if (!a.publishedAt) return 1;
        if (!b.publishedAt) return -1;
        return Date.parse(b.publishedAt) - Date.parse(a.publishedAt) || a.title.localeCompare(b.title, "ja");
    });
}

export function getVideosByCategory(category: string) {
    return getAllVideos().filter((video) => video.category === category);
}
