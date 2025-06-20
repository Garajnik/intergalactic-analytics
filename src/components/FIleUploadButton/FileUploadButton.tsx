import type { FileUploadButtonProps } from "./FileUploadButton.type";
import styles from "./FileUploadButton.module.css";

export default function FileUploadButton({
  buttonText,
  fileInputRef,
  handleDiscardFile,
  handleFileSelect,
  selectedFile,
  loading,
}: FileUploadButtonProps) {
  return (
    <div className={styles.uploadButtonContainer}>
      {loading ? (
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
        </>
      )}
    </div>
  );
}
