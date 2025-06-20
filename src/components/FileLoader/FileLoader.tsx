import { useState, useRef } from "react";
import styles from "./FileLoader.module.css";
import Button from "../Button/Button";
import FileUploadButton from "../FIleUploadButton/FileUploadButton";

export default function FileLoader() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [buttonText, setButtonText] = useState<string>("Загрузить файл");
  const [bottomText, setBottomText] = useState<string>("или перетащите сюда");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [isLoading, setIsLoading] = useState(false);

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

  const handleSubmit = async () => {
    const formData = new FormData();
    formData.append("csvFile", selectedFile);
    formData.append("rows", "1000");

    try {
      const response = await fetch("http://localhost:3000/upload", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const result = await response.json();
      console.log("Server response:", result);
      alert("Upload successful!");
    } catch (error) {
      console.error("Error:", error);
      alert("Upload failed!");
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
        <FileUploadButton
          loading={isLoading}
          buttonText={buttonText}
          fileInputRef={fileInputRef}
          handleDiscardFile={handleDiscardFile}
          handleFileSelect={handleFileSelect}
          selectedFile={selectedFile}
        />

        <span className={styles.fileUploadStatusText}>{bottomText}</span>
      </div>
      <Button
        handleClick={handleSubmit}
        type="send"
        disabled={selectedFile ? false : true}
      >
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
