import { useState, useRef } from "react";
import styles from "./FileLoader.module.css";
import Button from "../Button/Button";
import FileUploadButton from "../FIleUploadButton/FileUploadButton";
import type { FileUploadButtonProps } from "../FIleUploadButton/FileUploadButton.type";
import Statistics from "../Statistics/Statistics";
import type { StatJSON } from "../Statistics/Statistics.type";
import type { Aggregation } from "./FileLoader.type";

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

  const abortController = new AbortController();

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

  const handleErrorFile = (filename: string) => {
    const currentDate = getCurrentDate();
    const id = Date.now().toString();
    const newAggregation: Aggregation = {
      id: id,
      date: currentDate,
      fileName: filename,
      error: "Error",
      data: initialStats,
    };
    saveAggregation(newAggregation);
  };

  function checkForNullValues(
    data: Partial<StatJSON>
  ): asserts data is StatJSON {
    for (const [key, value] of Object.entries(data)) {
      if (value === null || value === undefined) {
        throw new Error(`Ошибка: поле "${key}" содержит ${value}`);
      }
    }
  }

  const handleSubmit = async () => {
    if (selectedFile) {
      const formData = new FormData();
      formData.append("file", selectedFile);

      try {
        setFileLoadStatus("loading");
        setBottomText("Идёт парсинг файла");
        const response = await fetch(
          "http://localhost:3000/aggregate?rows=10000",
          {
            method: "POST",
            body: formData,
            signal: abortController.signal,
          }
        );

        if (!response.ok) {
          console.error("Ошибка при запросе:", response.statusText);
          handleErrorFile(selectedFile.name);
          setBottomText("Упс, не то...");
          setFileLoadStatus("error");
          return;
        }

        const reader = response.body?.getReader();
        if (!reader) {
          console.error("Не удалось получить поток ответа");
          handleErrorFile(selectedFile.name);
          setBottomText("Упс, не то...");
          setFileLoadStatus("error");
          return;
        }

        const decoder = new TextDecoder();
        let lastSavedResult: StatJSON = initialStats;
        while (true) {
          const { done, value } = await reader.read();

          if (done) {
            try {
              console.log(
                "Обработка завершена: " + lastSavedResult.average_spend_galactic
              );
              const currentDate = getCurrentDate();
              const id = Date.now().toString();
              const newAggregation: Aggregation = {
                id: id,
                fileName: selectedFile.name,
                date: currentDate,
                data: lastSavedResult,
              };
              saveAggregation(newAggregation);
            } catch (error) {
              console.error("Ошибка при парсинге JSON:", error);
              handleErrorFile(selectedFile.name);
              abortController.abort();
              setBottomText("Упс, не то...");
              setFileLoadStatus("error");
            }
            setBottomText("Готово!");
            setFileLoadStatus("success");
            break;
          }
          const chunk = decoder.decode(value);
          const lines = chunk.split("\n");

          for (const line of lines) {
            if (line.trim() === "") continue;
            try {
              const data: StatJSON = JSON.parse(line);
              console.log("Промежуточный результат:", data);
              checkForNullValues(data);
              lastSavedResult = data;
              setParsedJSON(data);
            } catch (error) {
              console.error("Ошибка при парсинге JSON:", error);
              abortController.abort();
              setBottomText("Упс, не то...");
              setFileLoadStatus("error");
            }
          }
        }
      } catch (error) {
        console.error("Ошибка при обработке запроса:", error);
        handleErrorFile(selectedFile.name);
        setBottomText("Упс, не то...");
        setFileLoadStatus("error");
      }
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
      {fileLoadStatus === "default" ? (
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
      {fileLoadStatus === "success" || fileLoadStatus === "loading" ? (
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
