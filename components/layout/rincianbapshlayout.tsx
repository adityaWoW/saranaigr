"use client";
import ReportPDF from "@/components/pdf/rincianreportpdf";
import React, { useRef, useState, useEffect, useCallback } from "react";
import { useReactToPrint } from "react-to-print";
// import dayjs from "dayjs";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
import { useDebouncedCallback } from "use-debounce";

interface TableRow {
  no_bapsh: string;
  tgl_bapsh: string;
  no_bsts: string;
  tgl_bsts: string;
  keterangan: string;
  nik_pengirim: string;
  nama_pengirim: string;
  nik_penerima: string;
  nama_penerima: string;
  tipe_sarana: string;
  qty_hilang: number;
}

const RincianLayout = () => {
  const [startDate, setStartDate] = useState<string>("");
  const [endDate, setEndDate] = useState<string>("");
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const reportRef = useRef<HTMLDivElement>(null);

  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: "Rincian BAPSH",
    onPrintError: (errorLocation, error) => {
      console.error(`Print error at ${errorLocation}:`, error);
    },
  });

  const fetchData = useDebouncedCallback(
    useCallback(async () => {
      if (typeof window === "undefined") return;
      const kodeigr = localStorage.getItem("p_kodeigr");
      if (!startDate || !endDate || !kodeigr) return; // ✅ pastikan kodeigr sudah ada
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}/rincianbapsh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            p_kodeigr: kodeigr,
            st_date: startDate,
            end_date: endDate,
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
        setData([]);
      } finally {
        setLoading(false);
      }
    }, [startDate, endDate]),
    500,
  );

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate, fetchData]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 px-10 py-10 space-y-10">
      {/* Header / Hero */}
      <div className="rounded-3xl bg-gradient-to-r from-indigo-600 via-blue-600 to-sky-500 text-white p-10 shadow-2xl text-center">
        <h1 className="text-4xl font-bold tracking-tight">
          Rincian BA - Pembebanan Sarana Hilang
        </h1>
        <p className="mt-3 text-blue-100 text-lg">PT. INTI CAKRAWALA CITRA</p>
      </div>

      {/* Filter Section */}
      <div className="bg-white rounded-3xl shadow-xl p-8 flex flex-col lg:flex-row gap-6 items-end justify-between">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              📅 Tanggal Mulai
            </label>
            <input
              type="date"
              value={startDate || ""}
              onChange={(e) => setStartDate(e.target.value)}
              className="px-5 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition w-60"
            />
          </div>

          <div className="flex flex-col gap-1">
            <label className="text-sm font-semibold text-gray-700">
              📅 Tanggal Akhir
            </label>
            <input
              type="date"
              value={endDate || ""}
              onChange={(e) => setEndDate(e.target.value)}
              className="px-5 py-3 rounded-xl border focus:ring-2 focus:ring-indigo-500 outline-none transition w-60"
            />
          </div>
        </div>

        <button
          onClick={() => handlePrint()}
          disabled={!startDate || !endDate}
          className={`rounded-xl px-6 py-3 font-semibold shadow-md transition ${
            startDate && endDate
              ? "bg-indigo-600 hover:bg-indigo-700 text-white"
              : "bg-gray-300 text-gray-500 cursor-not-allowed"
          }`}
        >
          🖨️ Cetak Laporan
        </button>
      </div>

      {/* Tempat laporan untuk dicetak */}
      <div style={{ position: "absolute", left: "-9999px" }}>
        <ReportPDF
          ref={reportRef}
          tableData={data}
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      {/* Table Card */}
      <div className="bg-white rounded-3xl shadow-2xl overflow-hidden">
        {/* Table Header */}
        <div className="px-8 py-6 border-b bg-slate-50 flex justify-between items-center">
          <h2 className="text-xl font-bold text-slate-700 flex items-center gap-2">
            📋 Data Rincian BA Sarana Hilang
          </h2>
          {loading && (
            <span className="text-sm text-indigo-500 animate-pulse">
              Memuat data...
            </span>
          )}
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
                  <th rowSpan={2} className="px-6 py-4 text-left">
                    No
                  </th>
                  <th colSpan={2} className="px-6 py-4 text-center">
                    BAPSH
                  </th>
                  <th colSpan={3} className="px-6 py-4 text-center">
                    BSTS
                  </th>
                  <th rowSpan={2} className="px-6 py-4 text-center">
                    Tipe Sarana IDM
                  </th>
                  <th rowSpan={2} className="px-6 py-4 text-center">
                    Qty Hilang (pcs)
                  </th>
                </tr>
                <tr className="bg-indigo-100 text-indigo-800">
                  <th className="px-6 py-3">No</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Nomor</th>
                  <th className="px-6 py-3">Tanggal</th>
                  <th className="px-6 py-3">Keterangan</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((row, index) => (
                    <tr
                      key={index}
                      className="border-b hover:bg-indigo-50 transition"
                    >
                      <td className="px-6 py-4">{index + 1}</td>
                      <td className="px-6 py-4 font-semibold">
                        {row.no_bapsh}
                      </td>
                      <td className="px-6 py-4">{row.tgl_bapsh}</td>
                      <td className="px-6 py-4">{row.no_bsts}</td>
                      <td className="px-6 py-4">{row.tgl_bsts}</td>
                      <td className="px-6 py-4">{row.keterangan}</td>
                      <td className="px-6 py-4">{row.tipe_sarana}</td>
                      <td className="px-6 py-4 font-semibold text-rose-600">
                        {row.qty_hilang}
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td
                      colSpan={8}
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

export default RincianLayout;
