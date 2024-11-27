import { NextRequest, NextResponse } from 'next/server';
import * as XLSX from 'xlsx';
import { unparse } from 'papaparse';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // @ts-ignore - In a real app, use proper temporary storage
    const sessionData = global.uploadedData?.[params.id];

    if (!sessionData) {
      return NextResponse.json(
        { error: 'Data not found' },
        { status: 404 }
      );
    }

    const { data, originalFileName } = sessionData;
    let fileContent: string | Buffer;
    let fileName: string;
    let contentType: string;

    // Determine output format based on original file type
    if (originalFileName.endsWith('.xlsx')) {
      // Convert to Excel
      const worksheet = XLSX.utils.json_to_sheet(data);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, 'Cleaned Data');
      fileContent = XLSX.write(workbook, { type: 'buffer', bookType: 'xlsx' });
      fileName = 'cleaned_data.xlsx';
      contentType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet';
    } else if (originalFileName.endsWith('.csv')) {
      // Convert to CSV
      fileContent = unparse(data);
      fileName = 'cleaned_data.csv';
      contentType = 'text/csv';
    } else {
      // Default to JSON
      fileContent = JSON.stringify(data, null, 2);
      fileName = 'cleaned_data.json';
      contentType = 'application/json';
    }

    // Create response with appropriate headers
    const response = new NextResponse(fileContent);
    response.headers.set('Content-Type', contentType);
    response.headers.set('Content-Disposition', `attachment; filename="${fileName}"`);

    return response;
  } catch (error) {
    console.error('Download error:', error);
    return NextResponse.json(
      { error: 'Failed to generate download file' },
      { status: 500 }
    );
  }
}