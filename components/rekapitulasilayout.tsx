"use client";
import ReportPDF from "@/components/rekapitulasireportpdf";
import React, {
  useRef,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { useReactToPrint } from "react-to-print";
// import dayjs from "dayjs";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;
import { useDebouncedCallback } from "use-debounce";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
dayjs.extend(customParseFormat);

interface TableRow {
  create_dt: string;
  keterangan: string;
  kode_igr: string;
  no_bsts: string;
  nomor_seri: string;
  status: string;
  tgl_bsts: string;
  tipe_sarana: string;
}

const RekapitulasiLayout = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: "Rekapitulasi Sarana",
    onPrintError: (errorLocation, error) => {
      console.error(`Print error at ${errorLocation}:`, error);
    },
  });

  const fetchData = useDebouncedCallback(
    useCallback(async () => {
      if (!startDate || !endDate) return;
      setLoading(true);
      setError(null);

      try {
        const response = await fetch(`${BASE_URL}/saranatidakditerima`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            p_kodeigr: "44",
            st_date: startDate,
            end_date: endDate,
          }),
        });

        console.log("📥 Response Status:", response.status);

        // Pastikan response hanya dibaca sekali
        const responseClone = response.clone(); // Clone untuk debugging
        const responseText = await responseClone.text();
        console.log("📜 Raw Response Body:", responseText);

        if (!response.ok) {
          throw new Error(
            `HTTP error! Status: ${response.status}, Response: ${responseText}`
          );
        }

        const result = await response.json();
        if (Array.isArray(result.data)) {
          setData(result.data);
        } else {
          throw new Error("Format data API tidak sesuai");
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan tidak diketahui"
        );
      } finally {
        setLoading(false);
      }
    }, [startDate, endDate]),
    500
  );

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate, fetchData]);

  // const filteredData = useMemo(() => {
  //   if (!startDate || !endDate) return [];
  //   return data.filter(
  //     (row) => row.tgl_bsts >= startDate && row.tgl_bsts <= endDate
  //   );
  // }, [data, startDate, endDate]);

  const filteredData = useMemo(() => {
    if (!startDate || !endDate) return [];

    return data.filter((row) => {
      const formattedDate = dayjs(row.tgl_bsts, "DD-MM-YYYY").format(
        "YYYY-MM-DD"
      );
      return formattedDate >= startDate && formattedDate <= endDate;
    });
  }, [data, startDate, endDate]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          Rekapitulasi Sarana IDM
        </h1>
        <p className="text-gray-600 text-lg">PT. INTI CAKRAWALA CITRA</p>
      </div>

      {/* Filter & Cetak */}
      <div className="flex flex-col md:flex-row md:items-start justify-end gap-4 mb-6">
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="date"
            value={startDate || ""}
            onChange={(e) => setStartDate(e.target.value || null)}
            className="px-4 py-2 border rounded-md text-lg"
          />
          <input
            type="date"
            value={endDate || ""}
            onChange={(e) => setEndDate(e.target.value || null)}
            className="px-4 py-2 border rounded-md text-lg"
          />

          <button
            onClick={() => handlePrint()}
            disabled={!startDate || !endDate}
            className={`px-5 py-3 font-semibold rounded-md text-lg transition ${
              startDate && endDate
                ? "bg-blue-600 text-white hover:bg-blue-700"
                : "bg-gray-400 text-gray-200 cursor-not-allowed"
            }`}
          >
            Cetak Laporan
          </button>
        </div>
      </div>

      {/* Tempat laporan untuk dicetak */}
      <div style={{ position: "absolute", left: "-9999px" }}>
        <ReportPDF
          ref={reportRef}
          tableData={filteredData}
          startDate={startDate}
          endDate={endDate}
        />
      </div>

      {/* Tabel Data */}
      <div className="overflow-x-auto border rounded-lg shadow-md">
        {loading ? (
          <p className="text-center text-lg text-gray-700 py-6">
            Memuat data...
          </p>
        ) : error ? (
          <p className="text-center text-lg text-red-500 py-6">{error}</p>
        ) : (
          <table className="w-full border-collapse text-base text-center">
            <thead className="bg-gray-200 text-gray-800 text-lg">
              <tr>
                <th rowSpan={2} className="border px-6 py-3">
                  No.
                </th>
                <th colSpan={2} className="border px-6 py-3">
                  BSTS
                </th>
                <th colSpan={3} className="border px-6 py-3">
                  ID Sarana Idm. Tidak Diterima
                </th>
                <th rowSpan={2} className="border px-6 py-3">
                  Keterangan
                </th>
                <th rowSpan={2} className="border px-6 py-3">
                  Status
                </th>
              </tr>
              <tr className="bg-gray-200 text-gray-800">
                <th className="border px-6 py-3">No.</th>
                <th className="border px-6 py-3">Tanggal</th>
                <th className="border px-6 py-3">Kode Toko</th>
                <th className="border px-6 py-3">Kode - Tipe</th>
                <th className="border px-6 py-3">Nomor Seri</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b transition hover:bg-gray-100 text-lg"
                  >
                    <td className="border px-6 py-3">{index + 1}</td>
                    <td className="border px-6 py-3">{row.no_bsts}</td>
                    <td className="border px-6 py-3">{row.tgl_bsts}</td>
                    <td className="border px-6 py-3">{row.kode_igr}</td>
                    <td className="border px-6 py-3">{row.tipe_sarana}</td>
                    <td className="border px-6 py-3">{row.nomor_seri}</td>
                    <td className="border px-6 py-3">{row.keterangan}</td>
                    <td className="border px-6 py-3">{row.status}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="border px-6 py-3 text-gray-500 text-center text-lg"
                  >
                    Silahkan Pilih Tanggal
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default RekapitulasiLayout;
