"use client";
import ReportPDF from "@/components/bapshpdf";
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
import { Button } from "./ui/button";

interface TableRow {
  create_dt: string;
  no_bapsh: string;
  tgl_bapsh: string;
}

interface Bapsh {
  kode_sarana: string;
  nik_pengirim: string;
  nama_pengirim: string;
  nik_penerima: string;
  nama_penerima: string;
  no_bapsh: string;
  no_bsts: string;
  tgl_bsts: string;
  nomor_seri: string;
  rph_sarana: number;
}

const BapshLayout = () => {
  const [startDate, setStartDate] = useState<string | null>(null);
  const [endDate, setEndDate] = useState<string | null>(null);
  const [data, setData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [bapsh, setBapsh] = useState<Bapsh[]>([]);

  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: "Berita Acara Pembebanan Sarana Idm Hilang",
    pageStyle: `
    @page {
        size: A4 portrait;
      }
    `,
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
        const response = await fetch(`${BASE_URL}/listbapsh`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            p_kodeigr: "44",
            st_date: startDate,
            end_date: endDate,
          }),
        });
        console.log("📥 Response Status:", response.status);

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
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

  const fetchDataByNoBapsh = async (noBapsh: string) => {
    const response = await fetch(`${BASE_URL}/bapsh`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        p_kodeigr: "44",
        no_bapsh: noBapsh,
      }),
    });

    const result = await response.json();
    setBapsh(result.data);
  };

  useEffect(() => {
    if (startDate && endDate) {
      fetchData();
    }
  }, [startDate, endDate, fetchData]);

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="bg-white shadow-lg rounded-lg p-6 mb-6 text-center">
        <h1 className="text-3xl font-bold text-gray-900">
          BA - Pembebanan Sarana Hilang
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
        </div>
      </div>

      {/* Tempat laporan untuk dicetak */}
      <div style={{ position: "absolute", left: "-9999px" }}>
        <ReportPDF ref={reportRef} tableData={bapsh} />
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
                  BAPSH
                </th>
                <th rowSpan={2} className="border px-6 py-3">
                  Action
                </th>
              </tr>
              <tr className="bg-gray-200 text-gray-800">
                <th className="border px-6 py-3">No.</th>
                <th className="border px-6 py-3">Tanggal</th>
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
                    <td className="border px-6 py-3">{row.no_bapsh}</td>
                    <td className="border px-6 py-3">{row.tgl_bapsh}</td>
                    <td className="border px-6 py-3">
                      <Button
                        onClick={async () => {
                          await fetchDataByNoBapsh(row.no_bapsh);
                          handlePrint();
                        }}
                      >
                        Download
                      </Button>
                    </td>
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

export default BapshLayout;
