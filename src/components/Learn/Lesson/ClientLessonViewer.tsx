"use client";
import { VideoLearn } from "@/custom//Video";
import { AudioAlbum } from "@/custom//Audio";
import { ImageBig } from "@/custom//ImageBig";
import { PDFView } from "@/custom//PdfView";

type Material = {
  name: string;
  type: string;
  url: string;
  order: number;
};

type LessonMaterialsViewerProps = {
  materials: Material[];
  imageUrl?: string;
};

export function LessonMaterialsViewer({
  materials,
  imageUrl,
}: LessonMaterialsViewerProps) {
  const sorted = [...materials].sort((a, b) => a.order - b.order);
  const images = sorted.filter((m) => m.type.startsWith("image"));
  const videos = sorted.filter((m) => m.type.startsWith("video"));
  const audios = sorted.filter((m) => m.type.startsWith("audio"));
  const pdfs = sorted.filter(
    (m) => m.type === "application/pdf" || m.type.startsWith("pdf")
  );

  return (
    <div className="flex flex-col gap-8">
      <ImageBig images={images} />

      {videos.length > 0 && (
        <div className="flex flex-wrap gap-6">
          {videos.map((video) => (
            <div key={video.url} className="w-full">
              <VideoLearn src={video.url} />
            </div>
          ))}
        </div>
      )}

      {audios.length > 0 && (
        <AudioAlbum materials={audios} cover={imageUrl || images[0]?.url} />
      )}

      {pdfs.length > 0 && (
        <div className="flex flex-col gap-4">
          {pdfs.map((pdf) => (
            <div key={pdf.url} className="w-full">
              <PDFView src={pdf.url} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
