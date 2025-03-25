"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import RangkumanPDF from "@/components/rangkumanreportpdf";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

const data = [
  { title: "Deliver to Retur", key: "DR", color: "bg-green-500" },
  { title: "IDM To Stock Keper", key: "PS", color: "bg-blue-500" },
  { title: "Retur To Gudang", key: "RG", color: "bg-yellow-500" },
  { title: "Gudang To Bengkel", key: "GB", color: "bg-teal-500" },
  { title: "Bengkel To Gudang", key: "BG", color: "bg-red-500" },
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
    const count = tableData.filter((row) => row.hsi_jenis === item.key).length;
    return { ...item, value: count };
  });
};

interface TableRow {
  sigr_kodeigr: string;
  hsi_nobsts: string;
  hsi_nodspb: string;
  hsi_jenis: string;
  hsi_kodesarana: string;
  hsi_nomorseri: string;
  hsi_sender: string;
  hsi_receiver: string;
  hsi_cetakdt: string;
}

const LaporanLokasiLayout = () => {
  const [search, setSearch] = useState("");
  const [selectedConnection, setSelectedConnection] = useState("Pilih Koneksi");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [connections, setConnections] = useState<string[]>([]);
  const [tableDataRangkuman, setTableData] = useState<TableRow[]>([]);
  const [kodeCabang, setKodeCabang] = useState<string>("");
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
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/proxy", { method: "POST" });
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const branchNodes = xmlDoc.getElementsByTagName("BRANCH");
        const branchList = Array.from(branchNodes).map((node) => {
          const kodeCabang =
            node
              .getElementsByTagName("CAB_KODECABANG")[0]
              ?.textContent?.trim() || "";
          const namaCabang =
            node
              .getElementsByTagName("CAB_NAMACABANG")[0]
              ?.textContent?.trim() || "";

          return `${kodeCabang} - ${namaCabang}`;
        });

        setConnections(branchList);
        setSelectedConnection(branchList[0] || "Pilih Koneksi");
      } catch (error) {
        console.error("Gagal mengambil data cabang:", error);
      }
    };

    fetchBranches();
  }, []);

  useEffect(() => {
    if (!kodeCabang) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null); // Reset error sebelum request

      try {
        const response = await fetch(`${BASE_URL}/rangkumanbsts`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ p_kodeigr: kodeCabang }),
        });

        if (!response.ok)
          throw new Error(`HTTP error! Status: ${response.status}`);

        const result = await response.json();

        if (Array.isArray(result.data)) {
          setTableData(result.data);
        } else {
          throw new Error("Format data API tidak sesuai");
        }
      } catch (error) {
        setError(
          error instanceof Error
            ? error.message
            : "Terjadi kesalahan tidak diketahui"
        );
        setTableData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [kodeCabang]);

  const filteredData = tableDataRangkuman.filter((row) =>
    row.hsi_jenis?.toLowerCase().includes(search.toLowerCase())
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

          <div className="relative w-60">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex justify-between items-center w-full border py-2 px-4 text-sm rounded-lg bg-white shadow-sm hover:bg-gray-50 transition focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              {selectedConnection}
              <ChevronDown size={16} className="text-gray-500" />
            </button>
            {isDropdownOpen && (
              <ul className="absolute left-0 mt-2 w-full bg-white border rounded-lg shadow-lg z-10 text-sm overflow-hidden">
                {connections.length > 0 ? (
                  connections.map((conn, index) => {
                    const kode = conn.split(" - ")[0];
                    return (
                      <li
                        key={index}
                        onClick={() => {
                          setSelectedConnection(conn);
                          setKodeCabang(kode);
                          setIsDropdownOpen(false);
                        }}
                        className="px-4 py-2 hover:bg-indigo-600 hover:text-white cursor-pointer transition"
                      >
                        {conn}
                      </li>
                    );
                  })
                ) : (
                  <li className="px-4 py-2 text-gray-500">Memuat...</li>
                )}
              </ul>
            )}
          </div>
        </div>

        <h2 className="text-lg font-semibold text-gray-800 mb-4">
          Rangkuman BSTS
        </h2>

        <div style={{ position: "absolute", left: "-9999px" }}>
          <RangkumanPDF ref={rangkumanRef} tableDataRangkuman={filteredData} />
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
                  <th className="p-4 text-left">No BSTS</th>
                  <th className="p-4 text-left">No DSPB</th>
                  <th className="p-4 text-left">Jenis</th>
                  <th className="p-4 text-left">Kode Sarana</th>
                  <th className="p-4 text-left">Nomor Seri</th>
                  <th className="p-4 text-left">Pengirim</th>
                  <th className="p-4 text-left">Penerima</th>
                  <th className="p-4 text-left">Tanggal Cetak BSTS</th>
                </tr>
              </thead>
              <tbody>
                {currentData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="p-4 text-gray-800">{row.hsi_nobsts}</td>
                    <td className="p-4 text-gray-800">{row.hsi_nodspb}</td>
                    <td className="p-4 text-gray-800">{row.hsi_jenis}</td>
                    <td className="p-4 text-gray-800">{row.hsi_kodesarana}</td>
                    <td className="p-4 text-gray-800">{row.hsi_nomorseri}</td>
                    <td className="p-4 text-gray-800">{row.hsi_sender}</td>
                    <td className="p-4 text-gray-800">{row.hsi_receiver}</td>
                    <td className="p-4 text-gray-800">{row.hsi_cetakdt}</td>
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
