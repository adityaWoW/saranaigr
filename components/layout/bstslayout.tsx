"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DataTableBSTS, DataTableBSTSDR } from "../data-table";
import axios from "axios";
import React, { useRef } from "react";
import { BSTS, BSTSDR, Signature } from "@/lib/definition";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import { BstsDR, BstsDuaPihak, BstsTigaPihak } from "../pdf/bstspdf";
import { Truck, Package, RefreshCcw, Warehouse, Wrench } from "lucide-react";
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

export default function BSTSLayout() {
  const today = [
    new Date().getFullYear(),
    String(new Date().getMonth() + 1).padStart(2, "0"),
    String(new Date().getDate()).padStart(2, "0"),
  ].join("-");

  const [kodeIgr, setKodeIgr] = React.useState<string | null>(null);
  const [bsts, setBsts] = React.useState<BSTS | null>(null);
  const [bstsdr, setBstsDr] = React.useState<BSTSDR | null>(null);
  const [signature, setSignature] = React.useState<Signature | null>(null);
  const [listBsts, setListBsts] = React.useState<BSTS[]>([]);
  const [listBstsDr, setListBstsDr] = React.useState<BSTSDR[]>([]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [date, setDate] = React.useState<string | undefined>(today);
  const [jenis, setJenis] = React.useState<string>("PS");

  const bstsDuaPihakRef = useRef<HTMLDivElement>(null);
  const bstsTigaPihakRef = useRef<HTMLDivElement>(null);
  const bstsDrRef = useRef<HTMLDivElement>(null);

  const handlePrintBstsDuaPihak = useReactToPrint({
    contentRef: bstsDuaPihakRef,
    documentTitle: "BSTS",
    pageStyle: `
      @page {
          size: A4 potrait;
        }
      `,
    onPrintError: (errorLocation, error) => {
      console.error(`Print error at ${errorLocation}:`, error);
    },
  });

  const handlePrintBstsTigaPihak = useReactToPrint({
    contentRef: bstsTigaPihakRef,
    documentTitle: "BSTS",
    pageStyle: `
      @page {
          size: A4 potrait;
        }
      `,
    onPrintError: (errorLocation, error) => {
      console.error(`Print error at ${errorLocation}:`, error);
    },
  });

  const handlePrintBstsDr = useReactToPrint({
    contentRef: bstsDrRef,
    documentTitle: "BSTS",
    pageStyle: `
      @page {
          size: A4 potrait;
        }
      `,
    onPrintError: (errorLocation, error) => {
      console.error(`Print error at ${errorLocation}:`, error);
    },
  });

  const fetchData = React.useCallback(
    async (jenis: string, date: string | undefined) => {
      setListBsts([]);
      setListBstsDr([]);
      setIsLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}/detailBsts`, {
          p_kodeigr: kodeIgr,
          jenis: jenis,
          date: date,
        });

        if (response.data.data == null) {
          setListBsts([]);
          setListBstsDr([]);
        } else {
          if (jenis === "DR") {
            setListBstsDr(response.data.data);
          } else {
            setListBsts(response.data.data);
          }
        }
      } catch (e) {
        console.error(e);
        toast.error("Terjadi Kesalahan");
      } finally {
        setIsLoading(false);
      }
    },
    [kodeIgr], // 🔴 dependency penting
  );

  const handleTabChange = async (jenis: string) => {
    setJenis(jenis);
  };

  const handleDateChange = async (date: Date | undefined) => {
    if (!date) return;
    const formattedDate = [
      date.getFullYear(),
      String(date.getMonth() + 1)?.padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("-");
    setDate(formattedDate);
  };

  const handleClick = async (data: BSTS) => {
    try {
      const response = await axios.post(`${BASE_URL}/signature`, {
        p_kodeigr: kodeIgr,
        nobsts: data.no_bsts,
      });

      if (response.data.data == null) {
        setSignature({} as Signature);
      } else {
        setSignature(response.data.data[0]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Terjadi Kesalahan");
    }
    setBsts({ ...data });
  };

  const handleClickDR = async (data: BSTSDR) => {
    try {
      const response = await axios.post(`${BASE_URL}/signature`, {
        p_kodeigr: kodeIgr,
        nobsts: data.no_bsts,
      });

      if (response.data.data == null) {
        setSignature({} as Signature);
      } else {
        setSignature(response.data.data[0]);
      }
    } catch (e) {
      console.error(e);
      toast.error("Terjadi Kesalahan");
    }
    setBstsDr({ ...data });
  };

  React.useEffect(() => {
    const value = localStorage.getItem("p_kodeigr");
    setKodeIgr(value);
  }, []);

  React.useEffect(() => {
    if (!kodeIgr) return;
    fetchData(jenis, date);
  }, [kodeIgr, date, jenis, fetchData]);

  const printByJenis = React.useCallback(() => {
    if (!bsts || !signature) return;

    switch (jenis) {
      case "PS":
      case "RG":
        handlePrintBstsDuaPihak();
        break;
      case "GB":
      case "BG":
        handlePrintBstsTigaPihak();
        break;
      case "DR":
        handlePrintBstsDr();
        break;
    }

    setBsts(null);
    setSignature(null);
  }, [
    bsts,
    signature,
    jenis,
    handlePrintBstsDuaPihak,
    handlePrintBstsTigaPihak,
    handlePrintBstsDr,
  ]);
  
  React.useEffect(() => {
    printByJenis();
  }, [printByJenis]);

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 via-sky-50 to-indigo-50 px-10 py-8 space-y-10">
      {/* HEADER MODERN */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-600 via-sky-500 to-cyan-500 p-[1px] shadow-lg">
        <div className="rounded-2xl bg-white/90 backdrop-blur px-8 py-6">
          <div className="flex items-center gap-4">
            {/* ICON */}
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-indigo-500 to-cyan-500 text-white shadow-md">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12h6m-6 4h6M9 8h6m2 13H7a2 2 0 01-2-2V5a2 2 0 012-2h5l5 5v11a2 2 0 01-2 2z"
                />
              </svg>
            </div>

            {/* TITLE */}
            <div>
              <h1 className="text-3xl font-bold tracking-tight text-slate-900">
                Bukti Serah Terima Sarana
              </h1>
              <p className="text-sm font-medium text-sky-600">
                Dashboard Monitoring & Cetak Dokumen BSTS
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN PANEL */}
      <div className="w-full bg-white/80 backdrop-blur rounded-2xl border border-slate-200 shadow-md p-8">
        <Tabs
          onValueChange={handleTabChange}
          defaultValue="PS"
          className="space-y-8"
        >
          {/* TAB LIST */}
          <div className="flex justify-between items-center flex-wrap gap-4">
            <TabsList className="flex gap-3 bg-slate-100 p-2 rounded-xl shadow-inner">
              <TabsTrigger value="PS" className="flex items-center gap-2">
                <Package className="w-4 h-4" /> BSTS-PS
              </TabsTrigger>
              <TabsTrigger value="DR" className="flex items-center gap-2">
                <Truck className="w-4 h-4" /> BSTS-DR
              </TabsTrigger>
              <TabsTrigger value="RG" className="flex items-center gap-2">
                <RefreshCcw className="w-4 h-4" /> BSTS-RG
              </TabsTrigger>
              <TabsTrigger value="GB" className="flex items-center gap-2">
                <Warehouse className="w-4 h-4" /> BSTS-GB
              </TabsTrigger>
              <TabsTrigger value="BG" className="flex items-center gap-2">
                <Wrench className="w-4 h-4" /> BSTS-BG
              </TabsTrigger>
            </TabsList>

            <div className="text-sm text-slate-500">
              Pilih jenis BSTS untuk melihat data
            </div>
          </div>

          {/* PS */}
          <TabsContent value="PS">
            <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white">
              <CardHeader className="pb-4 flex flex-row items-center gap-3">
                <div className="p-3 rounded-xl bg-indigo-100 text-indigo-600">
                  <Package />
                </div>
                <div>
                  <CardTitle className="text-xl">BSTS-PS</CardTitle>
                  <CardDescription>
                    Serah terima Pejabat IDM ke Stock Keeper IGR
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <DataTableBSTS
                  data={listBsts}
                  isLoading={isLoading}
                  handleClick={handleClick}
                  onDateChange={handleDateChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* DR */}
          <TabsContent value="DR">
            <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white">
              <CardHeader className="pb-4 flex flex-row items-center gap-3">
                <div className="p-3 rounded-xl bg-emerald-100 text-emerald-600">
                  <Truck />
                </div>
                <div>
                  <CardTitle className="text-xl">BSTS-DR</CardTitle>
                  <CardDescription>
                    Serah terima Driver IDM ke Retur IGR
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <DataTableBSTSDR
                  data={listBstsDr}
                  isLoading={isLoading}
                  handleClick={handleClickDR}
                  onDateChange={handleDateChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* RG */}
          <TabsContent value="RG">
            <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white">
              <CardHeader className="pb-4 flex flex-row items-center gap-3">
                <div className="p-3 rounded-xl bg-yellow-100 text-yellow-600">
                  <RefreshCcw />
                </div>
                <div>
                  <CardTitle className="text-xl">BSTS-RG</CardTitle>
                  <CardDescription>
                    Serah terima Retur IGR ke Gudang IGR
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <DataTableBSTS
                  data={listBsts}
                  isLoading={isLoading}
                  handleClick={handleClick}
                  onDateChange={handleDateChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* GB */}
          <TabsContent value="GB">
            <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white">
              <CardHeader className="pb-4 flex flex-row items-center gap-3">
                <div className="p-3 rounded-xl bg-sky-100 text-sky-600">
                  <Warehouse />
                </div>
                <div>
                  <CardTitle className="text-xl">BSTS-GB</CardTitle>
                  <CardDescription>
                    Serah terima Gudang IGR ke Bengkel IDM
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <DataTableBSTS
                  data={listBsts}
                  isLoading={isLoading}
                  handleClick={handleClick}
                  onDateChange={handleDateChange}
                />
              </CardContent>
            </Card>
          </TabsContent>

          {/* BG */}
          <TabsContent value="BG">
            <Card className="rounded-2xl border border-slate-200 shadow-sm bg-white">
              <CardHeader className="pb-4 flex flex-row items-center gap-3">
                <div className="p-3 rounded-xl bg-rose-100 text-rose-600">
                  <Wrench />
                </div>
                <div>
                  <CardTitle className="text-xl">BSTS-BG</CardTitle>
                  <CardDescription>
                    Serah terima Bengkel IDM ke Gudang IGR
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <DataTableBSTS
                  data={listBsts}
                  isLoading={isLoading}
                  handleClick={handleClick}
                  onDateChange={handleDateChange}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* PRINT AREA */}
      <div className="hidden">
        <BstsDuaPihak
          bsts={bsts}
          signature={signature}
          jenis={jenis}
          ref={bstsDuaPihakRef}
        />
        <BstsTigaPihak
          bsts={bsts}
          signature={signature}
          jenis={jenis}
          ref={bstsTigaPihakRef}
        />
        <BstsDR bsts={bstsdr} signature={signature} ref={bstsDrRef} />
      </div>
    </div>
  );
}
