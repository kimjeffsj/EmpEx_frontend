import React from "react";
import { format, endOfMonth, addMonths, subMonths } from "date-fns";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ChevronLeft, ChevronRight } from "lucide-react";

interface PayPeriodSelectorProps {
  currentDate: Date;
  onDateChange: (date: Date) => void;
  period: "first" | "second";
  onPeriodChange: (period: "first" | "second") => void;
}

const PayPeriodSelector = ({
  currentDate,
  onDateChange,
  period,
  onPeriodChange,
}: PayPeriodSelectorProps) => {
  const periodDates = {
    first: {
      start: 1,
      end: 15,
    },
    second: {
      start: 16,
      end: endOfMonth(currentDate).getDate(),
    },
  };

  const handlePreviousMonth = () => {
    onDateChange(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    onDateChange(addMonths(currentDate, 1));
  };

  return (
    <Card className="p-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Button variant="outline" size="icon" onClick={handlePreviousMonth}>
            <ChevronLeft className="h-4 w-4" />
          </Button>
          <span className="text-lg font-semibold">
            {format(currentDate, "MMMM yyyy")}
          </span>
          <Button variant="outline" size="icon" onClick={handleNextMonth}>
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        <div className="flex gap-2">
          <Button
            variant={period === "first" ? "default" : "outline"}
            onClick={() => onPeriodChange("first")}
          >
            {`1st - 15th`}
          </Button>
          <Button
            variant={period === "second" ? "default" : "outline"}
            onClick={() => onPeriodChange("second")}
          >
            {`16th - ${periodDates.second.end}th`}
          </Button>
        </div>
      </div>
      <div className="mt-2 text-sm text-muted-foreground">
        {`Selected Period: ${format(currentDate, "MMMM yyyy")} ${
          period === "first"
            ? "1st - 15th"
            : `16th - ${periodDates.second.end}th`
        }`}
      </div>
    </Card>
  );
};

export default PayPeriodSelector;
