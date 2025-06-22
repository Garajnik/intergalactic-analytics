import styles from "./HistoryBar.module.css";
import type { HistoryBarProps } from "./HistoryBar.type";

export default function HistoryBar({
  fileName,
  date,
  isProcessed,
}: HistoryBarProps) {
  return (
    <div className={styles.container}>
      <div
        className={`${styles.historyBarContainer} ${
          !isProcessed ? styles.historyBarDisabled : ""
        }`}
      >
        <div className={styles.fileName}>
          <img src="/FileIcon.png" alt="fileIcon" />
          <span>{`${fileName}`}</span>
        </div>
        <span>{`${date}`}</span>
        <div
          className={`${styles.statusEnabled} ${
            !isProcessed ? styles.statusDisabled : ""
          }`}
        >
          <span>Обработан успешно</span>
          <img src="/SmileFace.png" alt="smileyFace" />
        </div>
        <div
          className={`${styles.statusEnabled} ${
            isProcessed ? styles.statusDisabled : ""
          }`}
        >
          <span>Не удалось обработать</span>
          <img src="/SadFace.png" alt="sadFace" />
        </div>
      </div>
      <button className={styles.deleteIcon}>
        <img src="/TrashIcon.png" alt="trashCan" />
      </button>
    </div>
  );
}
