"use client";
import React, { forwardRef, useEffect, useState } from "react";

type TableRowSaranaTertinggal = {
  plk_kodetoko: string;
  plk_namatoko: string;
  plk_nokoli: string;
  plk_zona: string;
  plk_tgl_tutupkoli: string;
  plk_user_request: string;
  plk_tgl_request: string;
  plk_user_approve: string;
  plk_tgl_approve: string;
};

interface ReportPDFProps {
  tableData: TableRowSaranaTertinggal[];
  startDate?: string | null;
}
const formatDDMMYYYY = (date?: string | null) => {
  if (!date) return "-";

  // Kalau format ISO: yyyy-mm-dd atau yyyy-mm-dd hh:mm:ss
  const cleanDate = date.split(" ")[0];
  const parts = cleanDate.split("-");

  if (parts.length === 3) {
    const [year, month, day] = parts;
    return `${day}-${month}-${year}`;
  }

  // fallback jika format lain
  const d = new Date(date);
  if (isNaN(d.getTime())) return date;

  const day = String(d.getDate()).padStart(2, "0");
  const month = String(d.getMonth() + 1).padStart(2, "0");
  const year = d.getFullYear();

  return `${day}-${month}-${year}`;
};

const Laporansaranatertinggal = forwardRef<HTMLDivElement, ReportPDFProps>(
  ({ tableData, startDate}, ref) => {
    const [userid, setUserid] = useState<string | null>(null);
    const [namaCabang, setNamaCabang] = useState<string | null>(null);

    useEffect(() => {
      if (typeof window !== "undefined") {
        setUserid(localStorage.getItem("p_user"));
        setNamaCabang(localStorage.getItem("nama_cabang"));
      }
    }, []);

    if (!tableData.length) return null;

    return (
      <div ref={ref} className="bg-white p-6 text-sm text-black font-serif">
        {/* HEADER */}
        <div className="flex justify-between mb-4">
          <div>
            <p className="font-bold">PT. Inti Cakrawala Citra</p>
            <p>{namaCabang || ".............."}</p>
          </div>
        </div>

        {/* HEADER KANAN */}
        <div className="flex justify-end text-xs mb-4">
          <div>
            <p>Tgl. Cetak : {new Date().toLocaleDateString("id-ID")}</p>
            <p>PIC Cetak : {userid}</p>
            <p>User ID : {userid}</p>
            <p>Halaman : </p>
          </div>
        </div>

        {/* JUDUL */}
      <div className="w-full text-center mb-6">
        <h1 className="font-bold uppercase text-lg">
          Laporan Sarana Pengiriman IDM Yang Tertinggal
          <br />
          Di Area Gudang Toko IGR
        </h1>

        <p className="mt-2">
          Tanggal : {formatDDMMYYYY(startDate)}
        </p>
      </div>

        {/* TABEL UTAMA */}
        <table className="w-full border-collapse text-xs">
          <thead>
            <tr>
              <th rowSpan={2} className="border border-black px-2 py-1">
                No
              </th>
              <th colSpan={2} className="border border-black px-2 py-1">
                Toko IDM
              </th>
              <th rowSpan={2} className="border border-black px-2 py-1">
                No. Sarana / Koli Pengiriman
              </th>
              <th rowSpan={2} className="border border-black px-2 py-1">
                Lokasi Zona (Plamogram)
              </th>
              <th rowSpan={2} className="border border-black px-2 py-1">
                Waktu Tutup Sarana/Koli Pengiriman IDM
              </th>
              <th colSpan={2} className="border border-black px-2 py-1">
                Pembuat
              </th>
              <th colSpan={2} className="border border-black px-2 py-1">
                Approval
              </th>
            </tr>
            <tr>
              <th className="border border-black px-2 py-1">Kode</th>
              <th className="border border-black px-2 py-1">Nama</th>
              <th className="border border-black px-2 py-1">User ID</th>
              <th className="border border-black px-2 py-1">Waktu</th>
              <th className="border border-black px-2 py-1">User ID</th>
              <th className="border border-black px-2 py-1">Waktu</th>
            </tr>
          </thead>
          <tbody>
            {tableData.map((row, i) => (
              <tr key={i}>
                <td className="border border-black text-center">{i + 1}</td>
                <td className="border border-black text-center">
                  {row.plk_kodetoko}
                </td>
                <td className="border border-black">{row.plk_namatoko}</td>
                <td className="border border-black text-center">
                  {row.plk_nokoli}
                </td>
                <td className="border border-black text-center">{row.plk_zona}</td>
                <td className="border border-black text-center">
                  {row.plk_tgl_tutupkoli}
                </td>
                <td className="border border-black text-center">
                  {row.plk_user_request}
                </td>
                <td className="border border-black text-center">
                  {row.plk_tgl_request}
                </td>
                <td className="border border-black text-center">
                  {row.plk_user_approve}
                </td>
                <td className="border border-black text-center">
                  {row.plk_tgl_approve}
                </td>
              </tr>
            ))}
            {/* BARIS KOSONG TAMBAHAN AGAR SEPERTI FORM */}
            {Array.from({ length: 6 }).map((_, idx) => (
              <tr key={`empty-${idx}`}>
                {Array.from({ length: 10 }).map((__, j) => (
                  <td key={j} className="border border-black h-6"></td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  },
);

Laporansaranatertinggal.displayName = "la";
export default Laporansaranatertinggal;
