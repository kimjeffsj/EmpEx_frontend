import { cn } from "@/lib/utils";
import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  /**
   * Size variant of the spinner
   * @default "default"
   */
  size?: "sm" | "default" | "lg";
  /**
   * Optional text to display below the spinner
   */
  text?: string;
  /**
   * Optional className for container
   */
  className?: string;
}

const sizeClasses = {
  sm: "h-4 w-4",
  default: "h-8 w-8",
  lg: "h-12 w-12",
};

export const LoadingSpinner = ({
  size = "default",
  text,
  className,
}: LoadingSpinnerProps) => {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-2",
        className
      )}
    >
      <Loader2
        className={cn("animate-spin", sizeClasses[size], text ? "mb-2" : "")}
      />
      {text && <p className="text-sm text-muted-foreground">{text}</p>}
    </div>
  );
};

export default LoadingSpinner;
