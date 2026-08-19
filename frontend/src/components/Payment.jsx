import React from "react";
import { AnimatePresence, color, motion } from "motion/react";
import { CrownIcon, Currency, Key, X } from "lucide-react";
import { useSelector } from "react-redux";
import { createPayment } from "../../features/createPayment.js";
import { verifyPayment } from "../../features/verifyPayment.js";

function Payment({ open, onClose }) {
  const { userData } = useSelector((state) => state.user);

  const handleLevelUp = async (plan) => {
    try {
      const data = await createPayment(plan);
      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: data?.order?.amount,
        currency: data?.order?.currency,
        name: "SyntraAI",
        description: `${data?.plan?.name} Plan`,
        order_id: data?.order.id,
        handler: async (res) => {
          try {
            const data = verifyPayment(res);
          } catch (err) {
            console.log("Payment verification failed:", err);
          }
        },
        theme: {
          color: "#00d9ff",
        },
      };
      const razorPay = new window.Razorpay(options);
      razorPay.open();
    } catch (error) {
      console.log(error);
    }
  };
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
            {/* plans */}
            <div className="px-5 flex-1 overflow-auto space-y-4">
              <div className="rounded-xl border border-white/10 p-4">
                <h3 className="text-white font-semibold">Starter</h3>
                <p className="text-cyan-300 text-2xl font-bold mt-2">₹199/-</p>
                <p className="text-slate-400 text-sm mt-1">500 Credits</p>
                <button
                  onClick={() => handleLevelUp("standard")}
                  className="mt-4 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 py-2 text-white"
                >
                  Level Up
                </button>
              </div>
            </div>

            <div className="px-5 flex-1 overflow-auto space-y-4">
              <div className="rounded-xl border border-white/10 p-4">
                <h3 className="text-white font-semibold">Pro</h3>
                <p className="text-cyan-300 text-2xl font-bold mt-2">₹599/-</p>
                <p className="text-slate-400 text-sm mt-1">1000 Credits</p>
                <button
                  onClick={() => handleLevelUp("pro")}
                  className="mt-4 w-full rounded-lg bg-indigo-600 hover:bg-indigo-700 py-2 text-white"
                >
                  Level Up
                </button>
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}

export default Payment;
