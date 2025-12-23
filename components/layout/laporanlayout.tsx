"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search} from "lucide-react";
import { useReactToPrint } from "react-to-print";
import ReportPDF from "@/components/pdf/cetakanreportpdf";

import dotenv from "dotenv";
dotenv.config();
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const data = [
  {
    title: "Penyimpanan Sarana",
    key: "sementara",
    color: "bg-orange-500",
  },
  { title: "Issuing", key: "Issuing", color: "bg-green-500" },
  { title: "Delivery", key: "delivery_idm", color: "bg-blue-500" },
  { title: "Bengkel", key: "bengkel", color: "bg-yellow-500" },
  { title: "Intransit", key: "intransit", color: "bg-teal-500" },
  { title: "Hilang", key: "hilang", color: "bg-red-500" },
  { title: "IDM", key: "tanggung_jawab_idm", color: "bg-blue-500" },
  { title: "IGR", key: "tanggung_jawab_igr", color: "bg-red-500" },
];

interface ReportCardProps {
  title: string;
  value: number;
  color: string;
}

const ReportCard: React.FC<ReportCardProps> = ({ title, value, color }) => (
  <div className="flex items-center bg-gray-900 text-white p-5 rounded-lg shadow-lg hover:scale-80 transition-transform w-full">
    <span className={`w-5 h-5 rounded-full ${color} mr-3`}></span>
    <div>
      <p className="text-sm text-gray-400">{title}</p>
      <p className="text-lg font-semibold">{value}</p>
    </div>
  </div>
);

const calculateReportData = (summary: Summary) => {
  return data.map((category) => {
    return { ...category, value: summary[category.key] };
  });
};

interface TableRow {
  sigr_kodeigr: string;
  sigr_jenistoko: string;
  sigr_kodesarana: string;
  sigr_lokasi_sarana: string;
  sigr_nomorbarcode: string;
  sigr_nomorseri: string;
  sigr_tanggungjawab: string;
}

interface Summary {
  [key: string]: number;
}

const LaporanLokasiLayout = () => {
  const [search, setSearch] = useState("");
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [jumlahData, setJumlahData] = useState(0);
  const [summary, setSummary] = useState<Summary>({} as Summary);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);

  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: "Laporan",
    onPrintError: (errorLocation, error) => {
      console.error(`Print error at ${errorLocation}:`, error);
    },
  });
  
  useEffect(() => {
    if (typeof window === "undefined") return;
    const kodeigr = localStorage.getItem("p_kodeigr");
    const fetchData = async () => {
      setLoading(true);
      setError(null);
  
      try {
        const response = await fetch(`${BASE_URL}/laporanlokasisarana`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ p_kodeigr: kodeigr }),
        });
  
        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);
  
        const result = await response.json();
        console.log("HAI", response);
  
        // ✅ Validasi jika status sukses
        if (result.status === "success" && result.data) {
          const { data, summary, jumlah_data } = result.data;
  
          // ✅ pastikan data berupa array
          setTableData(Array.isArray(data) ? data : []);
          setJumlahData(jumlah_data || 0);
          setSummary(Array.isArray(summary) && summary.length > 0 ? summary[0] : {});
        } else {
          // ✅ Jika bukan "success"
          setError(result.message || "Gagal mengambil data");
          setTableData([]);
          setSummary({});
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan tidak diketahui"
        );
        setTableData([]);
        setSummary({});
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, []);

  const filteredData = tableData.filter(
    (row) =>
      row?.sigr_lokasi_sarana?.toLowerCase().includes(search.toLowerCase()) ||
      row?.sigr_nomorseri?.toLowerCase().includes(search.toLowerCase()) ||
      row?.sigr_nomorbarcode.toLowerCase().includes(search.toLowerCase())
  );

  const itemsPerPage = 10;
  const totalPages = Math.ceil(jumlahData / itemsPerPage);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const paginatedData = filteredData.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const reportData = calculateReportData(summary);

  return (
    <div className="w-full sm:pl-60 p-4 md:p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">
        Laporan Lokasi & Sarana
      </h1>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-5 bg-white p-3 rounded-lg shadow-md">
        {reportData.map((item, index) => (
          <ReportCard
            key={index}
            title={item.title}
            value={item.value}
            color={item.color}
          />
        ))}
      </div>

      <div className="mt-8 bg-white p-6 rounded-lg shadow-md overflow-x-auto">
        <div className="flex justify-end items-center gap-4 mb-4">
          <div>
            <button
              onClick={() => handlePrint()}
              className="px-2 py-2 bg-purple-500 text-white rounded-md hover:bg-purple-500"
            >
              Cetak Laporan
            </button>
          </div>

          <div className="relative w-45">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={16}
            />
            <input
              type="text"
              placeholder="Cari data..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="pl-10 pr-3 py-2 w-full text-sm border rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500 shadow-sm transition"
            />
          </div>
        </div>

        <div style={{ position: "absolute", left: "-9999px" }}>
          <ReportPDF ref={reportRef} tableData={filteredData} />
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">Pilih Cabang !!!</p>
        ) : tableData.length === 0 ? (
          <p className="text-gray-500 text-center">
            Tidak ada data yang tersedia
          </p>
        ) : error ? (
          <p className="text-red-500 text-center">{error}</p>
        ) : (
          <div>
            <table className="w-full border-collapse bg-white shadow-md min-w-max">
              <thead className="bg-gray-200 text-gray-700 uppercase text-sm">
                <tr>
                  <th className="p-4 text-left">Cabang</th>
                  <th className="p-4 text-left">Kode / Tipe</th>
                  <th className="p-4 text-left">Kode Toko</th>
                  <th className="p-4 text-left">Nomor Seri</th>
                  <th className="p-4 text-left">Lokasi</th>
                  <th className="p-4 text-left">Nomor Barcode</th>
                  <th className="p-4 text-left">Tanggung Jawab</th>
                </tr>
              </thead>
              <tbody>
                {paginatedData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-4 text-gray-800">{row.sigr_kodeigr}</td>
                    <td className="p-4 text-gray-800">{row.sigr_kodesarana}</td>
                    <td className="p-4 text-gray-800">{row.sigr_jenistoko}</td>
                    <td className="p-4 text-gray-800">{row.sigr_nomorseri}</td>
                    <td className="p-4 text-gray-800">
                      {row.sigr_lokasi_sarana}
                    </td>
                    <td className="p-4 text-gray-800">
                      {row.sigr_nomorbarcode}
                    </td>
                    <td className="p-4 text-gray-800">
                      {row.sigr_tanggungjawab}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="flex justify-center mt-4 space-x-2">
              <button
                onClick={prevPage}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md text-white ${
                  currentPage === 1
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Previous
              </button>
              <span className="px-4 py-2 bg-gray-200 rounded-md">
                {/* {jumlahData} */}
                {currentPage} / {totalPages}
              </span>
              <button
                onClick={nextPage}
                disabled={currentPage === totalPages}
                className={`px-4 py-2 rounded-md text-white ${
                  currentPage === totalPages
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LaporanLokasiLayout;
