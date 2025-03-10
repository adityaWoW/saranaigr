"use client"; // 🔹 Wajib pakai karena ada useState & useEffect

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

// 🔹 Definisi tipe data yang akan diterima dari API
interface Karyawan {
  kode_igr: string;
  nik: string;
  nama: string;
}

export default function DataTable() {
  const [data, setData] = useState<Karyawan[]>([]); // 🔹 State untuk menyimpan data karyawan
  const [loading, setLoading] = useState<boolean>(true); // 🔹 State untuk loading indikator
  const [error, setError] = useState<string | null>(null); // 🔹 State untuk menangkap error

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 🔹 Melakukan request ke API
        const response = await fetch(
          "http://172.20.111.5:8090/masterkaryawan",
          {
            method: "POST", // 🔹 Wajib pakai POST
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ p_kodeigr: "44" }), // 🔹 Kirim parameter dalam body
            mode: "cors", // 🔹 Agar tidak kena CORS error
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const result = await response.json();

        // 🔹 Cek apakah response API mengandung data array
        if (Array.isArray(result.data)) {
          setData(result.data);
        } else {
          throw new Error("Format data API tidak sesuai");
        }
      } catch (error) {
        if (error instanceof Error) {
          setError(error.message);
        } else {
          setError("Terjadi kesalahan yang tidak diketahui");
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <Card className="w-full max-w-4xl mx-auto mt-6 shadow-lg">
      <CardContent>
        <h2 className="text-xl font-bold mb-4">Daftar Karyawan</h2>

        {/* 🔹 Tampilkan loading indikator */}
        {loading && <p>Loading...</p>}

        {/* 🔹 Jika ada error, tampilkan pesan error */}
        {error && <p className="text-red-500">Error: {error}</p>}

        {/* 🔹 Jika tidak loading dan tidak error, tampilkan tabel */}
        {!loading && !error && (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Kode IGR</TableHead>
                <TableHead>NIK</TableHead>
                <TableHead>Nama</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <TableRow key={index}>
                    <TableCell>{item.kode_igr}</TableCell>
                    <TableCell>{item.nik}</TableCell>
                    <TableCell>{item.nama}</TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={3} className="text-center">
                    Tidak ada data
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
}
