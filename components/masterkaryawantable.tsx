"use client";

import React, { useEffect, useState } from "react";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Card, CardContent } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { AlertCircle, Search, PlusCircle } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import dotenv from "dotenv";

dotenv.config();
const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL;

import { useDebouncedCallback } from "use-debounce";
import { useSession } from "next-auth/react";

interface Karyawan {
  kar_nik: string;
  kar_nama: string;
  kar_jenis: string;
}

export default function DataTable() {
  const [data, setData] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState({
    kar_nik: "",
    kar_nama: "",
    kar_jenis: "",
  });
  const pageSize = 5;

  const { data: session } = useSession();
  const fetchData = useDebouncedCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/masterkaryawan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          p_kodeigr: "44",
          userid: session?.user?.name,
        }),
      });

      if (!response.ok)
        throw new Error(`HTTP error! Status: ${response.status}`);

      const result = await response.json();
      if (Array.isArray(result.data)) {
        setData(result.data);
      } else {
        throw new Error("Format data API tidak sesuai");
      }
    } catch (error) {
      setError(
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan tidak diketahui"
      );
    } finally {
      setLoading(false);
    }
  });

  useEffect(() => {
    if (session?.user?.name) {
      fetchData();
    }
  }, [session, fetchData]);

  const handleAddKaryawan = useDebouncedCallback(async () => {
    try {
      const response = await fetch(`${BASE_URL}/addmasterkaryawan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          p_kodeigr: "44",
          kar_nik: formData.kar_nik.trim(),
          kar_nama: formData.kar_nama.trim(),
          kar_jenis: formData.kar_jenis.trim(),
          userid: session?.user?.name,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! Status: ${response.status}`);
      }

      const result = await response.json();

      if (result.status === 201) {
        console.log("Karyawan berhasil ditambahkan:", result);
        alert("Karyawan berhasil ditambahkan!");
        setModalOpen(false);
        setFormData({
          kar_nik: "",
          kar_nama: "",
          kar_jenis: "",
        });
      } else {
        throw new Error(result.message || "Gagal menambahkan karyawan");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : "Terjadi kesalahan tidak diketahui";
      console.error("Error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  }, 500);

  useEffect(() => {
    if (modalOpen && data.some((item) => item.kar_jenis === "IGR")) {
      setFormData((prev) => ({ ...prev, kar_jenis: "IGR" }));
    }
  }, [modalOpen, data]);

  const filteredData = data.filter(
    (item) =>
      item.kar_nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kar_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kar_jenis.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // Hitung total halaman setelah pencarian
  const totalPages = Math.ceil(filteredData.length / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedData = filteredData.slice(startIndex, startIndex + pageSize);

  return (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full mx-auto my-2"
    >
      <Card className="shadow-lg rounded-xl overflow-hidden border border-gray-300">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            📋 Daftar Karyawan
          </h2>

          <div className="flex justify-between items-center mb-4">
            <Button
              onClick={() => setModalOpen(true)}
              className="flex items-center gap-2 bg-blue-500 text-white hover:bg-blue-600"
            >
              <PlusCircle size={18} /> Add Karyawan
            </Button>
          </div>

          {/* Search Input */}
          <div className="relative mb-3">
            <Search className="absolute left-3 top-3 text-gray-500" size={15} />
            <Input
              type="text"
              placeholder="Cari berdasarkan Kode IGR, NIK, atau Nama..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
              className="pl-10 py-2 border border-gray-300 focus:ring-2 focus:ring-blue-500 rounded-lg shadow-sm"
            />
          </div>

          {loading && (
            <div className="space-y-3">
              {[...Array(5)].map((_, i) => (
                <Skeleton key={i} className="h-6 w-full rounded-md" />
              ))}
            </div>
          )}

          {error && (
            <div className="flex items-center gap-2 p-4 bg-red-100 text-red-700 rounded-md">
              <AlertCircle className="h-5 w-5" />
              <span>Error: {error}</span>
            </div>
          )}

          {!loading && !error && (
            <div className="overflow-x-auto">
              <Table className="w-full border border-gray-300 rounded-lg">
                <TableHeader>
                  <TableRow className=" hover:bg-gray-100 text-white">
                    <TableHead className="p-4 text-left font-semibold">
                      NIK
                    </TableHead>
                    <TableHead className="p-4 text-left font-semibold">
                      NAMA
                    </TableHead>
                    <TableHead className="p-4 text-left font-semibold">
                      JENIS
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {paginatedData.length > 0 ? (
                    paginatedData.map((item, index) => (
                      <TableRow
                        key={index}
                        className="hover:bg-blue-100 transition-colors"
                      >
                        <TableCell className="p-4 border-b border-gray-300">
                          {item.kar_nik}
                        </TableCell>
                        <TableCell className="p-4 border-b border-gray-300">
                          {item.kar_nama}
                        </TableCell>
                        <TableCell className="p-4 border-b border-gray-300">
                          {item.kar_jenis}
                        </TableCell>
                      </TableRow>
                    ))
                  ) : (
                    <TableRow>
                      <TableCell
                        colSpan={3}
                        className="text-center p-4 text-gray-500"
                      >
                        Tidak ada data ditemukan
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </div>
          )}

          <Dialog open={modalOpen} onOpenChange={setModalOpen}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Tambah Karyawan</DialogTitle>
              </DialogHeader>
              <div className="space-y-3">
                <Input
                  type="text"
                  placeholder="NIK"
                  value={formData.kar_nik}
                  onChange={(e) =>
                    setFormData({ ...formData, kar_nik: e.target.value })
                  }
                />
                <Input
                  type="text"
                  placeholder="Nama"
                  value={formData.kar_nama}
                  onChange={(e) =>
                    setFormData({ ...formData, kar_nama: e.target.value })
                  }
                />
                <select
                  value={formData.kar_jenis || ""}
                  onChange={(e) => {
                    const selectedValue = e.target.value;
                    setFormData((prev) => ({
                      ...prev,
                      kar_jenis: selectedValue,
                    }));
                  }}
                  className="w-full p-2 border border-gray-300 rounded-md"
                >
                  {data.some((item) => item.kar_jenis === "IGR") ? (
                    <option value="IGR">IGR</option>
                  ) : (
                    <>
                      <option value="">Pilih Jenis</option>
                      <option value="IDM">IDM</option>
                      <option value="DRIVER">DRIVER</option>
                    </>
                  )}
                </select>

                <Button
                  onClick={handleAddKaryawan}
                  className="bg-blue-500 text-white hover:bg-blue-600 w-full"
                >
                  Simpan
                </Button>
              </div>
            </DialogContent>
          </Dialog>

          {/* Tombol Previous & Next */}
          {filteredData.length > pageSize && (
            <div className="mt-6 flex justify-between">
              <Button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-4 py-2 rounded-md ${
                  currentPage === 1
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                ⬅️ Previous
              </Button>

              <span className="text-gray-700 font-medium">
                Halaman {currentPage} dari {totalPages}
              </span>

              <Button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage >= totalPages}
                className={`px-4 py-2 rounded-md ${
                  currentPage >= totalPages
                    ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                    : "bg-blue-500 text-white hover:bg-blue-600"
                }`}
              >
                Next ➡️
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}
