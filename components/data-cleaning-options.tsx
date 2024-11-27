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

interface DataCleaningOptionsProps {
  onClean: (method: string) => void;
}

export function DataCleaningOptions({ onClean }: DataCleaningOptionsProps) {
  const [selectedMethod, setSelectedMethod] = useState("impute_by_mean");
  const [open, setOpen] = useState(false);

  const cleaningMethods = [
    {
      id: "impute_by_mean",
      label: "Fill Missing Values with Mean",
      description: "Replace all missing values with the mean of their respective columns"
    },
    {
      id: "impute_by_mode",
      label: "Fill Missing Values with Most Frequent",
      description: "Replace missing values with the most common value in each column"
    },
    {
      id: "delete_missing_rows",
      label: "Delete Rows with Missing Values",
      description: "Remove all rows that contain any missing values"
    },
    {
      id: "delete_duplicates",
      label: "Remove Duplicate Rows",
      description: "Delete all duplicate entries from the dataset"
    },
    {
      id: "remove_outliers",
      label: "Remove Statistical Outliers",
      description: "Delete rows containing values that are statistical outliers"
    }
  ];

  const handleClean = () => {
    onClean(selectedMethod);
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2">
          <Wand2 className="h-4 w-4" />
          Clean Dataset
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Clean Dataset</DialogTitle>
          <DialogDescription>
            Choose a method to clean the entire dataset
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
            Apply Cleaning
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}