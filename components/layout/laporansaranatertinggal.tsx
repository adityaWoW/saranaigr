"use client";
import ReportPDF from "@/components/pdf/laporansaranatertinggalpdf";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
import { useDebouncedCallback } from "use-debounce";
import { Button } from "../ui/button";

interface TableRow {
  plk_nokoli: string;
  plk_kodetoko: string;
  jumlah_item: string;
}

interface Sarana {
  plk_kodetoko: string;
  plk_namatoko: string;
  plk_nokoli: string;
  plk_zona: string;
  plk_tgl_tutupkoli: string;
  plk_user_request: string;
  plk_tgl_request: string;
  plk_user_approve: string;
  plk_tgl_approve: string;
}

const Laporansaranatertinggal = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [sarana, setSaranaTertinggal] = useState<Sarana[]>([]);

  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: "Laporan Sarana Tertinggal",
    pageStyle: `
    @page {
        size: A4 portrait;
      }
    `,
    onPrintError: (errorLocation, error) => {
      console.error(`Print error at ${errorLocation}:`, error);
    },
  });

  const fetchLoaddata = useDebouncedCallback(
    useCallback(async () => {
      if (typeof window === "undefined") return;
      const kodeigr = localStorage.getItem("p_kodeigr");
      if (!startDate) return;
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${BASE_URL}/loaddatasaranatertinggal`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            p_kodeigr: kodeigr,
            start_date: startDate,
          }),
        });
        const result = await response.json();
        if (result.status === "success" && Array.isArray(result.data)) {
          setData(result.data);
        } else {
          throw new Error(result.message || "Gagal mengambil data dari server");
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan tidak diketahui",
        );
      } finally {
        setLoading(false);
      }
    }, [startDate]),
    500,
  );

  const fetchprintlaporanAll = async () => {
    if (typeof window === "undefined") return;
    const kode = localStorage.getItem("p_kodeigr");

    try {
      setLoading(true);

      const requests = data.map(() =>
        fetch(`${BASE_URL}/laporansaranatertinggal`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            p_kodeigr: kode,
            start_date: startDate,
          }),
        }).then((res) => res.json()),
      );

      const results = await Promise.all(requests);

      const allResults: Sarana[] = results.flatMap((r) =>
        Array.isArray(r.data) ? r.data : [],
      );

      console.log("CEK RESULT ALL", allResults);
      setSaranaTertinggal(allResults);
    } catch (error) {
      console.error("Gagal mengambil semua data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (startDate) {
      fetchLoaddata();
    }
  }, [startDate, fetchLoaddata]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50 to-blue-50 px-10 py-10 space-y-10">
      {/* Header */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white p-10 shadow-2xl">
        <h1 className="text-4xl font-bold tracking-tight flex items-center gap-3">
          📦 Laporan Sarana Tertinggal
        </h1>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col lg:flex-row gap-6 items-end">
        <div className="flex flex-col gap-2 w-full lg:w-auto">
          <label className="text-sm font-semibold text-gray-700">
            📅 Input Tanggal
          </label>
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value || null)}
            className="px-5 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition w-full lg:w-60"
          />
        </div>
      </div>

      {/* Area cetak tersembunyi */}
      <div style={{ position: "absolute", left: "-9999px" }}>
        <ReportPDF
          ref={reportRef}
          tableData={sarana}
          startDate={startDate}
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Table Header */}
        <div className="px-8 py-6 border-b flex justify-between items-center bg-slate-50">
          <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
            📋 Data Sarana Tertinggal
          </h2>

          <div className="flex items-center gap-4">
            {loading && (
              <span className="text-sm text-indigo-500 animate-pulse font-medium">
                ⏳ Memuat data...
              </span>
            )}

            <Button
              onClick={async () => {
                await fetchprintlaporanAll();
                handlePrint();
              }}
              disabled={loading || !startDate || !data.length}
              className="rounded-xl bg-emerald-600 hover:bg-emerald-700 active:scale-95 transition-all duration-150 text-white px-6 py-3 shadow-lg flex items-center gap-2 justify-center disabled:opacity-50"
            >
              {loading ? "⏳ MEMPROSES..." : "🖨️ CETAK"}
            </Button>
          </div>
        </div>

        {/* Table Content */}
        <div className="overflow-x-auto">
          {error ? (
            <div className="p-12 text-center text-red-500 font-medium">
              {error}
            </div>
          ) : (
            <table className="w-full text-base">
              <thead className="bg-indigo-50 text-indigo-700">
                <tr>
                  <th className="px-8 py-4 text-left font-semibold">No</th>
                  <th className="px-8 py-4 text-left font-semibold">No Koli</th>
                  <th className="px-8 py-4 text-left font-semibold">
                    Kode Toko
                  </th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-16 text-indigo-500 text-lg"
                    >
                      ⏳ Sedang memuat data...
                    </td>
                  </tr>
                ) : data.length > 0 ? (
                  data.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-indigo-50 transition"
                    >
                      <td className="px-8 py-5">{index + 1}</td>
                      <td className="px-8 py-5 font-semibold text-slate-800">
                        {row.plk_nokoli}
                      </td>
                      <td className="px-8 py-5">{row.plk_kodetoko}</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={3}
                      className="text-center py-16 text-gray-400 text-lg"
                    >
                      📅 Silahkan pilih rentang tanggal terlebih dahulu
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
};

export default Laporansaranatertinggal;
