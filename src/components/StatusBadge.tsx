import { cn } from "@/lib/utils";

interface StatusBadgeProps {
  status: string;
  className?: string;
}

const StatusBadge = ({ status, className }: StatusBadgeProps) => {
  const getStatusClass = () => {
    switch (status.toLowerCase()) {
      case "available":
        return "status-available";
      case "reserved":
      case "under negotiation":
        return "status-reserved";
      case "sold":
        return "status-sold";
      default:
        return "status-available";
    }
  };

  return (
    <span
      className={cn(
        "inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold",
        getStatusClass(),
        className
      )}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
