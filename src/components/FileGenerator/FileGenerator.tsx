import { useRef, useState } from "react";
import styles from "./FileGenerator.module.css";
import Button from "../Button/Button";
import FileUploadButton from "../FIleUploadButton/FileUploadButton";
import type { FileUploadButtonProps } from "../FIleUploadButton/FileUploadButton.type";

export default function FileLoader() {
  const [buttonText, setButtonText] = useState<string>("");
  const [bottomText, setBottomText] = useState<string>("");
  const [fileGenerateStatus, setFileGenerateStatus] =
    useState<FileUploadButtonProps["status"]>("default");
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const selectedFile: File | null = null;

  const handleStartGeneration = async () => {
    setIsGenerating(true);
    setFileGenerateStatus("loading");
    setBottomText("Идёт процесс генерации файла");

    try {
      const response = await fetch("http://localhost:3000/report?size=0.1");
      if (!response.ok) {
        throw new Error("Ошибка сети или сервера");
      }

      const blob = await response.blob();

      const url = window.URL.createObjectURL(blob);

      const a = document.createElement("a");
      a.href = url;
      a.download = "report.csv";
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);

      setFileGenerateStatus("success");
      setBottomText("Файл успешно сгенерирован и скачан");
      setButtonText("Done!");
    } catch (error) {
      setFileGenerateStatus("error");
      setBottomText("Упс, не то...");
      setButtonText("Ошибка");
      console.error("Ошибка при генерации файла:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleDiscardFile = () => {
    setIsGenerating(false);
    setFileGenerateStatus("default");
    setBottomText("");
  };

  return (
    <div className={styles.container}>
      <p className={styles.texttop}>
        Сгенерируйте готовый csv-файл нажатием одной кнопки
      </p>
      <div className={`${styles.dndbg} `}>
        {(isGenerating ||
          fileGenerateStatus === "success" ||
          fileGenerateStatus === "error") && (
          <FileUploadButton
            status={fileGenerateStatus}
            buttonText={buttonText}
            fileInputRef={fileInputRef}
            handleDiscardFile={handleDiscardFile}
            selectedFile={selectedFile}
          />
        )}

        {!isGenerating &&
          fileGenerateStatus !== "success" &&
          fileGenerateStatus !== "error" && (
            <Button handleClick={handleStartGeneration} type="send">
              Начать генерацию
            </Button>
          )}
        <span
          className={`${styles.fileUploadStatusText} ${
            fileGenerateStatus === "error" ? styles.fileUploadStatusError : ""
          }`}
        >
          {bottomText}
        </span>
      </div>
    </div>
  );
}
