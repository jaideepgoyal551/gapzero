import pdfParse from 'pdf-parse';
import mammoth from 'mammoth';

export interface ParsedResumeResult {
  text: string;
  wordCount: number;
  format: 'PDF' | 'DOCX';
  isScannedWarning: boolean;
}

export class FileParserService {
  /**
   * Validate and extract readable text from a resume buffer
   */
  static async extractText(file: Express.Multer.File): Promise<ParsedResumeResult> {
    if (!file || !file.buffer || file.buffer.length === 0) {
      throw new Error('The uploaded file is empty or corrupted.');
    }

    const filename = file.originalname.toLowerCase();
    let text = '';
    let format: 'PDF' | 'DOCX' = 'PDF';

    if (filename.endsWith('.pdf') || file.mimetype === 'application/pdf') {
      format = 'PDF';
      try {
        const pdfData = await pdfParse(file.buffer);
        text = pdfData.text || '';
      } catch (err: any) {
        throw new Error(`Failed to parse PDF document: ${err.message || 'Malformed PDF structure.'}`);
      }
    } else if (
      filename.endsWith('.docx') ||
      filename.endsWith('.doc') ||
      file.mimetype === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      file.mimetype === 'application/msword'
    ) {
      format = 'DOCX';
      try {
        const result = await mammoth.extractRawText({ buffer: file.buffer });
        text = result.value || '';
      } catch (err: any) {
        throw new Error(`Failed to parse DOCX document: ${err.message || 'Malformed DOCX structure.'}`);
      }
    } else {
      throw new Error('Unsupported document format. Please upload a standard PDF (.pdf) or Microsoft Word (.docx) file.');
    }

    // Clean and normalize extracted text
    const cleanedText = this.sanitizeText(text);
    const words = cleanedText.split(/\s+/).filter(Boolean);
    const wordCount = words.length;

    // Check for scanned / non-selectable PDF
    if (wordCount < 30) {
      throw new Error(
        'The uploaded document contains minimal or no extractable text. ' +
        'If your resume is a scanned image or photo saved as PDF, Optical Character Recognition (OCR) is required. ' +
        'Please export and upload a text-selectable PDF or DOCX file.'
      );
    }

    return {
      text: cleanedText,
      wordCount,
      format,
      isScannedWarning: wordCount < 60,
    };
  }

  /**
   * Sanitize text: Remove non-printable control characters, normalize whitespace,
   * cap length to 30,000 characters to prevent token explosion or denial of service.
   */
  private static sanitizeText(raw: string): string {
    return raw
      .replace(/[\x00-\x08\x0B\x0C\x0E-\x1F\x7F]/g, '') // remove control chars
      .replace(/\r\n/g, '\n')
      .replace(/[ \t]+/g, ' ')
      .replace(/\n\s*\n\s*\n+/g, '\n\n')
      .slice(0, 30000)
      .trim();
  }
}
