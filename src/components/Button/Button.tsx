import type { ButtonProps } from "./Button.type";
import styles from "./Button.module.css";

export default function Button({
  children,
  disabled,
  type,
  handleClick,
}: ButtonProps) {
  return (
    <button
      onClick={() => handleClick()}
      className={`${styles.button} ${styles[`button--${type}`]} ${
        disabled ? styles.disabled : ""
      }`}
      disabled={disabled}
    >
      {children}
    </button>
  );
}
