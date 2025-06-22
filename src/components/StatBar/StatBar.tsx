import type { StatBarProps } from "./StatBar.type";
import styles from "./StatBar.module.css";

export default function StatBar({ result, description }: StatBarProps) {
  return (
    <div className={styles.container}>
      <h1>{result}</h1>
      <span>{description}</span>
    </div>
  );
}
