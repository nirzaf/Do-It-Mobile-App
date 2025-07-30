import { useState, useRef, useEffect } from 'react';
import { Button } from '../ui/Button';
import { Card } from '../ui/Card';
import { useLanguage } from '../../context/LanguageContext';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  RotateCcw,
  Settings,
  Dumbbell
} from 'lucide-react';

interface ExerciseVideoPlayerProps {
  exercise: {
    id: string;
    name: string;
    videoUrl?: string;
    thumbnailUrl?: string;
  };
  autoPlay?: boolean;
  showControls?: boolean;
  className?: string;
}

/**
 * Enhanced exercise video player component
 */
export function ExerciseVideoPlayer({ 
  exercise, 
  autoPlay = false, 
  showControls = true,
  className = ""
}: ExerciseVideoPlayerProps) {
  const { t } = useLanguage();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [showSettings, setShowSettings] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => {
      setDuration(video.duration);
      setIsLoading(false);
      if (autoPlay) {
        video.play();
        setIsPlaying(true);
      }
    };

    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime);
    };

    const handleEnded = () => {
      setIsPlaying(false);
      setCurrentTime(0);
    };

    const handleError = () => {
      setHasError(true);
      setIsLoading(false);
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('ended', handleEnded);
    video.addEventListener('error', handleError);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('ended', handleEnded);
      video.removeEventListener('error', handleError);
    };
  }, [autoPlay]);

  /**
   * Toggle play/pause
   */
  const togglePlay = () => {
    const video = videoRef.current;
    if (!video) return;

    if (isPlaying) {
      video.pause();
    } else {
      video.play();
    }
    setIsPlaying(!isPlaying);
  };

  /**
   * Toggle mute
   */
  const toggleMute = () => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = !video.muted;
    setIsMuted(video.muted);
  };

  /**
   * Seek to specific time
   */
  // const seekTo = (time: number) => {
  //   const video = videoRef.current;
  //   if (!video) return;

  //   video.currentTime = time;
  //   setCurrentTime(time);
  // };

  /**
   * Change playback speed
   */
  const changeSpeed = (speed: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = speed;
    setPlaybackSpeed(speed);
    setShowSettings(false);
  };

  /**
   * Toggle fullscreen
   */
  const toggleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (!isFullscreen) {
      if (video.requestFullscreen) {
        video.requestFullscreen();
      }
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    }
    setIsFullscreen(!isFullscreen);
  };

  /**
   * Restart video
   */
  const restartVideo = () => {
    const video = videoRef.current;
    if (!video) return;

    video.currentTime = 0;
    setCurrentTime(0);
    if (!isPlaying) {
      video.play();
      setIsPlaying(true);
    }
  };

  /**
   * Format time display
   */
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0;

  return (
    <Card className={`overflow-hidden ${className}`}>
      <div className="relative aspect-video bg-slate-900">
        {/* Video Element */}
        {exercise.videoUrl && !hasError ? (
          <video
            ref={videoRef}
            className="w-full h-full object-cover"
            poster={exercise.thumbnailUrl}
            preload="metadata"
            playsInline
          >
            <source src={exercise.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          /* Fallback Placeholder */
          <div className="absolute inset-0 flex items-center justify-center bg-gradient-to-br from-blue-600 to-purple-700">
            <div className="text-center text-white">
              <Dumbbell className="h-16 w-16 mx-auto mb-4 opacity-50" />
              <p className="text-lg font-medium">{exercise.name}</p>
              <p className="text-sm opacity-75">
                {hasError ? t('videoError') : t('exerciseDemo')}
              </p>
            </div>
          </div>
        )}

        {/* Loading Overlay */}
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-black/50">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white"></div>
          </div>
        )}

        {/* Video Controls Overlay */}
        {showControls && !isLoading && !hasError && (
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 opacity-0 hover:opacity-100 transition-opacity duration-300">
            {/* Top Controls */}
            <div className="absolute top-4 right-4 flex space-x-2">
              <Button
                variant="secondary"
                size="sm"
                onClick={toggleMute}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                {isMuted ? (
                  <VolumeX className="h-4 w-4" />
                ) : (
                  <Volume2 className="h-4 w-4" />
                )}
              </Button>

              <div className="relative">
                <Button
                  variant="secondary"
                  size="sm"
                  onClick={() => setShowSettings(!showSettings)}
                  className="bg-white/20 hover:bg-white/30 text-white border-white/30"
                >
                  <Settings className="h-4 w-4" />
                </Button>

                {/* Settings Dropdown */}
                {showSettings && (
                  <div className="absolute top-full right-0 mt-2 bg-white dark:bg-slate-800 rounded-lg shadow-lg p-2 min-w-[120px] z-10">
                    <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">
                      {t('playbackSpeed')}
                    </p>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(speed => (
                      <button
                        key={speed}
                        onClick={() => changeSpeed(speed)}
                        className={`w-full text-left px-2 py-1 text-sm rounded hover:bg-slate-100 dark:hover:bg-slate-700 ${
                          playbackSpeed === speed 
                            ? 'bg-blue-100 dark:bg-blue-900 text-blue-600 dark:text-blue-400' 
                            : 'text-slate-700 dark:text-slate-300'
                        }`}
                      >
                        {speed}x
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <Button
                variant="secondary"
                size="sm"
                onClick={toggleFullscreen}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                <Maximize className="h-4 w-4" />
              </Button>
            </div>

            {/* Center Play Button */}
            <div className="absolute inset-0 flex items-center justify-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={togglePlay}
                className="bg-white/20 hover:bg-white/30 text-white border-white/30"
              >
                {isPlaying ? (
                  <Pause className="h-8 w-8" />
                ) : (
                  <Play className="h-8 w-8" />
                )}
              </Button>
            </div>

            {/* Bottom Controls */}
            <div className="absolute bottom-4 left-4 right-4">
              {/* Progress Bar */}
              <div className="mb-3">
                <div className="w-full bg-white/20 rounded-full h-1">
                  <div 
                    className="bg-white h-1 rounded-full transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>

              {/* Time and Controls */}
              <div className="flex items-center justify-between text-white text-sm">
                <div className="flex items-center space-x-3">
                  <Button
                    variant="secondary"
                    size="sm"
                    onClick={restartVideo}
                    className="bg-white/20 hover:bg-white/30 text-white border-white/30 p-1"
                  >
                    <RotateCcw className="h-3 w-3" />
                  </Button>
                  
                  <span>
                    {formatTime(currentTime)} / {formatTime(duration)}
                  </span>
                </div>

                <span className="text-xs opacity-75">
                  {playbackSpeed}x {t('speed')}
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </Card>
  );
}
