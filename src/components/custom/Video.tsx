type TVideoLearnProps = {
  src: string;
};

export function VideoLearn({ src }: TVideoLearnProps) {
  return (
    <div className="w-full mx-auto">
      <video
        controls
        src={src}
        controlsList="nodownload"
        className="w-full h-auto rounded-lg shadow"
      />
    </div>
  );
}
