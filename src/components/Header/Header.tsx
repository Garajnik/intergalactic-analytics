import { useNavigate } from "react-router-dom";
import HeaderButton from "../HeaderButton/HeaderButton";
import styles from "./Header.module.css";
import { useHeaderStore, type HeaderStoreProps } from "../../store";

export default function Header() {
  const navigate = useNavigate();
  function handleLogoClick() {
    navigate("/");
  }

  const currentTab = useHeaderStore((state) => state.currentTab);

  const setTab = useHeaderStore((state) => state.setTab);

  const handleChangeTab = (tab: HeaderStoreProps["currentTab"]) => {
    navigate(tab);
    setTab(tab);
  };

  return (
    <div className={styles.container}>
      <img
        className={styles.image}
        src="/Logo+Name.png"
        onClick={handleLogoClick}
        alt="intergalactic-alalyser"
      />
      <div className={styles.buttonsContainer}>
        <HeaderButton
          iconPath="/UploadIcon.png"
          isActive={currentTab === "analyse" ? true : false}
          onClick={() => handleChangeTab("analyse")}
        >
          CSV Аналитик
        </HeaderButton>
        <HeaderButton
          iconPath="/GeneratorIcon.png"
          isActive={currentTab === "generate" ? true : false}
          onClick={() => handleChangeTab("generate")}
        >
          CSV Генератор
        </HeaderButton>
        <HeaderButton
          iconPath="/HistoryIcon.png"
          isActive={currentTab === "history" ? true : false}
          onClick={() => handleChangeTab("history")}
        >
          История
        </HeaderButton>
      </div>
    </div>
  );
}
