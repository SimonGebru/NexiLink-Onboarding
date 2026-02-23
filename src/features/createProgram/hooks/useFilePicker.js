import { useRef, useState } from "react";

export function useFilePicker() {
  const fileInputRef = useRef(null);
  const [selectedFiles, setSelectedFiles] = useState([]);

  function onChooseFilesClick() {
    fileInputRef.current?.click();
  }

  function onFilesSelected(e) {
    const files = Array.from(e.target.files || []);
    if (files.length === 0) return;

    setSelectedFiles((prev) => {
      const existingKey = new Set(prev.map((f) => `${f.name}-${f.size}`));
      const next = [...prev];
      for (const f of files) {
        const key = `${f.name}-${f.size}`;
        if (!existingKey.has(key)) next.push(f);
      }
      return next;
    });

    e.target.value = "";
  }

  function removeSelectedFile(index) {
    setSelectedFiles((prev) => prev.filter((_, i) => i !== index));
  }

  function clearSelectedFiles() {
    setSelectedFiles([]);
  }

  return {
    fileInputRef,
    selectedFiles,
    setSelectedFiles,

    onChooseFilesClick,
    onFilesSelected,
    removeSelectedFile,
    clearSelectedFiles,
  };
}