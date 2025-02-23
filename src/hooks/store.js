import { create } from "zustand";

const tabList = ["home", "tools", "experience", "resume"];

const useStore = create((set) => ({
  tabs: tabList,
  activeTab: tabList[0],
  setActiveTab: (tab) =>
    set((state) => {
      window.location.hash = tab;
      return { ...state, activeTab: tab };
    }),
}));

export default useStore;
