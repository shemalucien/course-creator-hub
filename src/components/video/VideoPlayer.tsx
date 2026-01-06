import { useState } from 'react';
import { Play, ExternalLink } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface VideoPlayerProps {
  videoUrl: string;
  videoType: 'youtube' | 'uploaded';
  title?: string;
}

function extractYouTubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /youtube\.com\/v\/([^&\n?#]+)/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  return null;
}

export function VideoPlayer({ videoUrl, videoType, title }: VideoPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  if (videoType === 'youtube') {
    const videoId = extractYouTubeId(videoUrl);
    
    if (!videoId) {
      return (
        <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
          <p className="text-muted-foreground">Invalid YouTube URL</p>
        </div>
      );
    }

    if (!isPlaying) {
      return (
        <div 
          className="aspect-video bg-muted rounded-lg relative overflow-hidden cursor-pointer group"
          onClick={() => setIsPlaying(true)}
        >
          <img
            src={`https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`}
            alt={title || 'Video thumbnail'}
            className="w-full h-full object-cover"
            onError={(e) => {
              (e.target as HTMLImageElement).src = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
            }}
          />
          <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
            <div className="h-16 w-16 rounded-full bg-primary/90 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Play className="h-8 w-8 text-primary-foreground ml-1" />
            </div>
          </div>
          {title && (
            <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
              <h4 className="text-white font-medium">{title}</h4>
            </div>
          )}
        </div>
      );
    }

    return (
      <div className="aspect-video rounded-lg overflow-hidden">
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
          title={title || 'Video player'}
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="w-full h-full"
        />
      </div>
    );
  }

  // Uploaded video
  return (
    <div className="aspect-video rounded-lg overflow-hidden bg-black">
      <video
        src={videoUrl}
        controls
        className="w-full h-full"
        title={title}
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
}

interface VideoThumbnailProps {
  videoUrl: string;
  videoType: 'youtube' | 'uploaded';
  title?: string;
  onClick?: () => void;
}

export function VideoThumbnail({ videoUrl, videoType, title, onClick }: VideoThumbnailProps) {
  if (videoType === 'youtube') {
    const videoId = extractYouTubeId(videoUrl);
    
    return (
      <div 
        className="aspect-video bg-muted rounded-lg relative overflow-hidden cursor-pointer group"
        onClick={onClick}
      >
        {videoId && (
          <img
            src={`https://img.youtube.com/vi/${videoId}/mqdefault.jpg`}
            alt={title || 'Video thumbnail'}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center group-hover:bg-black/40 transition-colors">
          <div className="h-10 w-10 rounded-full bg-primary/90 flex items-center justify-center">
            <Play className="h-5 w-5 text-primary-foreground ml-0.5" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div 
      className="aspect-video bg-muted rounded-lg flex items-center justify-center cursor-pointer hover:bg-muted/80 transition-colors"
      onClick={onClick}
    >
      <div className="text-center">
        <Play className="h-8 w-8 text-muted-foreground mx-auto mb-2" />
        <p className="text-sm text-muted-foreground">{title || 'Play video'}</p>
      </div>
    </div>
  );
}
