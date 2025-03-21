import React, { forwardRef } from "react";

type TableRowBapsh = {
  no_bapsh: string,
  no_bsts: string,
  tgl_bsts: string,
  nomor_seri: string,
  kode_sarana: string,
  nik_pengirim: string,
  nama_pengirim: string,
  nik_penerima: string,
  nama_penerima: string,
  rph_sarana: number
};

interface ReportPDFProps {
  tableData: TableRowBapsh[];
}

const BapshPDF = forwardRef<HTMLDivElement, ReportPDFProps>(
  ({ tableData }, ref) => {

    let bronjong: string[] = [];
    let container: string[] = [];
    let dolly: string[] = [];
    let totalRupiah: number = 0;

    if (tableData.length === 0) return null;

    tableData.forEach((row) => {
      switch (row.kode_sarana) {
        case '01': 
          bronjong.push(row.nomor_seri);
          break;
        case '02':
          container.push(row.nomor_seri);
          break;
        case '03':
          dolly.push(row.nomor_seri);
          break;
      }
      totalRupiah += row.rph_sarana;
    });

    console.log(bronjong, container, dolly);

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
            Berita Acara Pembebanan Sarana Idm. Hilang
          </h1>
          <h2 className="text-xl font-medium text-gray-900 mb-4">
            {`44/BAPSH/${tableData[0].no_bapsh}`}
          </h2>
        </div>

        {/* Isi */}
        <div className="w-full flex flex-col items-center">
        <p className="text-left">
          Sehubungan dengan sudah lewatnya periode waktu 14 hari sejak terjadi selisih serah terima sarana Idm. dengan rincian sbb.
        </p>

        <br />

          <table className="w-fit text-left">
            <tbody>
              <tr>
                <td className="font-semibold pr-32">Nomor BSTS</td>
                <td>: {tableData[0].no_bsts}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-32">Tanggal BSTS</td>
                <td>: {tableData[0].tgl_bsts}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-32">Proses Serah Terima</td>
                <td>: Delivery Idm. ke Retur Igr.</td>
              </tr>
              <tr>
                <td className="font-semibold pr-32">NIK / Nama Pengirim</td>
                <td>: {tableData[0].nik_pengirim} / {tableData[0].nama_pengirim}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-32">NIK / Nama Penerima</td>
                <td>: {tableData[0].nik_penerima} / {tableData[0].nama_penerima}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-32 align-top">Nomor Seri Sarana yang Selisih</td>
                <td className="pr-2 align-top">: - Bronjong: {bronjong.length > 0 ? bronjong.join(", ") : '-'}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-32 align-top"></td>
                <td className="pr-2 align-top">: - Container: {container.length > 0 ? container.join(", ") : '-'}</td>
              </tr>
              <tr>
                <td className="font-semibold pr-32 align-top"></td>
                <td className="pr-2 align-top">: - Dolly: {dolly.length > 0 ? dolly.join(", ") : '-'}</td>
              </tr>
            </tbody>
          </table>
          <br />
          <div className="w-full flex flex-col items-center">
            <p className="text-left">
              Maka atas selisih tsb. di atas akan dibebankan ke personil di bawah ini selaku penanggungjawab serah terima sarana Idm. tsb :
            </p>
            <br />
            <table className="w-fit text-left">
              <tbody>
                <tr>
                  <td className="font-semibold pr-16 align-top">Pihak yang bertanggung jawab</td>
                  <td className="font-semibold pl-2">: {tableData[0].nik_pengirim} / {tableData[0].nama_pengirim}</td>
                </tr>
                <tr>
                  <td className="font-semibold pr-16 align-top">Total Rupiah</td>
                  <td className="font-semibold pl-2">: Rp. {totalRupiah.toLocaleString("id-ID", { minimumFractionDigits: 2 })}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="w-full flex justify-center mt-6">
            <table className="border border-black text-center">
              <thead>
                <tr>
                  <th className="border border-black px-8 py-2">Diketahui,</th>
                  <th className="border border-black px-8 py-2">Diterima,</th>
                  <th className="border border-black px-8 py-2">Dibuat,</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border border-black h-32"></td>
                  <td className="border border-black h-32"></td>
                  <td className="border border-black h-32"></td>
                </tr>
                <tr>
                  <td className="border border-black px-4 py-2 font-semibold">
                    Store Mgr.
                  </td>
                  <td className="border border-black px-4 py-2 font-semibold">
                    Delivery Driver Idm.
                  </td>
                  <td className="border border-black px-4 py-2 font-semibold">
                    Receiving Checker Igr.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    );
  }
);

BapshPDF.displayName = "BapshPDF";
export default BapshPDF;
