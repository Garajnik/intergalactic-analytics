import FileLoader from "../../components/FileLoader/FileLoader";
import styles from "./Analyst.module.css";

export default function Analyst() {
  return (
    <div className={styles.container}>
      <FileLoader></FileLoader>
    </div>
  );
}
