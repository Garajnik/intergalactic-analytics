import { create } from "zustand";

export interface HeaderStoreProps {
  currentTab: "analyse" | "generate" | "history";
  setTab: (tab: HeaderStoreProps["currentTab"]) => void;
}

export const useHeaderStore = create<HeaderStoreProps>((set) => ({
  currentTab: "analyse",
  setTab: (tab: HeaderStoreProps["currentTab"]) =>
    set(() => ({
      currentTab: tab,
    })),
}));
