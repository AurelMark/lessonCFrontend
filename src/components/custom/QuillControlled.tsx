import dynamic from "next/dynamic";
import { useEffect, useMemo, useRef, useState } from "react";

const ReactQuill = dynamic(() => import("react-quill-new"), { ssr: false });

type Props = {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
};

export const QuillControlled = ({ value, onChange, onBlur }: Props) => {
  const toolbarId = useMemo(() => `quill-toolbar-${Math.random().toString(36).substring(2, 9)}`, []);
  const [ready, setReady] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (containerRef.current?.querySelector(`#${toolbarId}`)) {
      setReady(true);
    }
  }, [toolbarId]);

  const modules = useMemo(
    () => ({
      toolbar: { container: `#${toolbarId}` },
    }),
    [toolbarId]
  );

  const formats = useMemo(
    () => [
      "header",
      "bold",
      "italic",
      "underline",
      "strike",
      "blockquote",
      "list",
      "indent",
      "link",
      "image",
    ],
    []
  );

  return (
    <div ref={containerRef}>
      <div id={toolbarId}>
        <span className="ql-formats">
          <select className="ql-header" defaultValue="">
            <option value="1" />
            <option value="2" />
            <option value="" />
          </select>
        </span>
        <span className="ql-formats">
          <button className="ql-bold" />
          <button className="ql-italic" />
          <button className="ql-underline" />
          <button className="ql-strike" />
        </span>
        <span className="ql-formats">
          <button className="ql-blockquote" />
          <button className="ql-list" value="ordered" />
          <button className="ql-list" value="bullet" />
          <button className="ql-indent" value="-1" />
          <button className="ql-indent" value="+1" />
        </span>
        <span className="ql-formats">
          <button className="ql-link" />
          <button className="ql-image" />
        </span>
        <span className="ql-formats">
          <button className="ql-clean" />
        </span>
      </div>

      {ready && (
        <ReactQuill
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          theme="snow"
          modules={modules}
          formats={formats}
        />
      )}
    </div>
  );
};
