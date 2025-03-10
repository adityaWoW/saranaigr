import DashboardLayout from "@/components/dashboardlayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6">
        <h1 className="text-2xl font-bold">
          Selamat Datang di Monitoring Sarana
        </h1>
        <p className="mt-2 text-gray-600">
          Ini adalah halaman utama dashboard.
        </p>
      </div>
    </DashboardLayout>
  );
}
