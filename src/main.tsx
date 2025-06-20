import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Analyst from "./pages/Analyst/Analyst";
import Generator from "./pages/Generator/Generator";
import History from "./pages/History/History";
import Header from "./components/Header/Header";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Analyst />} />
        <Route path="generator" element={<Generator />} />
        <Route path="history" element={<History />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
