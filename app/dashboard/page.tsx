import DashboardLayout from "@/components/dashboardlayout";

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="p-6 md:p-8 lg:p-10 bg-white/70 shadow-md rounded-lg sm:ml-30">
        <h1 className="text-xl font-bold text-gray-800">
          Selamat Datang di Monitoring Sarana
        </h1>
      </div>
    </DashboardLayout>
  );
}
