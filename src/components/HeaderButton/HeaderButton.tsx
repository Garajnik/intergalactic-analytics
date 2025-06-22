import styles from "./HeaderButton.module.css";
import type { HeaderButtonProps } from "./HeaderButton.types";

export default function HeaderButton({
  onClick,
  iconPath,
  isActive,
  children,
}: HeaderButtonProps) {
  return (
    <div
      onClick={onClick}
      className={isActive ? styles.activeLink : styles.link}
    >
      <img className={styles.icon} src={iconPath} alt="icon" />
      <a>{children}</a>
    </div>
  );
}
