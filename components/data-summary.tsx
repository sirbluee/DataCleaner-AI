"use client";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  AlertCircle,
  AlertTriangle,
  FileText,
  Table as TableIcon,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { DataCleaningDialog } from "./data-cleaning-dialog";
import { DataCleaningOptions } from "./data-cleaning-options";
import { DataCleaner } from "@/lib/data-cleaner";

interface DataSummaryProps {
  data: any[];
  onDataChange?: (newData: any[]) => void;
}

export function DataSummary({ data, onDataChange }: DataSummaryProps) {
  const { toast } = useToast();

  if (!data.length) return null;

  const columns = Object.keys(data[0]);
  const rowCount = data.length;
  const columnCount = columns.length;

  // Calculate missing values
  const missingValues = columns.reduce((acc, column) => {
    const missing = data.filter(row => {
      const value = row[column];
      return value === null || value === undefined || value === '';
    }).length;
    acc[column] = missing;
    return acc;
  }, {} as Record<string, number>);

  // Find duplicate rows
  const duplicateCount = data.length - new Set(data.map(JSON.stringify)).size;

  const handleCleanColumn = (column: string, method: string) => {
    let result;
    
    switch (method) {
      case 'impute_by_mean':
        result = DataCleaner.imputeByMean(data, column);
        break;
      case 'impute_by_mode':
        result = DataCleaner.imputeByMode(data, column);
        break;
      case 'delete_missing_row':
        result = DataCleaner.deleteMissingRows(data, column);
        break;
      case 'delete_row_outlier':
        result = DataCleaner.removeOutliers(data, column);
        break;
      default:
        return;
    }

    onDataChange?.(result.newData);

    const message = `${result.stats.rowsRemoved} rows removed, ${result.stats.valuesImputed} values imputed, ${result.stats.outliersRemoved} outliers removed`;
    
    toast({
      title: "Data Cleaned",
      description: message,
    });
  };

  const handleGlobalCleaning = (method: string) => {
    const result = DataCleaner.cleanDataset(data, method);
    onDataChange?.(result.newData);

    const message = `${result.stats.rowsRemoved} rows removed, ${result.stats.valuesImputed} values imputed, ${result.stats.outliersRemoved} outliers removed`;
    
    toast({
      title: "Dataset Cleaned",
      description: message,
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-end">
        <DataCleaningOptions onClean={handleGlobalCleaning} />
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Dataset Overview
            </CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rowCount.toLocaleString()}</div>
            <p className="text-xs text-muted-foreground">
              Total rows in dataset
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Columns
            </CardTitle>
            <TableIcon className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{columnCount}</div>
            <p className="text-xs text-muted-foreground">
              Total columns detected
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Duplicate Rows
            </CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-2xl font-bold">{duplicateCount}</div>
                <p className="text-xs text-muted-foreground">
                  Duplicate entries found
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Missing Values Analysis</CardTitle>
          <CardDescription>
            Click on the missing values count to clean the data for each column
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(missingValues).map(([column, count]) => (
              <div
                key={column}
                className="flex items-center justify-between p-2 border rounded"
              >
                <div className="flex flex-col">
                  <span className="text-sm font-medium">{column}</span>
                  {count > 0 ? (
                    <DataCleaningDialog
                      columnName={column}
                      missingCount={count}
                      onClean={(method) => handleCleanColumn(column, method)}
                    />
                  ) : (
                    <span className="text-xs text-green-600">No missing values</span>
                  )}
                </div>
                {count > 0 && (
                  <AlertTriangle className="h-4 w-4 text-yellow-500" />
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}