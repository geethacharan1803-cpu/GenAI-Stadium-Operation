// ============================================================
// Data Parser Service
// Handles CSV, PDF, TXT, DOCX file parsing on the client side
// Auto-detects data type and normalizes to a common schema
// ============================================================

import Papa from 'papaparse';
import { ParsedData, UploadedFile } from '../types';

/** Parse a file and return structured data */
export async function parseFile(file: File): Promise<UploadedFile> {
  const id = `file-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
  const extension = file.name.split('.').pop()?.toLowerCase() || '';

  const uploadedFile: UploadedFile = {
    id,
    name: file.name,
    type: extension as UploadedFile['type'],
    size: file.size,
    uploadedAt: new Date(),
    status: 'parsing',
  };

  try {
    let parsedData: ParsedData;

    switch (extension) {
      case 'csv':
        parsedData = await parseCSV(file);
        break;
      case 'pdf':
        parsedData = await parsePDF(file);
        break;
      case 'txt':
        parsedData = await parseTXT(file);
        break;
      case 'docx':
        parsedData = await parseDOCX(file);
        break;
      default:
        throw new Error(`Unsupported file type: .${extension}`);
    }

    return {
      ...uploadedFile,
      status: 'parsed',
      parsedData,
    };
  } catch (error) {
    return {
      ...uploadedFile,
      status: 'error',
      error: error instanceof Error ? error.message : 'Unknown parsing error',
    };
  }
}

/** Parse CSV files using PapaParse */
async function parseCSV(file: File): Promise<ParsedData> {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      dynamicTyping: true,
      skipEmptyLines: true,
      complete: (results) => {
        if (results.errors.length > 0 && results.data.length === 0) {
          reject(new Error(`CSV parsing errors: ${results.errors.map(e => e.message).join(', ')}`));
          return;
        }

        const headers = results.meta.fields || [];
        const rows = results.data as Record<string, string | number>[];
        const detectedType = detectDataType(headers);

        resolve({
          headers,
          rows,
          rowCount: rows.length,
          summary: `CSV file with ${rows.length} rows and ${headers.length} columns (${headers.join(', ')})`,
          detectedType,
        });
      },
      error: (error: Error) => reject(error),
    });
  });
}

/** Parse PDF files — extracts text content */
async function parsePDF(file: File): Promise<ParsedData> {
  // Dynamic import to avoid bundling issues
  const pdfjsLib = await import('pdfjs-dist');

  // Set worker source
  pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.mjs`;

  const arrayBuffer = await file.arrayBuffer();
  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

  const textLines: string[] = [];

  for (let i = 1; i <= pdf.numPages; i++) {
    const page = await pdf.getPage(i);
    const textContent = await page.getTextContent();
    const pageText = textContent.items
      .map((item: { str?: string }) => ('str' in item ? item.str : ''))
      .join(' ');
    textLines.push(pageText);
  }

  const fullText = textLines.join('\n');
  const lines = fullText.split('\n').filter(l => l.trim());

  // Try to parse as tabular data
  const rows = lines.map(line => {
    const parts = line.split(/\s{2,}|\t/);
    const row: Record<string, string | number> = {};
    parts.forEach((part, i) => {
      row[`column_${i + 1}`] = isNaN(Number(part)) ? part.trim() : Number(part);
    });
    return row;
  });

  const headers = rows.length > 0 ? Object.keys(rows[0]) : ['content'];

  return {
    headers,
    rows: rows.length > 0 ? rows : [{ content: fullText }],
    rowCount: rows.length || 1,
    summary: `PDF document with ${pdf.numPages} page(s), extracted ${lines.length} text lines`,
    detectedType: detectDataType(headers),
  };
}

/** Parse plain text files */
async function parseTXT(file: File): Promise<ParsedData> {
  const text = await file.text();
  const lines = text.split('\n').filter(l => l.trim());

  // Check if it's CSV-like (tab or comma separated)
  const firstLine = lines[0] || '';
  const delimiter = firstLine.includes('\t') ? '\t' : firstLine.includes(',') ? ',' : null;

  if (delimiter && lines.length > 1) {
    const headers = firstLine.split(delimiter).map(h => h.trim());
    const rows = lines.slice(1).map(line => {
      const values = line.split(delimiter);
      const row: Record<string, string | number> = {};
      headers.forEach((h, i) => {
        const val = values[i]?.trim() || '';
        row[h] = isNaN(Number(val)) ? val : Number(val);
      });
      return row;
    });

    return {
      headers,
      rows,
      rowCount: rows.length,
      summary: `Text file with ${rows.length} data rows and ${headers.length} columns`,
      detectedType: detectDataType(headers),
    };
  }

  // Treat as plain text
  const rows = lines.map((line, i) => ({ line_number: i + 1, content: line }));
  return {
    headers: ['line_number', 'content'],
    rows,
    rowCount: rows.length,
    summary: `Plain text file with ${lines.length} lines`,
    detectedType: 'unknown',
  };
}

/** Parse DOCX files — basic text extraction */
async function parseDOCX(file: File): Promise<ParsedData> {
  // Basic DOCX extraction — reads the XML content from the zip
  const arrayBuffer = await file.arrayBuffer();
  const uint8 = new Uint8Array(arrayBuffer);

  // DOCX files are ZIP archives — find word/document.xml
  // Simple extraction: look for text between <w:t> tags
  const decoder = new TextDecoder('utf-8');
  const text = decoder.decode(uint8);

  // Extract text between XML tags (simplified)
  const textMatches = text.match(/<w:t[^>]*>([^<]*)<\/w:t>/g) || [];
  const extractedText = textMatches
    .map(match => match.replace(/<[^>]*>/g, ''))
    .join(' ')
    .replace(/\s+/g, ' ')
    .trim();

  if (!extractedText) {
    // Fallback: treat as raw text
    const rawText = decoder.decode(uint8).replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim();
    return {
      headers: ['content'],
      rows: [{ content: rawText.slice(0, 5000) }],
      rowCount: 1,
      summary: 'DOCX file — raw text extracted',
      detectedType: 'unknown',
    };
  }

  const sentences = extractedText.split(/[.!?]+/).filter(s => s.trim()).map(s => s.trim());
  const rows = sentences.map((s, i) => ({ sentence_number: i + 1, content: s }));

  return {
    headers: ['sentence_number', 'content'],
    rows,
    rowCount: rows.length,
    summary: `DOCX document with ${sentences.length} sentences extracted`,
    detectedType: 'unknown',
  };
}

/** Auto-detect the type of data based on column headers */
function detectDataType(headers: string[]): ParsedData['detectedType'] {
  const h = headers.map(h => h.toLowerCase());

  // Crowd/gate data indicators
  if (h.some(x => x.includes('gate') || x.includes('entry') || x.includes('throughput'))) {
    if (h.some(x => x.includes('people') || x.includes('count') || x.includes('load') || x.includes('wait'))) {
      return 'crowd_data';
    }
    return 'gate_data';
  }

  // Zone/occupancy data
  if (h.some(x => x.includes('zone') || x.includes('section') || x.includes('occupancy') || x.includes('density'))) {
    return 'crowd_data';
  }

  // Event schedule
  if (h.some(x => x.includes('match') || x.includes('kickoff') || x.includes('team') || x.includes('schedule'))) {
    return 'event_schedule';
  }

  // Amenity data
  if (h.some(x => x.includes('amenity') || x.includes('food') || x.includes('restroom') || x.includes('facility'))) {
    return 'amenity_data';
  }

  return 'unknown';
}

/** Format parsed data as a string for AI analysis */
export function parsedDataToString(data: ParsedData, maxRows: number = 50): string {
  const header = data.headers.join(' | ');
  const rows = data.rows.slice(0, maxRows).map(row =>
    data.headers.map(h => String(row[h] ?? '')).join(' | ')
  ).join('\n');

  return `Columns: ${header}\n\n${rows}${data.rowCount > maxRows ? `\n... (${data.rowCount - maxRows} more rows)` : ''}`;
}

/** Get accepted file extensions */
export function getAcceptedFileTypes(): string {
  return '.csv,.pdf,.txt,.docx';
}

/** Validate file before parsing */
export function validateFile(file: File): string | null {
  const maxSize = 10 * 1024 * 1024; // 10MB
  if (file.size > maxSize) {
    return 'File size exceeds 10MB limit';
  }

  const extension = file.name.split('.').pop()?.toLowerCase();
  const allowed = ['csv', 'pdf', 'txt', 'docx'];
  if (!extension || !allowed.includes(extension)) {
    return `Unsupported file type. Allowed: ${allowed.join(', ')}`;
  }

  return null;
}
