type TPDFViewProps = {
  src: string;
};

export function PDFView({ src }: TPDFViewProps) {
  const params = "#toolbar=0&navpanes=0&scrollbar=1";
  return (
    <div className="w-full mx-auto">
      <iframe
        src={src + params}
        width="100%"
        height="600"
        allow="autoplay"
        style={{ border: "none" }}
      />
    </div>
  );
}
