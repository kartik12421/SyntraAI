import React from "react";
import { AnimatePresence, motion } from "motion/react";

function Payment({ open, onClose }) {
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed insert-0 bg-black/70 z-40"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25 }}
            className="fixed right-0 top-0 z-50 h-screen w-95 bg-[#0f1117] border-l border-white/10 shadow-2xl flex flex-col"
          ></motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Payment;
