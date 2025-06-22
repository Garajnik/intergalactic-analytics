import StatBar from "../StatBar/StatBar";
import styles from "./Statistics.module.css";
import type { StatisticsProps, StatJSON } from "./Statistics.type";

const descriptions: Record<keyof StatJSON, string> = {
  total_spend_galactic: "Общие расходы в галактических кредитах",
  rows_affected: "Количество обработанных записей",
  less_spent_at: "День года с минимальными расходами",
  big_spent_at: "День года с максимальными расходами",
  less_spent_value: "Минимальная сумма расходов за день",
  big_spent_value: "Максимальная сумма расходов за день",
  average_spend_galactic: "Средние расходы в галактических кредитах",
  big_spent_civ: "Цивилизация с максимальными расходами",
  less_spent_civ: "Цивилизация с минимальными расходами",
};

function formatDayOfYear(day: number): string {
  const date = new Date(2024, 0, day);
  return date.toLocaleString("ru-RU", { day: "numeric", month: "long" });
}

export default function Statistics({ json, isModal }: StatisticsProps) {
  return (
    <div className={`${styles.container} ${isModal ? styles.modal : ""}`}>
      {Object.entries(json).map(([key, value]) => {
        const typedKey = key as keyof StatJSON;
        const description = descriptions[typedKey] || typedKey;
        let displayValue: string;
        if (typedKey === "less_spent_at" || typedKey === "big_spent_at") {
          displayValue = formatDayOfYear(Number(value));
        } else if (typedKey === "average_spend_galactic") {
          displayValue = String(Math.trunc(Number(value)));
        } else {
          displayValue = String(value);
        }
        if (description !== "Минимальная сумма расходов за день") {
          return (
            <StatBar
              key={key}
              description={description}
              result={displayValue}
              inModal={isModal}
            />
          );
        } else {
          return null;
        }
      })}
    </div>
  );
}
