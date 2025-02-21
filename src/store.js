import { create } from "zustand";

const useStore = create((set) => ({
  activeSection: "home",
  updateActiveSection: (section) =>
    set((state) => ({ ...state, activeSection: section })),
}));

export default useStore;
