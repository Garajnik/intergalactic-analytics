import { useState, useRef } from "react";
import styles from "./FileLoader.module.css";
import Button from "../Button/Button";

export default function FileLoader() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [buttonText, setButtonText] = useState<string>("Загрузить файл");
  const [bottomText, setBottomText] = useState<string>("или перетащите сюда");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragEnter = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragging(false);
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      handleFile(file);
    }
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const file = files[0];
      handleFile(file);
    }
  };

  const handleFile = (file: File) => {
    if (file.type === "text/csv" || file.name.endsWith(".csv")) {
      setSelectedFile(file);
      setButtonText(file.name);
      setBottomText("Файл загружен!");
    } else {
      console.log("Разрешены только CSV файлы");
    }
  };

  const handleDiscardFile = () => {
    setSelectedFile(null);
    setButtonText("Загрузить файл");
    setBottomText("или перетащите сюда");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  return (
    <div className={styles.container}>
      <p className={styles.textTop}>
        Загрузите <b>csv</b> файл и получите <b>полную информацию</b> о нём за
        сверхнизкое время
      </p>
      <div
        className={`${styles.dndBG} ${isDragging ? styles.dragging : ""} ${
          selectedFile ? styles.uploaded : ""
        }`}
        onDragEnter={handleDragEnter}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className={styles.uploadButtonContainer}>
          <label
            className={`${styles.uploadButton} ${
              selectedFile ? styles.uploaded : ""
            }`}
            htmlFor="fileselect"
          >
            {buttonText}
          </label>
          <input
            id="fileselect"
            type="file"
            ref={fileInputRef}
            accept=".csv"
            style={{ display: "none" }}
            onChange={handleFileSelect}
          />
          {selectedFile && (
            <button className={styles.discardFile} onClick={handleDiscardFile}>
              <img src="/cross.png" alt="cross" />
            </button>
          )}
        </div>
        <span className={styles.fileUploadStatusText}>{bottomText}</span>
      </div>
      <Button type="send" disabled={selectedFile ? false : true}>
        Отправить
      </Button>
      <p className={styles.textHighlight}>
        Здесь
        <br />
        появятся хайлайты
      </p>
    </div>
  );
}
