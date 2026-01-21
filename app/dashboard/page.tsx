"use client";
import DashboardLayout from "@/components/layout/dashboardlayout";
import { motion } from "framer-motion";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 lg:p-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="rounded-2xl bg-white dark:bg-zinc-900 shadow-sm border border-gray-100 dark:border-zinc-800 p-8 flex flex-col gap-3"
        >
          <motion.h1
            initial={{ letterSpacing: "0.2em", opacity: 0 }}
            animate={{ letterSpacing: "0em", opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-3xl font-semibold tracking-tight text-gray-900 dark:text-white"
          >
            Selamat Datang 👋
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="text-sm text-gray-500 dark:text-gray-400"
          >
            Monitoring Sarana — pantau, kelola, dan evaluasi sarana secara
            terpusat
          </motion.p>
        </motion.div>
      </div>
    </DashboardLayout>
  );
}
