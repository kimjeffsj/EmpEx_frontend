"use client";

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from "@/components/ui/dialog";
import { Loader2 } from "lucide-react";

interface LoadingDialogProps {
  open: boolean;
  title?: string;
}

export function LoadingDialog({
  open,
  title = "Processing...",
}: LoadingDialogProps) {
  return (
    <Dialog open={open}>
      <DialogContent className="sm:max-w-[325px] !p-6">
        <DialogTitle className="sr-only">{title}</DialogTitle>
        <DialogDescription className="sr-only">
          Please wait while the operation completes
        </DialogDescription>
        <div className="flex flex-col items-center justify-center space-y-4 py-6">
          <Loader2 className="h-8 w-8 animate-spin text-primary" />
          <p className="text-sm text-muted-foreground">{title}</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}
