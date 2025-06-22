import ReactDOM from "react-dom";
import styles from "./StatsModal.module.css";
import type { StatsModalProps } from "./StatsModal.type";
import { useEffect } from "react";

const modalRoot = document.getElementById("modal-root")!;

export default function StatsModal({
  isOpen,
  onClose,
  children,
}: StatsModalProps) {
  useEffect(() => {
    if (isOpen) document.body.style.overflow = "hidden";
    else document.body.style.overflow = "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const modalContent = (
    <div className={styles.overlay} onClick={onClose}>
      <div className={styles.modal} onClick={(e) => e.stopPropagation()}>
        <button className={styles.closeBtn} onClick={onClose}>
          <img src="/cross.png" alt="cross" />
        </button>
        <div className={styles.body}>{children}</div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
}
