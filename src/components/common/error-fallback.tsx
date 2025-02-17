import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { APIError } from "@/lib/utils/api.utils";

interface ErrorFallbackProps {
  message: string | Error | APIError;
  onRetry?: () => void;
  className?: string;
  details?: string;
}

export const ErrorFallback = ({
  message,
  onRetry,
  className,
  details,
}: ErrorFallbackProps) => {
  const errorMessage = message instanceof Error ? message.message : message;

  return (
    <Card className={cn("w-full max-w-md p-6", className)}>
      <div className="flex flex-col items-center text-center gap-4">
        <div className="flex items-center justify-center w-12 h-12 rounded-full bg-destructive/10">
          <AlertCircle className="h-6 w-6 text-destructive" />
        </div>

        <div className="space-y-2">
          <h3 className="text-lg font-semibold">{errorMessage}</h3>
          {details && process.env.NODE_ENV === "development" && (
            <p className="text-sm text-muted-foreground break-words">
              {details}
            </p>
          )}
        </div>

        {onRetry && (
          <Button variant="outline" onClick={onRetry} className="mt-2">
            Try Again
          </Button>
        )}
      </div>
    </Card>
  );
};

export default ErrorFallback;
