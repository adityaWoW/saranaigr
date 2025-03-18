import React, { forwardRef } from "react";

type TableRow = {
  keterangan: string;
  kode_igr: string;
  no_bsts: string;
  nomor_seri: string;
  status: string;
  tgl_bsts: string;
  tipe_sarana: string;
};

interface ReportPDFProps {
  tableData: TableRow[];
}

const ReportPDF = forwardRef<HTMLDivElement, ReportPDFProps>(
  ({ tableData }, ref) => {
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
            <p>PIC Cetak : __________</p>
            <p>User ID : __________</p>
            <p>Hal : __________</p>
          </div>
        </div>

        {/* Judul */}
        <div className="text-center print-header mb-4">
          <h1>Rekapitulasi Sarana Idm. Tidak Diterima Toko Igr.</h1>
          <h2>Delivery Driver Idm. ke Lokasi Retur Igr.*</h2>
          <p>
            <span className="font-semibold">Periode :</span> ......... s/d
            .........
          </p>
          <p>
            <span className="font-semibold">Lokasi :</span> Retur Igr.
          </p>
          <p>
            <span className="font-semibold">Diterima dari :</span> Delivery
            Driver Idm.
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
                  BSTS
                </th>
                <th colSpan={3} className="border border-black px-2 py-1">
                  ID Sarana Idm. Tidak Diterima
                </th>
                <th rowSpan={2} className="border border-black px-2 py-1">
                  Keterangan
                </th>
                <th rowSpan={2} className="border border-black px-2 py-1">
                  Status
                </th>
              </tr>
              <tr className="bg-gray-300 font-bold">
                <th className="border border-black px-2 py-1">No.</th>
                <th className="border border-black px-2 py-1">
                  Tanggal Pembentukan
                </th>
                <th className="border border-black px-2 py-1">
                  Kode Toko Igr.
                </th>
                <th className="border border-black px-2 py-1">Kode - Tipe</th>
                <th className="border border-black px-2 py-1">Nomor Seri</th>
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
                      {row.no_bsts || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.tgl_bsts || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.kode_igr || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.tipe_sarana || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.nomor_seri || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.keterangan || "-"}
                    </td>
                    <td className="border border-black px-2 py-1">
                      {row.status || "-"}
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
