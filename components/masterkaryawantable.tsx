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
import { AlertCircle, Search } from "lucide-react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

interface Karyawan {
  kry_nik: string;
  kry_nama: string;
  kry_jabatan: string;
}

export default function DataTable() {
  const [data, setData] = useState<Karyawan[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 5;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "http://10.172.124.86:8090/masterkaryawan",
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ p_kodeigr: "44" }),
          }
        );

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
    };

    fetchData();
  }, []);

  const filteredData = data.filter(
    (item) =>
      item.kry_nik.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kry_nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.kry_jabatan.toLowerCase().includes(searchTerm.toLowerCase())
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
      className="w-full max-w-4xl mx-auto mt-6"
    >
      <Card className="shadow-lg rounded-xl overflow-hidden border border-gray-300">
        <CardContent className="p-6">
          <h2 className="text-2xl font-bold mb-6 text-gray-800 text-center">
            📋 Daftar Karyawan
          </h2>

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
                      JABATAN
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
                          {item.kry_nik}
                        </TableCell>
                        <TableCell className="p-4 border-b border-gray-300">
                          {item.kry_nama}
                        </TableCell>
                        <TableCell className="p-4 border-b border-gray-300">
                          {item.kry_jabatan}
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
