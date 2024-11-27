"use client";

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { BarChart3, Table as TableIcon, Trash2, Download } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { DataTable } from '@/components/data-table';
import { DataSummary } from '@/components/data-summary';
import { useToast } from '@/components/ui/use-toast';
import { storage } from '@/lib/storage';

interface DataAnalysisProps {
  params: {
    id: string;
  };
}

export default function DataAnalysisPage({ params }: DataAnalysisProps) {
  const [data, setData] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);
  const { toast } = useToast();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    const loadData = async () => {
      try {
        const storedData = storage.getData(params.id);
        
        if (storedData) {
          setData(storedData);
          setLoading(false);
          return;
        }

        const response = await fetch(`/api/data/${params.id}`);

        if (!response.ok) {
          throw new Error(response.statusText || 'Failed to fetch data');
        }

        const result = await response.json();
        
        if (!result.data) {
          throw new Error('No data found');
        }

        setData(result.data);
        storage.setData(params.id, result.data);
        setError(null);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
        toast({
          title: "Error",
          description: errorMessage,
          variant: "destructive",
        });
        
        if (errorMessage === 'No data found') {
          router.push('/upload');
        }
      } finally {
        setLoading(false);
      }
    };

    loadData();

    const handleBeforeUnload = () => {
      storage.setLastPath(pathname);
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [params.id, toast, router, pathname]);

  useEffect(() => {
    const lastPath = storage.getLastPath();
    if (lastPath && lastPath.includes('/analyze/') && !pathname.includes(lastPath)) {
      router.push(lastPath);
    }
  }, [router, pathname]);

  const handleDataChange = (newData: any[]) => {
    setData(newData);
    storage.setData(params.id, newData);
  };

  const handleDownload = async () => {
    try {
      setDownloading(true);
      const response = await fetch(`/api/download/${params.id}`);
      
      if (!response.ok) {
        throw new Error('Download failed');
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      const contentDisposition = response.headers.get('content-disposition');
      const fileName = contentDisposition?.split('filename=')[1]?.replace(/"/g, '') || 'cleaned_data.csv';
      
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      toast({
        title: "Success",
        description: "File downloaded successfully",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Failed to download data. Please try again.",
        variant: "destructive",
      });
    } finally {
      setDownloading(false);
    }
  };

  const handleClearData = () => {
    storage.clearSession(params.id);
    router.push('/upload');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error Loading Data</h2>
        <p className="text-gray-600 mb-8">{error}</p>
        <Button onClick={() => router.push('/upload')}>
          Return to Upload
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Data Analysis</h1>
        <div className="space-x-4">
          <Button 
            onClick={handleDownload} 
            variant="outline"
            disabled={downloading}
          >
            {downloading ? (
              <>
                <div className="animate-spin mr-2 h-4 w-4 border-2 border-current border-t-transparent rounded-full" />
                Downloading...
              </>
            ) : (
              <>
                <Download className="mr-2 h-4 w-4" />
                Download
              </>
            )}
          </Button>
          <Button onClick={handleClearData} variant="destructive">
            <Trash2 className="mr-2 h-4 w-4" />
            Clear Data
          </Button>
        </div>
      </div>

      <Tabs defaultValue="preview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="preview">
            <TableIcon className="mr-2 h-4 w-4" />
            Preview
          </TabsTrigger>
          <TabsTrigger value="analysis">
            <BarChart3 className="mr-2 h-4 w-4" />
            Analysis
          </TabsTrigger>
        </TabsList>

        <TabsContent value="preview" className="space-y-4">
          <DataTable data={data} onDataChange={handleDataChange} />
        </TabsContent>

        <TabsContent value="analysis" className="space-y-4">
          <DataSummary data={data} onDataChange={handleDataChange} />
        </TabsContent>
      </Tabs>
    </div>
  );
}