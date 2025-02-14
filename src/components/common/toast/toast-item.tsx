import { ToastItemProps } from "@/types/toast.types";
import { AlertCircle, CheckCircle2, Info, XCircle } from "lucide-react";
import { cn } from "@/lib/utils/utils";
import { useEffect } from "react";

const toastStyles = {
  success: {
    icon: <CheckCircle2 className="h-5 w-5" />,
    className: "bg-green-50 text-green-800 border-green-200",
  },
  error: {
    icon: <XCircle className="h-5 w-5" />,
    className: "bg-red-50 text-red-800 border-red-200",
  },
  warning: {
    icon: <AlertCircle className="h-5 w-5" />,
    className: "bg-yellow-50 text-yellow-800 border-yellow-200",
  },
  info: {
    icon: <Info className="h-5 w-5" />,
    className: "bg-blue-50 text-blue-800 border-blue-200",
  },
};

export const ToastItem = ({ toast, onRemove }: ToastItemProps) => {
  const { icon, className } = toastStyles[toast.type];

  useEffect(() => {
    const timer = setTimeout(() => {
      onRemove(toast.id);
    }, 5000);

    return () => clearTimeout(timer);
  }, [toast.id, onRemove]);

  return (
    <div
      className={cn(
        "pointer-events-auto flex w-full max-w-md rounded-lg border p-4 shadow-lg",
        className
      )}
    >
      <div className="flex w-full gap-3">
        <div className="flex-shrink-0">{icon}</div>
        <div className="flex-1">
          <p className="font-medium">{toast.title}</p>
          {toast.message && (
            <p className="mt-1 text-sm opacity-90">{toast.message}</p>
          )}
        </div>
        <button
          onClick={() => onRemove(toast.id)}
          className="flex-shrink-0 ml-4 hover:opacity-70"
        >
          <XCircle className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
};
