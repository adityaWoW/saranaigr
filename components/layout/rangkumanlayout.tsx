"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import RangkumanPDF from "@/components/pdf/rangkumanreportpdf";
import { Button } from "../ui/button";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const data = [
  { title: "IDM To Stock Keeper", key: "BSTS-PS", color: "bg-blue-500" },
  { title: "Delivery to Retur", key: "BSTS-DR", color: "bg-green-500" },
  { title: "Retur To Gudang", key: "BSTS-RG", color: "bg-yellow-500" },
  { title: "Gudang To Bengkel", key: "BSTS-GB", color: "bg-teal-500" },
  { title: "Bengkel To Gudang", key: "BSTS-BG", color: "bg-red-500" },
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

const calculateReportData = (tableData: TableRow[]) => {
  return data.map((item) => {
    const count = tableData.filter((row) => row.jenis === item.key).length;
    return { ...item, value: count };
  });
};

interface TableRow {
  no_bsts: string,
  tgl_bsts: string,
  jenis: string,
  jumlah_sarana: string
}

const LaporanLokasiLayout = () => {
  const [search, setSearch] = useState("");
  const [tableDataRangkuman, setTableData] = useState<TableRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  //untuk cetakan report
  const rangkumanRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: rangkumanRef,
    documentTitle: "Rangkuman BSTS",
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
        const response = await fetch(`${BASE_URL}/rangkumanbsts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ p_kodeigr: kodeigr }),
        });
        const result = await response.json();

        // ✅ Cek apakah status = "success" dan result.data adalah array
        if (result.status === "success" && Array.isArray(result.data)) {
          setTableData(result.data);
        } else {
          // Jika status bukan success atau format tidak sesuai
          throw new Error(result.message || "Gagal mengambil data dari server");
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan tidak diketahui",
        );
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const fetchDataByNoBsts = async(noBsts: string) => {
    try {

    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan tidak diketahui",
      );
    }
  }

  const filteredData = tableDataRangkuman.filter(
    (row) =>
      row.jenis?.toLowerCase().includes(search.toLowerCase()) ||
      row.jenis?.toLowerCase().includes(search.toLowerCase()) ||
      row.jenis?.toLowerCase().includes(search.toLowerCase()),
  );

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1);
    }
  };

  const prevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  const reportData = calculateReportData(tableDataRangkuman);

  return (
    <div className="w-full sm:pl-60 p-4 md:p-6 max-w-screen-xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Rangkuman BSTS</h1>

      <div className="flex gap-4 bg-gray-50 p-6 rounded-2xl shadow-lg overflow-x-auto whitespace-nowrap">
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
          {/* <RangkumanPDF ref={rangkumanRef} tableDataRangkuman={filteredData} /> */}
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">PILIH CABANG !!</p>
        ) : tableDataRangkuman.length === 0 ? (
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
                  <th className="p-4 text-center">No BSTS</th>
                  <th className="p-4 text-center">Tgl. BSTS</th>
                  <th className="p-4 text-center">Jenis</th>
                  <th className="p-4 text-center">Jumlah Sarana</th>
                  <th className="p-4 text-center">Action</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-4 text-gray-800 text-center">{row.no_bsts}</td>
                    <td className="p-4 text-gray-800 text-center">{row.tgl_bsts}</td>
                    <td className="p-4 text-gray-800 text-center">{row.jenis}</td>
                    <td className="p-4 text-gray-800 text-center">{row.jumlah_sarana}</td>
                    <td className="p-4 text-gray-800 text-center"><Button onClick={() => console.log(row.no_bsts)}>Download</Button></td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Navigasi Pagination */}
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
