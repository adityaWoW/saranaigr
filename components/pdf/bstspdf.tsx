"use client"
import { BSTS, BSTSDR, Signature } from "@/lib/definition";
import React, { forwardRef, useState, useEffect} from "react";
// import { useSession } from "next-auth/react";

interface ReportPDFProps {
  bsts: BSTS | null;
  signature: Signature | null;
  jenis: string
}

interface ReportPDFPropsDR {
  bsts: BSTSDR | null;
  signature: Signature | null;
}

const BstsDuaPihak = forwardRef<HTMLDivElement, ReportPDFProps>(
  ({ bsts, signature, jenis }, ref) => { 

    const[namaCabang, setNamaCabang] = useState <string | null> (null);
    const[kodeCabang, setKodeCabang] = useState <string | null> (null);
    const currentTime = `${new Date().getHours().toString()}:${new Date().getMinutes().toString()}`;

    let title = "";
    let description = "";
    let pihakSatu = "";
    let pihakDua = "";

    let signaturePihakSatu = "";
    let signaturePihakDua = "";

    switch (jenis) {
      case "PS":
        title = "Pejabat Idm. di Toko Igr. ke Stock Keeper Igr.";
        description = "BSTS Pejabat Idm. di Toko Igr. ke Stock Keeper Igr.";
        pihakSatu = "Pejabat Idm. di Toko Igr.";
        pihakDua = "Stock Keeper Igr.";
        break;
      case "RG":
        title = "Lokasi Retur Igr. ke Lokasi Gudang Igr.";
        description = "BSTS Lokasi Retur Igr. ke Lokasi Gudang Igr.";
        pihakSatu = "Receiving Checker Igr.";
        pihakDua = "Stock Keeper Igr.";
        break;
    }

    useEffect(() => {
      if (typeof window !== "undefined") {
        const kodeCB = localStorage.getItem("p_kodeigr");
        const namaCB = localStorage.getItem("nama_cabang")
        setKodeCabang(kodeCB);
        setNamaCabang(namaCB);
      }
    }, []);

    if (!bsts || !signature || !jenis) {
      return;
    }
    
    signaturePihakSatu = `data:image/png;base64,${signature.pihak_satu}`;
    signaturePihakDua = `data:image/png;base64,${signature.pihak_dua}`;

    return (
      <div ref={ref} className="bg-white p-6 rounded-lg border">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm font-bold">PT. INTI CAKRAWALA CITRA</p>
            <p className="text-xs">{namaCabang}</p>
          </div>
        </div>

        <div className="mx-auto w-[148mm] min-h-[210mm] p-[10mm] m-[0mm] text-black print:p-[15mm]">
        {/* Title */}
        <h1 className="text-center text-lg font-bold">
            Bukti Serah Terima Sarana Idm.
        </h1>
        <h2 className="mb-6 text-center text-sm font-semibold">
            {title}
        </h2>

        {/* Main Box */}
        <div className="border border-black p-4">
            {/* Date & Number */}
            <div className="mb-2 flex justify-between text-sm">
            <div>
                <div>IGR/GI{kodeCabang}/{bsts.tgl_bsts}/{currentTime}</div>
            </div>
            <div>
                <div className="font-semibold">No. {bsts.no_bsts}</div>
            </div>
            </div>

            {/* Description */}
            <div className="text-sm">
                {description}
            </div>

            {/* Items */}
            <div className="my-8 gap-4 flex text-sm">
            <div>Bronjong : {bsts.jumlah_bronjong}</div>
            <div>Dolly : {bsts.jumlah_dolly}</div>
            </div>

            {/* Signature Table */}
            <div className="grid grid-cols-2 border border-black text-sm">
            <div className="border border-black py-2 text-center font-semibold">
                Diserahkan
            </div>
            <div className="border border-black py-2 text-center font-semibold">
                Diterima
            </div>

            <div className="h-[120px] border border-black">
              <img
                src={signaturePihakSatu}
                alt="Pihak 1"
                className="h-24 w-auto m-auto"
              />
            </div>
            <div className="h-[120px] border border-black">
              <img
                src={signaturePihakDua}
                alt="Pihak 2"
                className="h-24 w-auto m-auto"
              />
            </div>

            <div className="border border-black py-2 text-center font-semibold">
                {pihakSatu}
            </div>
            <div className="border border-black py-2 text-center font-semibold">
                {pihakDua}
            </div>
            </div>
        </div>
        </div>
      </div>
    );
  }
);

const BstsTigaPihak = forwardRef<HTMLDivElement, ReportPDFProps>(
  ({ bsts, signature, jenis }, ref) => { 

    const[namaCabang, setNamaCabang] = useState <string | null> (null);
    const[kodeCabang, setKodeCabang] = useState <string | null> (null);
    const currentTime = `${new Date().getHours().toString()}:${new Date().getMinutes().toString()}`;

    let title = "";
    let description = "";
    let pihakSatu = "";
    let pihakDua = "";
    let pihakTiga = "";

    let signaturePihakSatu = "";
    let signaturePihakDua = "";
    let signaturePihakTiga = "";

    switch (jenis) {
      case "GB":
        title = "Lokasi Gudang Igr. ke Lokasi Bengkel Cabang Idm.";
        description = "BSTS Lokasi Gudang Igr. ke Lokasi Bengkel Cabang Idm.";
        pihakSatu = "Stock Keeper Igr.";
        pihakDua = "Pejabat Idm. di Toko Igr.";
        pihakTiga = "GA Cabang Idm.";
        break;
      case "BG":
        title = "Lokasi Bengkel Cabang Idm. ke Lokasi Gudang Igr.";
        description = "BSTS Lokasi Bengkel Cabang Idm. ke Lokasi Gudang Igr.";
        pihakSatu = "GA Cabang Idm.";
        pihakDua = "Stock Keeper Igr.";
        pihakTiga = "Pejabat Idm. di Toko Igr.";
        break;
    }

    useEffect(() => {
      if (typeof window !== "undefined") {
        const kodeCB = localStorage.getItem("p_kodeigr");
        const namaCB = localStorage.getItem("nama_cabang")
        setKodeCabang(kodeCB);
        setNamaCabang(namaCB);
      }
    }, []);

    if (!bsts || !signature || !jenis) {
      return;
    }
    
    signaturePihakSatu = `data:image/png;base64,${signature.pihak_satu}`;
    signaturePihakDua = `data:image/png;base64,${signature.pihak_dua}`;
    signaturePihakTiga = `data:image/png;base64,${signature.pihak_tiga}`;

    return (
      <div ref={ref} className="bg-white p-6 rounded-lg border">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm font-bold">PT. INTI CAKRAWALA CITRA</p>
            <p className="text-xs">{namaCabang}</p>
          </div>
        </div>

        <div className="mx-auto w-[148mm] min-h-[210mm] p-[10mm] m-[0mm] text-black print:p-[15mm]">
        {/* Title */}
        <h1 className="text-center text-lg font-bold">
            Bukti Serah Terima Sarana Idm.
        </h1>
        <h2 className="mb-6 text-center text-sm font-semibold">
            {title}
        </h2>

        {/* Main Box */}
        <div className="border border-black p-4">
            {/* Date & Number */}
            <div className="mb-2 flex justify-between text-sm">
            <div>
                <div>IGR/GI{kodeCabang}/{bsts.tgl_bsts}/{currentTime}</div>
            </div>
            <div>
                <div className="font-semibold">No. {bsts.no_bsts}</div>
            </div>
            </div>

            {/* Description */}
            <div className="text-sm">
                {description}
            </div>

            {/* Items */}
            <div className="my-8 gap-4 flex text-sm">
            <div>Bronjong : {bsts.jumlah_bronjong}</div>
            <div>Dolly : {bsts.jumlah_dolly}</div>
            </div>

            {/* Signature Table */}
            <div className="grid grid-cols-3 border border-black text-sm">
              <div className={`${jenis == 'GB' ? "col-span-2" : ""} border border-black py-2 text-center font-semibold`}>
                  Diserahkan,
              </div>
              <div className={`${jenis == 'BG' ? "col-span-2" : ""} border border-black py-2 text-center font-semibold`}>
                  Diterima,
              </div>

              <div className="h-[120px] border border-black">
                <img
                  src={signaturePihakSatu}
                  alt="Pihak 1"
                  className="h-24 w-auto m-auto"
                />
              </div>
              <div className="h-[120px] border border-black">
                <img
                  src={signaturePihakDua}
                  alt="Pihak 2"
                  className="h-24 w-auto m-auto"
                />
              </div>
              <div className="h-[120px] border border-black">
                <img
                  src={signaturePihakTiga}
                  alt="Pihak 3"
                  className="h-24 w-auto m-auto"
                />
              </div>

              <div className="border border-black py-2 text-center font-semibold">
                  {pihakSatu}
              </div>
              <div className="border border-black py-2 text-center font-semibold">
                  {pihakDua}
              </div>
              <div className="border border-black py-2 text-center font-semibold">
                  {pihakTiga}
              </div>
            </div>
        </div>
        </div>
      </div>
    );
  }
);

const BstsDR = forwardRef<HTMLDivElement, ReportPDFPropsDR>(
  ({ bsts, signature }, ref) => { 

    const[namaCabang, setNamaCabang] = useState <string | null> (null);
    const[kodeCabang, setKodeCabang] = useState <string | null> (null);
    const currentTime = `${new Date().getHours().toString()}:${new Date().getMinutes().toString()}`;

    let title = "";
    let description = "";
    let pihakSatu = "";
    let pihakDua = "";

    let signaturePihakSatu = "";
    let signaturePihakDua = "";

    title = "Delivery Driver Idm. ke Lokasi Retur Igr.";
    description = "BSTS Delivery Driver Idm. ke Lokasi Retur Igr.";
    pihakSatu = "Delivery Driver Idm.";
    pihakDua = "Receiving Checker Igr.";

    useEffect(() => {
      if (typeof window !== "undefined") {
        const kodeCB = localStorage.getItem("p_kodeigr");
        const namaCB = localStorage.getItem("nama_cabang")
        setKodeCabang(kodeCB);
        setNamaCabang(namaCB);
      }
    }, []);

    if (!bsts || !signature) {
      return;
    }
    
    signaturePihakSatu = `data:image/png;base64,${signature.pihak_satu}`;
    signaturePihakDua = `data:image/png;base64,${signature.pihak_dua}`;

    return (
      <div ref={ref} className="bg-white p-6 rounded-lg border">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <p className="text-sm font-bold">PT. INTI CAKRAWALA CITRA</p>
            <p className="text-xs">{namaCabang}</p>
          </div>
        </div>

        <div className="mx-auto w-[148mm] min-h-[210mm] p-[10mm] m-[0mm] text-black print:p-[15mm]">
        {/* Title */}
        <h1 className="text-center text-lg font-bold">
            Bukti Serah Terima Sarana Idm.
        </h1>
        <h2 className="mb-6 text-center text-sm font-semibold">
            {title}
        </h2>

        {/* Main Box */}
        <div className="border border-black p-4">
            {/* Date & Number */}
            <div className="mb-2 flex justify-between text-sm">
            <div>
                <div>IGR/GI{kodeCabang}/{bsts.tgl_bsts}/{currentTime}</div>
            </div>
            <div>
                <div className="font-semibold">No. {bsts.no_bsts}</div>
            </div>
            </div>

            {/* Description */}
            <div className="text-sm">
                {description}
            </div>

            {/* Items */}
            <div className="my-4">
              Dikirim,
              <div className="gap-4 flex text-sm">
                <div>Bronjong : {bsts.jumlah_bronjong_kirim}</div>
                <div>Dolly : {bsts.jumlah_dolly_kirim}</div>
              </div>
            </div>

            <div className="my-4">
              Kembali,
              <div className="gap-4 flex text-sm">
                <div>Bronjong : {bsts.jumlah_bronjong_kembali}</div>
                <div>Dolly : {bsts.jumlah_dolly_kembali}</div>
              </div>
            </div>

            <div className="my-4">
              <p>Listing Belum kembali:</p>
              <p>{bsts.barcode_belum_kembali}</p>
            </div>
            {/* Signature Table */}
            <div className="grid grid-cols-2 border border-black text-sm">
              <div className="border border-black py-2 text-center font-semibold">
                  Diserahkan,
              </div>
              <div className="border border-black py-2 text-center font-semibold">
                  Diterima,
              </div>

              <div className="h-[120px] border border-black">
                <img
                  src={signaturePihakSatu}
                  alt="Pihak 1"
                  className="h-24 w-auto m-auto"
                />
              </div>
              <div className="h-[120px] border border-black">
                <img
                  src={signaturePihakDua}
                  alt="Pihak 2"
                  className="h-24 w-auto m-auto"
                />
              </div>

              <div className="border border-black py-2 text-center font-semibold">
                  {pihakSatu}
              </div>
              <div className="border border-black py-2 text-center font-semibold">
                  {pihakDua}
              </div>
            </div>
        </div>
        </div>
      </div>
    );
  }
);

BstsDuaPihak.displayName = "BstsDuaPihak";
BstsTigaPihak.displayName = "BstsTigaPihak";
BstsDR.displayName = "BstsDR";

export { BstsDuaPihak, BstsTigaPihak, BstsDR };
