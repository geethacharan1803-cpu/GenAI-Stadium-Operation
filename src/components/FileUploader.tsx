import { useCallback, useState, useRef } from 'react';
import { Upload, FileText, X } from 'lucide-react';
import { getAcceptedFileTypes, validateFile } from '../services/dataParser';

interface FileUploaderProps {
  onFileSelect: (file: File) => void;
  isProcessing?: boolean;
}

export default function FileUploader({ onFileSelect, isProcessing = false }: FileUploaderProps) {
  const [isDragOver, setIsDragOver] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFile = useCallback((file: File) => {
    setError(null);
    const validationError = validateFile(file);
    if (validationError) {
      setError(validationError);
      return;
    }
    onFileSelect(file);
  }, [onFileSelect]);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  }, [handleFile]);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback(() => {
    setIsDragOver(false);
  }, []);

  const handleClick = () => {
    inputRef.current?.click();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    // Reset input value so same file can be uploaded again
    e.target.value = '';
  };

  return (
    <div>
      <div
        className={`upload-zone ${isDragOver ? 'drag-over' : ''}`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onClick={handleClick}
        role="button"
        tabIndex={0}
        aria-label="Upload data file. Drag and drop or click to browse."
        onKeyDown={(e) => e.key === 'Enter' && handleClick()}
      >
        <input
          ref={inputRef}
          type="file"
          accept={getAcceptedFileTypes()}
          onChange={handleInputChange}
          style={{ display: 'none' }}
          aria-hidden="true"
        />

        {isProcessing ? (
          <>
            <div className="upload-zone-icon">
              <div className="spinner spinner-lg" style={{ margin: '0 auto' }} />
            </div>
            <div className="upload-zone-text">Processing file...</div>
          </>
        ) : (
          <>
            <div className="upload-zone-icon">
              {isDragOver ? <FileText size={48} /> : <Upload size={48} />}
            </div>
            <div className="upload-zone-text">
              {isDragOver ? 'Drop your file here!' : 'Drag & drop a file, or click to browse'}
            </div>
            <div className="upload-zone-formats">
              Supported formats: CSV, PDF, TXT, DOCX (max 10MB)
            </div>
          </>
        )}
      </div>

      {error && (
        <div
          style={{
            marginTop: '12px',
            padding: '10px 16px',
            borderRadius: '8px',
            background: 'rgba(230,57,70,0.12)',
            color: '#e63946',
            fontSize: '0.85rem',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
          }}
          role="alert"
        >
          <X size={16} />
          {error}
        </div>
      )}
    </div>
  );
}
