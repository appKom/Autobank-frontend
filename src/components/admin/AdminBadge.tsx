import { ShieldCheckIcon } from "@heroicons/react/24/solid";

interface AdminBadgeProps {
  className?: string;
}

export default function AdminBadge({ className = "" }: AdminBadgeProps) {
  return (
    <span
      className={`inline-flex items-center justify-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-200 text-green-800 ${className}`}
    >
      <ShieldCheckIcon className="w-4 h-4 mr-1" />
      Admin
    </span>
  );
}
