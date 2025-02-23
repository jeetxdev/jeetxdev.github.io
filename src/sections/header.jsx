import useStore from "../hooks/store.js";
import clsx from "clsx";
import { motion } from "motion/react";

export default function Header() {
  const store = useStore();
  const activeTab = store.activeTab;
  const tabs = store.tabs;
  return (
    <motion.nav
      className="sticky inset-0 z-30"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 3 }}
    >
      <ul className="flex gap-6 h-12 items-center justify-center bg-transparent font-medium backdrop-blur-2xl">
        {tabs.map((menu) => (
          <li
            className={clsx(
              "font-medium cursor-pointer px-2 relative capitalize",
            )}
            key={menu}
            onClick={() => store.setActiveTab(menu)}
          >
            {menu}
            {menu === activeTab ? (
              <motion.div
                className="absolute left-0 right-0 h-1 bg-cyan-500 rounded-lg"
                layoutId="underline"
                id="underline"
              />
            ) : null}
          </li>
        ))}
      </ul>
    </motion.nav>
  );
}
