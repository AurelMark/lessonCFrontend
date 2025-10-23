import { useState, useRef, useMemo } from "react";
import { Button } from "@/componentsUI/button";
import { Badge } from "@/componentsUI/badge";
import { Pause, Play, SkipBack, SkipForward, Music2 } from "lucide-react";
import Image from "next/image";
import { useTranslations } from "next-intl";

type Material = {
  name: string;
  type: string;
  url: string;
  order: number;
};

type AudioAlbumProps = {
  materials: Material[];
  cover?: string;
};

export function AudioAlbum({ materials, cover }: AudioAlbumProps) {
  const tracks = useMemo(
    () => materials.sort((a, b) => a.order - b.order),
    [materials]
  );

  const t = useTranslations("learn.lesson");

  const [current, setCurrent] = useState(0);
  const [playing, setPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  const handlePlayPause = () => {
    if (playing) {
      audioRef.current?.pause();
    } else {
      audioRef.current?.play();
    }
  };

  const handleEnded = () => {
    if (current < tracks.length - 1) {
      setCurrent((idx) => idx + 1);
      setPlaying(true);
      setTimeout(() => audioRef.current?.play(), 100);
    } else {
      setPlaying(false);
    }
  };

  const handleSelectTrack = (idx: number) => {
    setCurrent(idx);
    setPlaying(true);
    setTimeout(() => audioRef.current?.play(), 100);
  };

  if (!tracks.length)
    return (
      <div className="p-6 text-center text-muted-foreground">
        {t("noAudio")}
      </div>
    );

  return (
    <div className="bg-muted rounded-xl p-5 w-full mx-auto flex flex-col gap-6 shadow">
      <div className="flex flex-col gap-6">
        <div className="flex flex-col items-center">
          {cover ? (
            <Image
              src={cover}
              alt={t("albumCover")}
              width={192}
              height={192}
              className="object-cover rounded-lg mb-2 shadow"
              style={{ width: "192px", height: "192px" }}
              unoptimized
            />
          ) : (
            <div className="w-48 h-48 bg-muted-foreground/10 flex items-center justify-center rounded-lg mb-2">
              <Music2 className="w-20 h-20 text-muted-foreground" />
            </div>
          )}
          <div className="mt-2 font-bold text-lg">
            {tracks[0].name.replace(/\d+\.\s*/, "").replace(/\.mp3$/, "")}
          </div>
          <div className="text-sm text-muted-foreground">
            {`${t("albumOf")} ${tracks.length} ${t("tracks")}`}
          </div>
        </div>
        <div className="flex-1 flex flex-col gap-3">
          <div className="flex items-center justify-center gap-2">
            <Button
              size="icon"
              variant="outline"
              disabled={current === 0}
              onClick={() => handleSelectTrack(current - 1)}
              aria-label={t("prevTrack")}
            >
              <SkipBack />
            </Button>
            <Button
              size="icon"
              variant="default"
              onClick={handlePlayPause}
              aria-label={playing ? t("pause") : t("play")}
            >
              {playing ? <Pause /> : <Play />}
            </Button>
            <Button
              size="icon"
              variant="outline"
              disabled={current === tracks.length - 1}
              onClick={() => handleSelectTrack(current + 1)}
              aria-label={t("nextTrack")}
            >
              <SkipForward />
            </Button>
          </div>
          <div className="mt-2 font-medium text-center">
            {tracks[current]?.name}
          </div>
          <audio
            ref={audioRef}
            src={tracks[current]?.url}
            controls
            controlsList="nodownload"
            className="w-full"
            onPlay={() => setPlaying(true)}
            onPause={() => setPlaying(false)}
            onEnded={handleEnded}
          />
          <div className="flex flex-col gap-1 max-h-64 overflow-y-auto mt-4">
            {tracks.map((track, idx) => (
              <div
                key={track.order}
                onClick={() => handleSelectTrack(idx)}
                className={`flex items-center gap-2 px-2 py-1 rounded cursor-pointer transition
                  ${
                    idx === current
                      ? "bg-primary/10 font-bold"
                      : "hover:bg-muted-foreground/10"
                  }`}
              >
                <Badge className="mr-2 shrink-0">{track.order}</Badge>
                <span className="truncate">{track.name}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
