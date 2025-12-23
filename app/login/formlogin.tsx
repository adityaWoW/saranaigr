"use client";
import { useEffect, useState } from "react";
import { Lock, User } from "lucide-react";
import Image from "next/image";

export function Form({
  action,
  children,
}: {
  action?: string | ((formData: FormData) => void | Promise<void>);
  children: React.ReactNode;
}) {
  const [connections, setConnections] = useState<string[]>([]);
  const [selectedConnection, setSelectedConnection] = useState<string>("Pilih Koneksi");
  const [p_kodeigr, setPKodeigr] = useState<string>("");

  useEffect(() => {
    const fetchBranches = async () => {
      try {
        const response = await fetch("/api/proxy", { method: "POST" });
        const xmlText = await response.text();
        const parser = new DOMParser();
        const xmlDoc = parser.parseFromString(xmlText, "text/xml");
        const branchNodes = xmlDoc.getElementsByTagName("BRANCH");

        const branchList = Array.from(branchNodes).map((node) => {
          const kodeCabang =
            node.getElementsByTagName("CAB_KODECABANG")[0]?.textContent?.trim() || "";
          const namaCabang =
            node.getElementsByTagName("CAB_NAMACABANG")[0]?.textContent?.trim() || "";
          return { kode: kodeCabang, nama: namaCabang };
        });

        setConnections(branchList.map((b) => `${b.kode} - ${b.nama}`));
        if (branchList.length > 0) {
          setSelectedConnection(`${branchList[0].kode} - ${branchList[0].nama}`);
          setPKodeigr(branchList[0].kode); // hanya ambil kodeigr-nya
        }
      } catch (error) {
        console.error("Gagal mengambil data cabang:", error);
      }
    };

    fetchBranches();
  }, []);

  const handleSelectChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const selected = event.target.value;
    setSelectedConnection(selected);
    const kodeOnly = selected.split(" - ")[0];
    setPKodeigr(kodeOnly);
  };

  // ✅ Tambahkan handler submit
  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const p_user = formData.get("p_user") as string;

    // Simpan ke localStorage agar bisa dipakai di halaman lain
    localStorage.setItem("p_kodeigr", p_kodeigr);
    localStorage.setItem("p_user", p_user);
    localStorage.setItem("nama_cabang", selectedConnection)

    // Jika ada action yang dikirim via props, panggil di sini
    if (typeof action === "function") {
      await action(formData);
    } else if (typeof action === "string") {
      event.currentTarget.action = action;
      event.currentTarget.submit();
    }
  };

  return (
    <div>
      <Image src="/logo.png" width={200} height={200} alt="Logo" className="mx-auto"/>
      <div
        className="flex items-center justify-center p-6"
      >
        <form
          onSubmit={handleSubmit}
          className="w-full max-w-sm rounded-xl bg-gray-800 p-8 shadow-xl backdrop-blur-md bg-opacity-80"
        >
          <h2 className="mb-6 text-center text-2xl font-semibold text-gray-100">
            Monitoring Sarana
          </h2>

          {/* Pilihan koneksi cabang */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-300 mb-1">
              Pilih Koneksi
            </label>
            <select
              value={selectedConnection}
              onChange={handleSelectChange}
              className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 px-3 text-gray-100 focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
            >
              <option disabled>Pilih Koneksi</option>
              {connections.map((conn, index) => (
                <option key={index} value={conn}>
                  {conn}
                </option>
              ))}
            </select>
          </div>

          <div className="relative mb-4">
            <label htmlFor="id" className="block text-sm font-medium text-gray-300">
              User ID
            </label>
            <div className="relative mt-1">
              <User
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                id="p_user"
                name="p_user"
                type="text"
                autoComplete="id"
                required
                className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 pl-10 pr-3 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
                placeholder="Enter your ID"
              />
            </div>
          </div>

          <div className="relative mb-6">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-300"
            >
              Password
            </label>
            <div className="relative mt-1">
              <Lock
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
                size={18}
              />
              <input
                id="p_password"
                name="p_password"
                type="password"
                required
                className="w-full rounded-lg border border-gray-600 bg-gray-700 py-2 pl-10 pr-3 text-gray-100 placeholder-gray-500 focus:border-indigo-500 focus:ring focus:ring-indigo-300 focus:ring-opacity-50"
                placeholder="Enter your password"
              />
            </div>
          </div>

          {/* Nilai kode cabang tersembunyi */}
          <input type="hidden" name="p_kodeigr" value={p_kodeigr} />

          {children}
        </form>
      </div>
    </div>
  );
}
