import React, { forwardRef } from "react";
import { useSession } from "next-auth/react";

type TableRow = {
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
};

interface ReportPDFProps {
  startDate: string;
  endDate: string;
  tableData: TableRow[];
}

const ReportPDF = forwardRef<HTMLDivElement, ReportPDFProps>(
  ({ tableData, startDate, endDate }, ref) => {
    const { data: session } = useSession();
    return (
      <div
        ref={ref}
        className="w-full p-4 md:p-6 max-w-screen-lg mx-auto print:p-2 print:max-w-full"
      >
        {/* CSS untuk Print */}
        <style>
          {`
            @media print {
              body {
                -webkit-print-color-adjust: exact;
                print-color-adjust: exact;
              }
              .no-print {
                display: none !important;
              }
              .print-header {
                text-align: center;
                font-size: 14px;
                font-weight: bold;
              }
              table {
                width: 100%;
                border-collapse: collapse;
                font-size: 12px;
              }
              th, td {
                border: 1px solid black;
                padding: 6px;
                text-align: center;
              }
              thead {
                background-color: #ddd;
              }
              .avoid-break {
                page-break-inside: avoid;
              }
            }
          `}
        </style>

        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm font-bold">PT. INTI CAKRAWALA CITRA</p>
            <p className="text-xs">Kode/Nama Toko Igr.</p>
          </div>
          <div className="text-xs text-right border border-white p-2 w-50">
            <p>Tgl. Cetak : {new Date().toLocaleDateString("id-ID")}</p>
            <p>PIC Cetak : {session?.user?.name || "Tidak tersedia"}</p>
            <p>User ID : {session?.user?.name || "Tidak tersedia"}</p>
            <p>Hal : </p>
          </div>
        </div>

        {/* Judul */}
        <div className="text-center print-header mb-4">
          <h1>Rincian Berita Acara Pembebanan Sarana Idm. Hilang</h1>
          <p>
            <span className="font-semibold">Periode :</span> {startDate} s/d{" "}
            {endDate}
          </p>
        </div>

        {/* Tabel Data */}
        <div className="overflow-x-auto avoid-break">
          <table className="w-full border border-collapse border-black text-sm text-center">
            <thead>
              <tr className="bg-gray-300 font-bold">
                <th rowSpan={2} className="border border-black px-2 py-1">
                  No.
                </th>
                <th colSpan={2} className="border border-black px-2 py-1">
                  BAPSH
                </th>
                <th colSpan={3} className="border border-black px-2 py-1">
                  BSTS
                </th>
                <th colSpan={2} className="border border-black px-2 py-1">
                  Pengirim
                </th>
                <th colSpan={2} className="border border-black px-2 py-1">
                  Penerima
                </th>
                <th rowSpan={2} className="border border-black px-2 py-1">
                  Tipe Sarana Idm.
                </th>
                <th rowSpan={2} className="border border-black px-2 py-1">
                  Qty. Hilang (pcs.)
                </th>
              </tr>
              <tr className="bg-gray-300 font-bold">
                <th className="border border-black px-2 py-1">Nomor</th>
                <th className="border border-black px-2 py-1">Tanggal</th>
                <th className="border border-black px-2 py-1">Nomor</th>
                <th className="border border-black px-2 py-1">Tanggal</th>
                <th className="border border-black px-2 py-1">Keterangan</th>
                <th className="border border-black px-2 py-1">NIK</th>
                <th className="border border-black px-2 py-1">Nama</th>
                <th className="border border-black px-2 py-1">NIK</th>
                <th className="border border-black px-2 py-1">Nama</th>
              </tr>
            </thead>
            <tbody>
              {tableData.length > 0 ? (
                tableData.map((row, index) => (
                  <tr
                    key={index}
                    className="border-b hover:bg-gray-100 transition"
                  >
                    <td className="border border-black px-2 py-1">
                      {index + 1}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.no_bapsh || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.tgl_bapsh || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.no_bsts || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.tgl_bsts || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.keterangan || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.nik_pengirim || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.nama_pengirim || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.nik_penerima || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.nama_penerima || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.tipe_sarana || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.qty_hilang || "-"}
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan={8}
                    className="border px-6 py-3 text-gray-500 text-center text-lg"
                  >
                    Tidak ada data tersedia.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

ReportPDF.displayName = "ReportPDF";
export default ReportPDF;
