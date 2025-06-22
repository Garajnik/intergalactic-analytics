import { useState, useRef } from "react";
import styles from "./FileLoader.module.css";
import Button from "../Button/Button";
import FileUploadButton from "../FIleUploadButton/FileUploadButton";
import type { FileUploadButtonProps } from "../FIleUploadButton/FileUploadButton.type";
import Statistics from "../Statistics/Statistics";
import type { StatJSON } from "../Statistics/Statistics.type";
import type { Aggregation } from "./FileLoader.type";

// Define the structure for saved aggregations

function getCurrentDate(): string {
  const today = new Date();
  const day = String(today.getDate()).padStart(2, "0");
  const month = String(today.getMonth() + 1).padStart(2, "0");
  const year = today.getFullYear();
  return `${day}.${month}.${year}`;
}

export default function FileLoader() {
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [buttonText, setButtonText] = useState<string>("Загрузить файл");
  const [bottomText, setBottomText] = useState<string>("или перетащите сюда");
  const fileInputRef = useRef<HTMLInputElement>(null);

  const initialStats: StatJSON = {
    total_spend_galactic: 0,
    rows_affected: 0,
    less_spent_at: 0,
    big_spent_at: 0,
    less_spent_value: 0,
    big_spent_value: 0,
    average_spend_galactic: 0,
    big_spent_civ: "",
    less_spent_civ: "",
  };
  const [parsedJSON, setParsedJSON] = useState<StatJSON>(initialStats);
  const [fileLoadStatus, setFileLoadStatus] =
    useState<FileUploadButtonProps["status"]>("default");

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
      setFileLoadStatus("default");
    } else {
      setBottomText("Упс, не то...");
      setFileLoadStatus("error");
      setButtonText(file.name);
    }
  };

  const handleDiscardFile = () => {
    setSelectedFile(null);
    setButtonText("Загрузить файл");
    setBottomText("или перетащите сюда");
    setFileLoadStatus("default");
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  // Function to save an aggregation to localStorage
  const saveAggregation = (newAggregation: Aggregation) => {
    let aggregations: Aggregation[] = [];
    const storedAggregations = localStorage.getItem("aggregations");
    if (storedAggregations) {
      aggregations = JSON.parse(storedAggregations);
    }
    aggregations.push(newAggregation);
    localStorage.setItem("aggregations", JSON.stringify(aggregations));
  };

  const handleSubmit = () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      setFileLoadStatus("loading");
      setBottomText("Идёт парсинг файла");
      fetch("http://localhost:3000/aggregate?rows=10000", {
        method: "POST",
        body: formData,
      })
        .then((response) => response.text())
        .then((data) => {
          const jsonStrings = data.trim().split("\n");
          const parsedData = jsonStrings
            .map((jsonString) => {
              try {
                return JSON.parse(jsonString);
              } catch (error) {
                console.error(
                  "Ошибка парсинга JSON:",
                  error,
                  "Строка:",
                  jsonString
                );
                return null;
              }
            })
            .filter((item) => item !== null);
          console.log(parsedData);
          const lastData = parsedData[parsedData.length - 1];
          setParsedJSON(lastData);

          const currentDate = getCurrentDate();
          const id = Date.now().toString();
          const newAggregation: Aggregation = {
            id: id,
            fileName: selectedFile.name,
            date: currentDate,
            data: lastData,
          };
          saveAggregation(newAggregation);

          setBottomText("Готово!");
          setFileLoadStatus("success");
        })
        .catch((error) => {
          setBottomText("Упс, не то...");
          setFileLoadStatus("error");

          const currentDate = getCurrentDate();
          const id = Date.now().toString();
          const newAggregation: Aggregation = {
            id: id,
            date: currentDate,
            fileName: selectedFile.name,
            error: error.message,
            data: initialStats,
          };
          saveAggregation(newAggregation);

          console.error(error);
        });
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
          status={fileLoadStatus}
          buttonText={buttonText}
          fileInputRef={fileInputRef}
          handleDiscardFile={handleDiscardFile}
          handleFileSelect={handleFileSelect}
          selectedFile={selectedFile}
        />
        <span
          className={`${styles.fileUploadStatusText} ${
            fileLoadStatus === "error" ? styles.fileUploadStatusError : ""
          }`}
        >
          {bottomText}
        </span>
      </div>
      {fileLoadStatus !== "success" ? (
        <Button
          handleClick={handleSubmit}
          type="send"
          disabled={selectedFile ? false : true}
        >
          Отправить
        </Button>
      ) : (
        ""
      )}
      {fileLoadStatus === "success" ? (
        <Statistics json={parsedJSON} />
      ) : (
        <p className={styles.textHighlight}>
          Здесь
          <br />
          появятся хайлайты
        </p>
      )}
    </div>
  );
}
