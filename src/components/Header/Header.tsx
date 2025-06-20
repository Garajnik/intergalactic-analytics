import { useNavigate } from "react-router-dom";
import HeaderButton from "../HeaderButton/HeaderButton";
import styles from "./Header.module.css";

export default function Header() {
  let navigate = useNavigate();
  function handleLogoClick() {
    navigate("/");
  }

  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src="/Logo+Name.png"
        onClick={handleLogoClick}
        alt="intergalactic-alalyser"
      />
      <div className={styles.buttonsContainer}>
        <HeaderButton iconPath="/UploadIcon.png" isActive={false} linkPath="/">
          CSV Аналитик
        </HeaderButton>
        <HeaderButton
          iconPath="/GeneratorIcon.png"
          isActive={false}
          linkPath="/generator"
        >
          CSV Генератор
        </HeaderButton>
        <HeaderButton
          iconPath="/HistoryIcon.png"
          isActive={false}
          linkPath="/history"
        >
          История
        </HeaderButton>
      </div>
    </div>
  );
}
