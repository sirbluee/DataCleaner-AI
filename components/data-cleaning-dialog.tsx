"use client";

import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Wand2 } from "lucide-react";

interface DataCleaningDialogProps {
  columnName: string;
  missingCount: number;
  onClean: (method: string) => void;
}

export function DataCleaningDialog({ columnName, missingCount, onClean }: DataCleaningDialogProps) {
  const [selectedMethod, setSelectedMethod] = useState("impute_by_mean");
  const [open, setOpen] = useState(false);

  const cleaningMethods = [
    {
      id: "impute_by_mean",
      label: "Fill with Mean Value",
      description: "Replace missing values with the mean of existing values"
    },
    {
      id: "impute_by_mode",
      label: "Fill with Most Frequent Value",
      description: "Replace missing values with the most common value"
    },
    {
      id: "delete_missing_row",
      label: "Delete Rows with Missing Values",
      description: "Remove entire rows containing missing values"
    },
    {
      id: "delete_row_outlier",
      label: "Remove Outliers",
      description: "Delete rows with values outside normal range"
    }
  ];

  const handleClean = () => {
    onClean(selectedMethod);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="sm" className="h-8 px-2">
          <span className="text-yellow-600">{missingCount} missing</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Clean Missing Values</DialogTitle>
          <DialogDescription>
            Choose how to handle missing values in column &quot;{columnName}&quot;
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <RadioGroup
            value={selectedMethod}
            onValueChange={setSelectedMethod}
            className="grid gap-4"
          >
            {cleaningMethods.map((method) => (
              <div key={method.id} className="flex items-start space-x-3">
                <RadioGroupItem value={method.id} id={method.id} />
                <Label htmlFor={method.id} className="grid gap-1 font-normal">
                  <span className="font-semibold">{method.label}</span>
                  <span className="text-sm text-muted-foreground">
                    {method.description}
                  </span>
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        <div className="flex justify-end">
          <Button onClick={handleClean} className="w-full sm:w-auto">
            <Wand2 className="mr-2 h-4 w-4" />
            Clean Data
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}