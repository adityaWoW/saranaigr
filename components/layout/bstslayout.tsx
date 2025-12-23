'use client';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { DataTableBSTS, DataTableBSTSDR } from "../data-table"
import axios from "axios";
import React, { useRef } from "react";
import { BSTS, BSTSDR, Signature } from "@/lib/definition";
import { toast } from "sonner";
import { useReactToPrint } from "react-to-print";
import { BstsDR, BstsDuaPihak, BstsTigaPihak } from "../pdf/bstspdf";

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

    const fetchData = async (jenis: string, date: string | undefined) => {
      setListBsts([]);
      setListBstsDr([]);
      setIsLoading(true);
      try {
        const response = await axios.post(`${BASE_URL}/detailBsts`, {
            "p_kodeigr": kodeIgr,
            "jenis": jenis,
            "date": date,
        });  

        if (response.data.data == null) {
          setListBsts([]);
          setListBstsDr([]);
        } else {
          if (jenis == 'DR') {
            setListBstsDr(response.data.data);
          } else {
            setListBsts(response.data.data);
          }
        }
      } catch (e) {
        console.error(e);
        toast.error("Terjadi Kesalahan");
      }      
      setIsLoading(false);
    }

    const handleTabChange = async (jenis: string) => {
      setJenis(jenis);
    }

    const handleDateChange = async (date: Date | undefined) => {
      if (!date) return;
      const formattedDate = [
        date.getFullYear(),
        String(date.getMonth() + 1)?.padStart(2, "0"),
        String(date.getDate()).padStart(2, "0"),
      ].join("-");
      setDate(formattedDate);
    }

    const handleClick = async (data: BSTS) => {
      try {
        const response = await axios.post(`${BASE_URL}/signature`, {
          "p_kodeigr": kodeIgr,
          "nobsts": data.no_bsts
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
    }

    const handleClickDR = async (data: BSTSDR) => {
      try {
        const response = await axios.post(`${BASE_URL}/signature`, {
          "p_kodeigr": kodeIgr,
          "nobsts": data.no_bsts
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
    }

    React.useEffect(() => {
      const value = localStorage.getItem("p_kodeigr");
      setKodeIgr(value);
    }, []);

    React.useEffect(() => {
      if (!kodeIgr) return; // guard
      fetchData(jenis, date);
    }, [kodeIgr, date, jenis]);

    React.useEffect(() => {
      if (bsts != null && signature != null) {
        switch(jenis) {
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
        }
      }
    },[bsts, signature]);

  return (
    <div className="flex w-full flex-col gap-6 my-8 px-8">
        <h1 className="font-bold font-sans text-2xl">
            Bukti Serah Terima Sarana
        </h1>
      <Tabs onValueChange={handleTabChange} defaultValue="PS">
        <TabsList className="gap-4">
          <TabsTrigger value="PS">BSTS-PS</TabsTrigger>
          <TabsTrigger value="DR">BSTS-DR</TabsTrigger>
          <TabsTrigger value="RG">BSTS-RG</TabsTrigger>
          <TabsTrigger value="GB">BSTS-GB</TabsTrigger>
          <TabsTrigger value="BG">BSTS-BG</TabsTrigger>
        </TabsList>
        <TabsContent value="PS">
          <Card >
            <CardHeader>
              <CardTitle>BSTS-PS</CardTitle>
              <CardDescription>
                Serah terima Pejabat Idm. ke Stock Keeper Igr.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <DataTableBSTS data={listBsts} isLoading={isLoading} handleClick={handleClick} onDateChange={handleDateChange}/>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="DR">
          <Card>
            <CardHeader>
              <CardTitle>BSTS-DR</CardTitle>
              <CardDescription>
                Serah terima Delivery Driver Idm. ke Retur Igr.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <DataTableBSTSDR data={listBstsDr} isLoading={isLoading} handleClick={handleClickDR} onDateChange={handleDateChange}/>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="RG">
          <Card>
            <CardHeader>
              <CardTitle>BSTS-RG</CardTitle>
              <CardDescription>
                Serah Terima Retur Igr. ke Gudang Igr.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <DataTableBSTS data={listBsts} isLoading={isLoading} handleClick={handleClick} onDateChange={handleDateChange}/>
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="GB">
          <Card>
            <CardHeader>
              <CardTitle>BSTS-GB</CardTitle>
              <CardDescription>
                Serah terima Gudang Igr. ke Bengkel Idm.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <DataTableBSTS data={listBsts} isLoading={isLoading} handleClick={handleClick} onDateChange={handleDateChange} />
            </CardContent>
          </Card>
        </TabsContent>
        <TabsContent value="BG">
          <Card>
            <CardHeader>
              <CardTitle>BSTS-BG</CardTitle>
              <CardDescription>
                Serah terima Bengkel Idm. ke Gudang Igr.
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
                <DataTableBSTS data={listBsts} isLoading={isLoading} handleClick={handleClick} onDateChange={handleDateChange}/>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      <div className="invisible">
        <BstsDuaPihak bsts={bsts} signature={signature} jenis={jenis} ref={bstsDuaPihakRef}/>
        <BstsTigaPihak bsts={bsts} signature={signature} jenis={jenis} ref={bstsTigaPihakRef}/>
        <BstsDR bsts={bstsdr} signature={signature} ref={bstsDrRef}/>
      </div>
    </div>
  )
}
