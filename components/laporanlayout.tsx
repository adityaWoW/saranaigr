"use client";
import React, { useState, useEffect, useRef } from "react";
import { Search, ChevronDown } from "lucide-react";
import { useReactToPrint } from "react-to-print";
import ReportPDF from "@/components/cetakanreportpdf";

const data = [
  {
    title: "Penyimpanan Sarana",
    key: "PENYIMPANAN SEMENTARA",
    color: "bg-orange-500",
  },
  { title: "Issuing", key: "Issuing", color: "bg-green-500" },
  { title: "Delivery", key: "DELIVERY", color: "bg-blue-500" },
  { title: "Bengkel", key: "BENGKEL", color: "bg-yellow-500" },
  { title: "Intransit", key: "INTRANSIT", color: "bg-teal-500" },
  { title: "Hilang", key: "HILANG", color: "bg-red-500" },
  { title: "IDM", key: "IDM", color: "bg-blue-500" },
  { title: "IGR", key: "IGR", color: "bg-red-500" },
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

const calculateReportData = (
  categories: { key: string }[],
  tableData: TableRow[]
) => {
  return data.map((category) => {
    const count = tableData.filter((row) =>
      [
        "PENYIMPANAN SEMENTARA",
        "Issuing",
        "DELIVERY",
        "BENGKEL",
        "INTRANSIT",
        "HILANG",
      ].includes(category.key)
        ? row.sigr_lokasi_sarana === category.key
        : ["IDM", "IGR"].includes(category.key)
        ? row.sigr_tanggungjawab === category.key
        : false
    ).length;

    return { ...category, value: count };
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

const LaporanLokasiLayout = () => {
  const [search, setSearch] = useState("");
  const [selectedConnection, setSelectedConnection] = useState("Pilih Koneksi");
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [connections, setConnections] = useState<string[]>([]);
  const [tableData, setTableData] = useState<TableRow[]>([]);
  const [kodeCabang, setKodeCabang] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  // untuk setting kirim data ke tempalte cetakan
  const reportRef = useRef<HTMLDivElement>(null);
  const handlePrint = useReactToPrint({
    contentRef: reportRef,
    documentTitle: "Laporan",
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
      setError(null);

      try {
        const response = await fetch(
          "http://172.20.111.6:8090/laporanlokasisarana",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ p_kodeigr: kodeCabang }),
          }
        );

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

  const filteredData = tableData.filter(
    (row) =>
      row?.sigr_lokasi_sarana?.toLowerCase().includes(search.toLowerCase()) ||
      row?.sigr_nomorseri?.toLowerCase().includes(search.toLowerCase())
  );

  // untuk setting page pada tabel
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentData = filteredData.slice(startIndex, endIndex);

  const nextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };
  const prevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };
  const reportData = calculateReportData(data, tableData);
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
          Daftar Sarana
        </h2>

        <div style={{ position: "absolute", left: "-9999px" }}>
          <ReportPDF ref={reportRef} tableData={filteredData} />
        </div>

        {loading ? (
          <p className="text-gray-500 text-center">PILIH CABANG !!</p>
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
                {currentData.map((row, index) => (
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
