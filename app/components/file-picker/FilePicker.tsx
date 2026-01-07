import type { ChangeEvent } from "react";
import styles from "./FilePicker.module.css";

interface FilePickerProps {
  acceptedFileTypes: string;
  placeholderText: string;
  selectedFileName?: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
}

export function FilePicker({
  acceptedFileTypes,
  placeholderText,
  selectedFileName,
  onFileChange,
}: FilePickerProps) {
  return (
    <label className={styles.fileInput}>
      <span>{selectedFileName || placeholderText}</span>
      <input
        type="file"
        accept={acceptedFileTypes}
        onChange={onFileChange}
        hidden
      />
    </label>
  );
}
