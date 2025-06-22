import type { FileUploadButtonProps } from "./FileUploadButton.type";
import styles from "./FileUploadButton.module.css";

export default function FileUploadButton({
  buttonText,
  fileInputRef,
  handleDiscardFile,
  handleFileSelect,
  selectedFile,
  status,
}: FileUploadButtonProps) {
  return (
    <div className={styles.uploadButtonContainer}>
      {status === "loading" ? (
        <div
          className={`${styles.uploadButton} ${styles.uploaded} ${styles.loaderContainer}`}
        >
          <span className={styles.loader} />
        </div>
      ) : (
        <>
          <label
            className={`${styles.uploadButton} ${
              selectedFile ? styles.uploaded : ""
            } ${status === "success" ? styles.success : ""}
                ${status === "error" ? styles.error : ""}
                `}
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
          {(selectedFile || status === "error" || status === "success") && (
            <button className={styles.discardFile} onClick={handleDiscardFile}>
              <img src="/cross.png" alt="cross" />
            </button>
          )}
        </>
      )}
    </div>
  );
}
