import React, { forwardRef } from "react";

type TableRowRangkuman = {
  hsi_kodesarana: string;
  hsi_nomorseri: string;
  kode_igr: string;
};

interface ReportPDFProps {
  tableDataRangkuman: TableRowRangkuman[];
}

const RangkumanPDF = forwardRef<HTMLDivElement, ReportPDFProps>(
  ({ tableDataRangkuman }, ref) => {
    const groupedData = tableDataRangkuman.reduce((acc, row) => {
      if (!acc[row.hsi_kodesarana]) {
        acc[row.hsi_kodesarana] = [];
      }
      acc[row.hsi_kodesarana].push(row);
      return acc;
    }, {} as Record<string, TableRowRangkuman[]>);

    return (
      <div ref={ref} className="bg-white p-6 rounded-lg border">
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
        <div className="bg-white p-6 rounded-lg border border-white w-fit mx-auto text-center">
          <h1 className="text-xl font-bold text-gray-900 mb-4">
            Rangkuman Bukti Serah Terima Sarana Idm.
          </h1>

          <div className="text-sm text-gray-800 space-y-2 mx-auto w-fit">
            <div className="grid grid-cols-[150px_1fr] gap-x-2 items-start">
              <span className="font-semibold text-right">Nomor BSTS</span>
              <span className="text-left pl-1">
                : ..............................
              </span>
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-x-2 items-start">
              <span className="font-semibold text-right">Jenis BSTS</span>
              <span className="text-left pl-1 whitespace-pre-line">
                : Pejabat Idm. di Toko Igr. ke Stock Keeper Igr./ Delivery
                Driver Idm. ke Lokasi Retur Igr./Lokasi Retur Igr. ke Lokasi
                Bengkel (GA Idm.)/Lokasi Bengkel (GA Idm.) ke Lokasi Gudang
                Igr.**
              </span>
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-x-2 items-start">
              <span className="font-semibold text-right">Tanggal BSTS</span>
              <span className="text-left pl-1">
                : ..............................
              </span>
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-x-2 items-start">
              <span className="font-semibold text-right">Lokasi</span>
              <span className="text-left pl-1">
                : Retur Igr./Gudang Igr./Bengkel Cabang Idm.
              </span>
            </div>

            <div className="grid grid-cols-[150px_1fr] gap-x-2 items-start">
              <span className="font-semibold text-right">Diterima dari</span>
              <span className="text-left pl-1 whitespace-pre-line">
                : Stock Keeper Igr./Receiving Checker Igr./ Delivery Driver
                Idm./GA Cabang Idm.
              </span>
            </div>
          </div>
        </div>

        <div className="overflow-x-auto">
          {Object.entries(groupedData).map(([kodeSarana, rows], index) => (
            <div key={index} className="mb-6">
              <table className="w-full border border-gray-700 text-sm">
                <thead>
                  <tr className="bg-gray-200 font-bold">
                    <th className="border border-gray-700 p-2 text-center w-12">
                      No.
                    </th>
                    <th className="border border-gray-700 p-2 text-center">
                      Nomor Seri Sarana IDM yang Diterima
                    </th>
                  </tr>
                  <tr>
                    <th
                      colSpan={2}
                      className="border border-gray-700 p-2 text-left font-semibold"
                    >
                      Kode/Tipe Sarana: {kodeSarana}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((row, i) => (
                    <tr key={i}>
                      <td className="border border-gray-700 p-2 text-center">
                        {i + 1}
                      </td>
                      <td className="border border-gray-700 p-2 text-center">
                        {row.hsi_nomorseri}
                      </td>
                    </tr>
                  ))}
                  <tr className="font-bold bg-gray-200">
                    <td className="border border-gray-700 p-2 text-center">
                      Total (pcs.)
                    </td>
                    <td className="border border-gray-700 p-2 text-center">
                      {rows.length}
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          ))}
        </div>
      </div>
    );
  }
);

RangkumanPDF.displayName = "RangkumanPDF";
export default RangkumanPDF;
