import type { ButtonProps } from "./Button.type";
import styles from "./Button.module.css";

export default function Button({ children, disabled, type }: ButtonProps) {
  return (
    <button
      className={`${styles.button} ${styles[`button--${type}`]} ${
        disabled ? styles.disabled : ""
      }`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
