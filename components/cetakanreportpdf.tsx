import React, { forwardRef } from "react";
import { useSession } from "next-auth/react";

type TableRow = {
  sigr_kodeigr: string;
  sigr_kodesarana: string;
  sigr_lokasi_sarana: string;
  sigr_nomorseri: string;
};

interface ReportPDFProps {
  tableData: TableRow[];
}

const ReportPDF = forwardRef<HTMLDivElement, ReportPDFProps>(
  ({ tableData }, ref) => {
    const groupedData = tableData.reduce((acc, row) => {
      if (!acc[row.sigr_kodesarana]) {
        acc[row.sigr_kodesarana] = [];
      }
      acc[row.sigr_kodesarana].push(row);
      return acc;
    }, {} as Record<string, TableRow[]>);

    const calculateSums = (rows: TableRow[]) => {
      return rows.reduce(
        (sums, row) => {
          const lokasi = row.sigr_lokasi_sarana.toUpperCase();
          if (lokasi.includes("SEMENTARA")) {
            sums.penyimpanan += 1;
          } else if (lokasi === "ISSUING") {
            sums.issuing += 1;
          } else if (lokasi === "DELIVERY") {
            sums.delivery += 1;
          } else if (lokasi === "BENGKEL") {
            sums.bengkel += 1;
          } else if (lokasi === "INTRANSIT") {
            sums.intransit += 1;
          } else if (lokasi === "HILANG") {
            sums.hilang += 1;
          } else if (lokasi === "LOADING IDM") {
            sums.gudang += 1;
          }
          // Gudang dan Retur bisa ditambahkan jika ada kriteria spesifik
          return sums;
        },
        {
          penyimpanan: 0,
          issuing: 0,
          delivery: 0,
          bengkel: 0,
          intransit: 0,
          hilang: 0,
          gudang: 0,
          retur: 0,
        }
      );
    };

    const grandTotal = {
      penyimpanan: 0,
      issuing: 0,
      delivery: 0,
      bengkel: 0,
      intransit: 0,
      hilang: 0,
      gudang: 0,
      retur: 0,
    };
    const { data: session } = useSession();
    return (
      <div ref={ref} className="bg-white p-6 rounded-lg">
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
        <div className="bg-white p-4 rounded-lg">
          <h1 className="text-2xl font-bold text-gray-900 text-center mb-2">
            Laporan Lokasi & Sarana
          </h1>
          <div className="text-sm text-gray-800 text-center">
            <p>
              <span className="font-semibold">Tipe Sarana:</span>{" "}
              Bronjong/Dolly/All
            </p>
            {tableData.length > 0 && (
              <p>
                <span className="font-semibold">Kode Igr:</span>{" "}
                {tableData[0].sigr_kodeigr}
              </p>
            )}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="border-collapse border border-gray-700 w-full text-xs">
            <thead className="bg-gray-200">
              <tr>
                <th
                  rowSpan={2}
                  className="border border-gray-700 p-2 text-center"
                >
                  No.
                </th>
                <th
                  rowSpan={2}
                  className="border border-gray-700 p-2 text-center"
                >
                  Nomor Seri Sarana Idm.
                </th>
                <th
                  colSpan={6}
                  className="border border-gray-700 p-2 text-center"
                >
                  Qty. di Lokasi (Tanggungjawab Idm.)
                </th>
                <th
                  colSpan={2}
                  className="border border-gray-700 p-2 text-center"
                >
                  Qty. di Lokasi (Tanggungjawab Igr.)
                </th>
              </tr>
              <tr>
                <th className="border border-gray-700 p-2 text-center">
                  Penyimpanan
                </th>
                <th className="border border-gray-700 p-2 text-center">
                  Issuing
                </th>
                <th className="border border-gray-700 p-2 text-center">
                  Delivery
                </th>
                <th className="border border-gray-700 p-2 text-center">
                  Bengkel
                </th>
                <th className="border border-gray-700 p-2 text-center">
                  Intransit
                </th>
                <th className="border border-gray-700 p-2 text-center">
                  Hilang
                </th>
                <th className="border border-gray-700 p-2 text-center">
                  Gudang
                </th>
                <th className="border border-gray-700 p-2 text-center">
                  Retur
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(groupedData).map(
                ([kodeSarana, rows], groupIndex) => {
                  const subtotal = calculateSums(rows);
                  grandTotal.penyimpanan += subtotal.penyimpanan;
                  grandTotal.issuing += subtotal.issuing;
                  grandTotal.delivery += subtotal.delivery;
                  grandTotal.bengkel += subtotal.bengkel;
                  grandTotal.intransit += subtotal.intransit;
                  grandTotal.hilang += subtotal.hilang;
                  grandTotal.gudang += subtotal.gudang;
                  grandTotal.retur += subtotal.retur;

                  return (
                    <React.Fragment key={groupIndex}>
                      <tr>
                        <td
                          colSpan={10}
                          className="border border-gray-700 p-2 font-bold bg-gray-100"
                        >
                          Kode/Type Sarana: {kodeSarana}
                        </td>
                      </tr>
                      {rows.map((row, index) => {
                        const lokasi = row.sigr_lokasi_sarana.toUpperCase();
                        return (
                          <tr
                            key={index}
                            className="odd:bg-white even:bg-gray-100"
                          >
                            <td className="border border-gray-700 p-2 text-center">
                              {index + 1}
                            </td>
                            <td className="border border-gray-700 p-2 text-center">
                              {row.sigr_nomorseri}
                            </td>
                            <td className="border border-gray-700 p-2 text-center">
                              {lokasi.includes("SEMENTARA") ? 1 : ""}
                            </td>
                            <td className="border border-gray-700 p-2 text-center">
                              {lokasi === "ISSUING" ? 1 : ""}
                            </td>
                            <td className="border border-gray-700 p-2 text-center">
                              {lokasi === "DELIVERY" ? 1 : ""}
                            </td>
                            <td className="border border-gray-700 p-2 text-center">
                              {lokasi === "BENGKEL" ? 1 : ""}
                            </td>
                            <td className="border border-gray-700 p-2 text-center">
                              {lokasi === "INTRANSIT" ? 1 : ""}
                            </td>
                            <td className="border border-gray-700 p-2 text-center">
                              {lokasi === "HILANG" ? 1 : ""}
                            </td>
                            <td className="border border-gray-700 p-2 text-center">
                              {lokasi === "LOADING IDM" ? 1 : ""}
                            </td>
                            <td className="border border-gray-700 p-2 text-center">
                              {""} {/* Retur */}
                            </td>
                          </tr>
                        );
                      })}
                      <tr className="bg-gray-200 font-bold">
                        <td
                          colSpan={2}
                          className="border border-gray-700 p-2 text-center"
                        >
                          Sub Total (Qty.)
                        </td>
                        <td className="border border-gray-700 p-2 text-center">
                          {subtotal.penyimpanan}
                        </td>
                        <td className="border border-gray-700 p-2 text-center">
                          {subtotal.issuing}
                        </td>
                        <td className="border border-gray-700 p-2 text-center">
                          {subtotal.delivery}
                        </td>
                        <td className="border border-gray-700 p-2 text-center">
                          {subtotal.bengkel}
                        </td>
                        <td className="border border-gray-700 p-2 text-center">
                          {subtotal.intransit}
                        </td>
                        <td className="border border-gray-700 p-2 text-center">
                          {subtotal.hilang}
                        </td>
                        <td className="border border-gray-700 p-2 text-center">
                          {subtotal.gudang}
                        </td>
                        <td className="border border-gray-700 p-2 text-center">
                          {subtotal.retur}
                        </td>
                      </tr>
                    </React.Fragment>
                  );
                }
              )}
              <tr className="bg-gray-300 font-bold">
                <td
                  colSpan={2}
                  className="border border-gray-700 p-2 text-center"
                >
                  Total (Qty.)
                </td>
                <td className="border border-gray-700 p-2 text-center">
                  {grandTotal.penyimpanan}
                </td>
                <td className="border border-gray-700 p-2 text-center">
                  {grandTotal.issuing}
                </td>
                <td className="border border-gray-700 p-2 text-center">
                  {grandTotal.delivery}
                </td>
                <td className="border border-gray-700 p-2 text-center">
                  {grandTotal.bengkel}
                </td>
                <td className="border border-gray-700 p-2 text-center">
                  {grandTotal.intransit}
                </td>
                <td className="border border-gray-700 p-2 text-center">
                  {grandTotal.hilang}
                </td>
                <td className="border border-gray-700 p-2 text-center">
                  {grandTotal.gudang}
                </td>
                <td className="border border-gray-700 p-2 text-center">
                  {grandTotal.retur}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    );
  }
);

ReportPDF.displayName = "ReportPDF";
export default ReportPDF;
