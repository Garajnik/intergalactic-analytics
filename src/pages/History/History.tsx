import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import HistoryBar from "../../components/HistoryBar/HistoryBar";
import styles from "./History.module.css";

export default function History() {
  const navigate = useNavigate();
  return (
    <div className={styles.historyContainer}>
      <HistoryBar
        fileName="file_result.csv"
        date={"22.02.2024"}
        isProcessed={true}
      ></HistoryBar>
      <div>
        <Button
          handleClick={() => {
            navigate("/generator");
          }}
          type="send"
        >
          Сгенерировать больше
        </Button>
        <Button handleClick={() => {}} type="clear">
          Очистить всё
        </Button>
      </div>
    </div>
  );
}
