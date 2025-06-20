import { Link } from "react-router-dom";
import styles from "./HeaderButton.module.css";
import type { HeaderButtonProps } from "./HeaderButton.types";

export default function HeaderButton({
  linkPath,
  iconPath,
  isActive,
  children,
}: HeaderButtonProps) {
  return (
    <div className={isActive ? styles.activeLink : styles.link}>
      <img className={styles.icon} src={iconPath} alt="icon" />
      <Link to={linkPath}>{children}</Link>
    </div>
  );
}
