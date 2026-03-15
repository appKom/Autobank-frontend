import type React from 'react';
import { Receipt, FileText } from 'lucide-react';

export default function AdminDashboard() {
  return (
    <div className="min-h-screen bg-emerald-700 flex flex-col items-center justify-center p-4">
      <div className="max-w-2xl w-full">
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold text-white mb-2">Admin Oversikt</h1>
          <p className="text-white">Godkjenn kvitteringer og søknader</p>
        </div>

        {/* la stå, style når vi får fikset søknader */}
        {/* <div className="grid grid-cols-1 md:grid-cols-2 gap-4">  */}
        <div className="flex justify-center">
          <div className="w-full max-w-sm">
            {/* Main action cards */}
            <AdminCard
              title="Kvitteringer"
              description="Godkjenn kvitteringer"
              icon={<Receipt className="h-6 w-6" />}
              href="/admin/kvittering"
            />
          </div>

          {/* <AdminCard
            title="Søknader"
            description="Godkjenn søknader"
            icon={<FileText className="h-6 w-6" />}
            href="/admin/soknad"
          /> */}
        </div>
      </div>
    </div>
  );
}

interface AdminCardProps {
  title: string;
  description: string;
  icon: React.ReactNode;
  href: string;
}

function AdminCard({ title, description, icon, href }: AdminCardProps) {
  return (
    <a
      href={href}
      className="
        block group relative overflow-hidden rounded-xl p-6
        bg-emerald-200 hover:bg-emerald-100
        transition-all duration-300 ease-in-out
        transform hover:-translate-y-1 hover:shadow-xl
      "
    >
      <div className="flex items-center mb-3">
        <div className="p-2 rounded-lg mr-3 bg-emerald-100 text-emerald-700">{icon}</div>
        <h3 className="font-bold text-lg text-emerald-800">{title}</h3>
      </div>

      <p className="text-sm text-emerald-700">{description}</p>

      <div
        className="absolute bottom-0 right-0 h-16 w-16 -mb-6 -mr-6 rounded-full 
        bg-gradient-to-tr from-transparent 
        to-black/5 group-hover:to-black/10 transition-all duration-300"
      ></div>
    </a>
  );
}
