"use client";

interface VideoPlayerProps {
  url: string;
}

export default function VideoPlayer({ url }: VideoPlayerProps) {
  if (!url) return null;

  // Extract YouTube ID
  const getYouTubeId = (url: string) => {
    const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url.match(regExp);
    return (match && match[2].length === 11) ? match[2] : null;
  };

  const videoId = getYouTubeId(url);

  if (!videoId) {
    return (
      <div className="w-full aspect-video bg-gray-100 flex items-center justify-center rounded-2xl border border-gray-200">
         <p className="text-gray-400 text-sm">Video link tidak valid</p>
      </div>
    );
  }

  return (
    <div className="w-full aspect-video rounded-2xl overflow-hidden shadow-2xl bg-black">
      <iframe
        className="w-full h-full"
        src={`https://www.youtube.com/embed/${videoId}`}
        title="YouTube video player"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      ></iframe>
    </div>
  );
}
