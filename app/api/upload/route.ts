import { NextRequest, NextResponse } from 'next/server';
import { parse } from 'papaparse';
import * as XLSX from 'xlsx';

if (!global.uploadedData) {
  global.uploadedData = {};
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;

    if (!file) {
      return NextResponse.json(
        { error: 'No file provided' },
        { status: 400 }
      );
    }

    // Generate a unique ID for this session
    const sessionId = Math.random().toString(36).substring(7);
    let parsedData;

    // Process the file based on its type
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (file.name.endsWith('.csv')) {
      const text = buffer.toString();
      const result = parse(text, { 
        header: true,
        skipEmptyLines: true,
        transformHeader: (header) => header.trim()
      });
      parsedData = result.data;
    } 
    else if (file.name.endsWith('.xlsx')) {
      const workbook = XLSX.read(buffer);
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      parsedData = XLSX.utils.sheet_to_json(firstSheet);
    } 
    else if (file.name.endsWith('.txt')) {
      const text = buffer.toString();
      parsedData = text.split('\n')
        .filter(line => line.trim())
        .map(line => ({ line: line.trim() }));
    } 
    else {
      return NextResponse.json(
        { error: 'Unsupported file format' },
        { status: 400 }
      );
    }

    // Store the data in memory
    global.uploadedData[sessionId] = {
      data: parsedData,
      timestamp: Date.now(),
      originalFileName: file.name
    };

    return NextResponse.json({ 
      id: sessionId,
      message: 'File uploaded successfully'
    });
  } catch (error) {
    console.error('Upload error:', error);
    return NextResponse.json(
      { error: 'Failed to process file' },
      { status: 500 }
    );
  }
}