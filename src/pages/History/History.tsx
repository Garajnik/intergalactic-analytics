import { useNavigate } from "react-router-dom";
import Button from "../../components/Button/Button";
import HistoryBar from "../../components/HistoryBar/HistoryBar";
import styles from "./History.module.css";
import { useEffect, useState } from "react";
import type { Aggregation } from "../../components/FileLoader/FileLoader.type";
import StatsModal from "../../components/StatsModal/StatsModal";
import Statistics from "../../components/Statistics/Statistics";
import type { StatJSON } from "../../components/Statistics/Statistics.type";

export default function History() {
  const [modalOpen, setModalOpen] = useState(false);
  const initialStats: StatJSON = {
    total_spend_galactic: 0,
    rows_affected: 0,
    less_spent_at: 0,
    big_spent_at: 0,
    less_spent_value: 0,
    big_spent_value: 0,
    average_spend_galactic: 0,
    big_spent_civ: "",
    less_spent_civ: "",
  };
  const [currentData, setCurrentData] = useState<StatJSON>(initialStats);

  const [number, setNumber] = useState(1);

  const navigate = useNavigate();

  useEffect(() => {
    displayHistory();
  }, []);

  const displayHistory = () => {
    const storedAggregations = localStorage.getItem("aggregations");
    if (storedAggregations) {
      const aggregations: Aggregation[] = JSON.parse(storedAggregations);
      console.log(aggregations);
      return aggregations;
    } else {
      console.log("No saved aggregations");
      return [];
    }
  };

  const clearHistory = () => {
    if (confirm("Вы уверены, что хотите очистить всю историю?")) {
      localStorage.clear();
      displayHistory();
      setNumber(number + 1);
    }
  };

  const deleteAggregation = (id: string) => {
    let aggregations: Aggregation[] = [];
    const storedAggregations = localStorage.getItem("aggregations");
    if (storedAggregations) {
      aggregations = JSON.parse(storedAggregations);
    }
    const updatedAggregations = aggregations.filter((agg) => agg.id !== id);
    localStorage.setItem("aggregations", JSON.stringify(updatedAggregations));
    displayHistory();
    setNumber(number + 1);
  };

  const openModal = (data: StatJSON) => {
    setModalOpen(true);
    setCurrentData(data);
  };

  return (
    <div className={styles.historyContainer}>
      {displayHistory().map((i, index) => (
        <HistoryBar
          deleteFunc={() => deleteAggregation(i.id)}
          key={`${i}-${index}`}
          fileName={i.fileName}
          date={i.date}
          isProcessed={i.error ? false : true}
          openModalFunc={() => openModal(i.data)}
        ></HistoryBar>
      ))}
      <div>
        <Button
          handleClick={() => {
            navigate("/generate");
          }}
          type="send"
        >
          Сгенерировать больше
        </Button>
        <Button handleClick={clearHistory} type="clear">
          Очистить всё
        </Button>
        <StatsModal isOpen={modalOpen} onClose={() => setModalOpen(false)}>
          <Statistics isModal json={currentData}></Statistics>
        </StatsModal>
      </div>
    </div>
  );
}
