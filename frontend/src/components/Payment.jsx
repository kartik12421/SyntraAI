import React from "react";
import { AnimatePresence, motion } from "motion/react";
import { CrownIcon, X } from "lucide-react";
import { useSelector } from "react-redux";

function Payment({ open, onClose }) {
  const { userData } = useSelector((state) => state.user);
  return (
    <AnimatePresence>
      {open && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="fixed inset-0 bg-black/70 z-40 h-screen"
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ duration: 0.25 }}
            className="fixed right-0 top-0 z-50 h-screen w-95 bg-[#0f1117] border-l border-white/10 shadow-2xl flex flex-col"
          >
            {/* top portion of payment */}
            <div className="flex items-center justify-between p-5 border-b border-white/10">
              <div>
                <div className="text-cyan-300 text-lg font-semibold">
                  Payment
                </div>
                <div className="text-purple-300 text-sm">Plans & Credits</div>
              </div>
              {/* cross button */}
              <button
                onClick={onClose}
                className="w-9 h-9 rounded-lg bg-white/5 hover:bg-white/10 flex items-center justify-center"
              >
                <X size={20} className="text-slate-400" />
              </button>
            </div>
            {/* plans and credits */}
            <div className="p-5">
              <div className="rounded-xl bg-white/4 border border-white/10 p-4">
                {/* plan */}
                <div className="flex justify-between items-center">
                  <div>
                    <p className="text-cyan-500 text-xl font-semibold">
                      Current Plan
                    </p>
                    <h3 className="text-purple-400 text-xl">
                      {userData?.plan || "free"}
                    </h3>
                  </div>
                  <CrownIcon className="text-yellow-400" />
                </div>

                {/* credits */}
                <div className="mt-5">
                  <div className="flex justify-between text-sm text-slate-400 mb-2">
                    <span>Credits</span>
                    <span>
                      {userData.credits || 0} / {userData.totalCredits || 100}
                    </span>
                  </div>

                  {/* progress bar */}
                  <div className="h-2 rounded-full bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-indigo-500 transition-all duration-500"
                      style={{
                        width: `${
                          ((userData?.credits || 0) /
                            (userData?.totalCredits || 1)) *
                          100
                        }%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Payment;
