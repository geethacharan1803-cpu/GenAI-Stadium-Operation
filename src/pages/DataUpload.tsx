import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import FileUploader from '../components/FileUploader';
import AIReasoningCard from '../components/AIReasoningCard';
import { parseFile, parsedDataToString } from '../services/dataParser';
import { analyzeUploadedData, isApiKeyValid } from '../services/geminiService';
import { downloadSampleCSV } from '../utils/sampleData';
import {
  Download,
  Trash2,
  Sparkles,
  FileSpreadsheet,
  FileText,
  File,
} from 'lucide-react';

export default function DataUpload() {
  const { state, dispatch } = useApp();
  const navigate = useNavigate();
  const { uploadedFiles, apiKey, selectedStadium } = state;
  const [isProcessing, setIsProcessing] = useState(false);
  const [selectedFileId, setSelectedFileId] = useState<string | null>(null);

  const handleFileSelect = useCallback(async (file: globalThis.File) => {
    setIsProcessing(true);
    const uploadedFile = await parseFile(file);
    dispatch({ type: 'ADD_UPLOADED_FILE', payload: uploadedFile });
    setSelectedFileId(uploadedFile.id);
    setIsProcessing(false);
  }, [dispatch]);

  const handleAnalyze = useCallback(async (fileId: string) => {
    if (!isApiKeyValid(apiKey)) return;

    const file = uploadedFiles.find(f => f.id === fileId);
    if (!file || !file.parsedData) return;

    dispatch({
      type: 'UPDATE_UPLOADED_FILE',
      payload: { id: fileId, updates: { status: 'analyzing' } },
    });

    try {
      const analysis = await analyzeUploadedData(apiKey!, file.parsedData, selectedStadium);
      dispatch({
        type: 'UPDATE_UPLOADED_FILE',
        payload: { id: fileId, updates: { status: 'parsed', aiAnalysis: analysis } },
      });
    } catch {
      dispatch({
        type: 'UPDATE_UPLOADED_FILE',
        payload: { id: fileId, updates: { status: 'parsed', aiAnalysis: 'Unable to analyze data. Check your API key.' } },
      });
    }
  }, [apiKey, uploadedFiles, dispatch, selectedStadium]);

  const handleRemove = (fileId: string) => {
    dispatch({ type: 'REMOVE_UPLOADED_FILE', payload: fileId });
    if (selectedFileId === fileId) setSelectedFileId(null);
  };

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'csv': return <FileSpreadsheet size={18} />;
      case 'pdf': return <FileText size={18} />;
      default: return <File size={18} />;
    }
  };

  const selectedFile = uploadedFiles.find(f => f.id === selectedFileId);

  return (
    <div className="animate-fade-in">
      <div className="page-header">
        <h2 className="page-title">📤 Data Upload Portal</h2>
        <p className="page-subtitle">
          Upload CSV, PDF, TXT, or DOCX files to test the platform with real operational data
        </p>
      </div>

      <div className="grid-2-1">
        {/* Upload & File List */}
        <div>
          {/* Upload Zone */}
          <div className="glass-card no-hover">
            <div className="glass-card-header">
              <div className="glass-card-title">Upload Data File</div>
            </div>
            <FileUploader onFileSelect={handleFileSelect} isProcessing={isProcessing} />

            {/* Sample Data Downloads */}
            <div style={{ marginTop: 'var(--space-lg)', borderTop: '1px solid var(--glass-border)', paddingTop: 'var(--space-md)' }}>
              <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginBottom: 'var(--space-sm)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
                Sample Data for Testing
              </div>
              <div style={{ display: 'flex', gap: 'var(--space-sm)', flexWrap: 'wrap' }}>
                <button className="btn btn-secondary btn-sm" onClick={() => downloadSampleCSV('crowd')}>
                  <Download size={14} /> Crowd Sensors CSV
                </button>
                <button className="btn btn-secondary btn-sm" onClick={() => downloadSampleCSV('zone')}>
                  <Download size={14} /> Zone Occupancy CSV
                </button>
              </div>
            </div>
          </div>

          {/* Uploaded Files List */}
          {uploadedFiles.length > 0 && (
            <div className="glass-card no-hover" style={{ marginTop: 'var(--space-lg)' }}>
              <div className="glass-card-header">
                <div className="glass-card-title">Uploaded Files ({uploadedFiles.length})</div>
              </div>
              <div className="file-list">
                {uploadedFiles.map(file => (
                  <div
                    key={file.id}
                    className={`file-item ${selectedFileId === file.id ? 'active' : ''}`}
                    style={{
                      cursor: 'pointer',
                      borderColor: selectedFileId === file.id ? 'var(--color-teal)' : undefined,
                    }}
                    onClick={() => setSelectedFileId(file.id)}
                  >
                    <div className={`file-icon ${file.type}`}>
                      {getFileIcon(file.type)}
                    </div>
                    <div className="file-info">
                      <div className="file-name">{file.name}</div>
                      <div className="file-meta">
                        {(file.size / 1024).toFixed(1)} KB • {file.uploadedAt.toLocaleTimeString()}
                        {file.parsedData && ` • ${file.parsedData.rowCount} rows`}
                        {file.parsedData && ` • Type: ${file.parsedData.detectedType}`}
                      </div>
                    </div>
                    <span className={`file-status ${file.status}`}>{file.status}</span>
                    <button
                      className="btn btn-ghost btn-icon"
                      onClick={(e) => { e.stopPropagation(); handleRemove(file.id); }}
                      aria-label={`Remove ${file.name}`}
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* File Preview & Analysis */}
        <div>
          {selectedFile ? (
            <>
              {/* Data Preview */}
              {selectedFile.parsedData && (
                <div className="glass-card no-hover">
                  <div className="glass-card-header">
                    <div>
                      <div className="glass-card-title">Data Preview</div>
                      <div className="glass-card-subtitle">{selectedFile.parsedData.summary}</div>
                    </div>
                  </div>

                  <div className="data-table-container" style={{ maxHeight: 350, overflow: 'auto' }}>
                    <table className="data-table">
                      <thead>
                        <tr>
                          {selectedFile.parsedData.headers.map(h => (
                            <th key={h}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {selectedFile.parsedData.rows.slice(0, 25).map((row, i) => (
                          <tr key={i}>
                            {selectedFile.parsedData!.headers.map(h => (
                              <td key={h}>{String(row[h] ?? '')}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {selectedFile.parsedData.rowCount > 25 && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-text-tertiary)', marginTop: 'var(--space-sm)', textAlign: 'center' }}>
                      Showing 25 of {selectedFile.parsedData.rowCount} rows
                    </div>
                  )}

                  {/* AI Analyze Button */}
                  <button
                    className="btn btn-primary"
                    style={{ marginTop: 'var(--space-md)', width: '100%', justifyContent: 'center' }}
                    onClick={() => handleAnalyze(selectedFile.id)}
                    disabled={!isApiKeyValid(apiKey) || selectedFile.status === 'analyzing'}
                  >
                    <Sparkles size={16} />
                    {selectedFile.status === 'analyzing' ? 'Analyzing with AI...' : 'Analyze with AI'}
                  </button>

                  {!isApiKeyValid(apiKey) && (
                    <div style={{ fontSize: '0.75rem', color: 'var(--color-gold)', marginTop: 'var(--space-sm)', textAlign: 'center' }}>
                      <button className="btn btn-ghost btn-sm" onClick={() => navigate('/settings')}>
                        Connect API key to enable AI analysis →
                      </button>
                    </div>
                  )}
                </div>
              )}

              {/* AI Analysis Result */}
              {selectedFile.aiAnalysis && (
                <div style={{ marginTop: 'var(--space-lg)' }}>
                  <AIReasoningCard
                    title={`Analysis: ${selectedFile.name}`}
                    content={selectedFile.aiAnalysis}
                    tag="AI Data Analysis"
                  />
                </div>
              )}

              {/* Error State */}
              {selectedFile.status === 'error' && (
                <div className="glass-card no-hover" style={{ borderLeft: '3px solid var(--color-crimson)' }}>
                  <div className="glass-card-title" style={{ color: 'var(--color-crimson)' }}>
                    Error Parsing File
                  </div>
                  <p style={{ color: 'var(--color-text-secondary)', fontSize: '0.85rem', marginTop: 'var(--space-sm)' }}>
                    {selectedFile.error || 'An unknown error occurred while parsing the file.'}
                  </p>
                </div>
              )}

              {/* Data Integration Info */}
              {selectedFile.parsedData?.detectedType === 'crowd_data' && selectedFile.status === 'parsed' && (
                <div className="glass-card no-hover animate-slide-up" style={{ marginTop: 'var(--space-lg)', borderLeft: '3px solid var(--color-teal)' }}>
                  <div className="ai-tag">
                    <Sparkles size={14} />
                    Data Integration Active
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'var(--color-text-secondary)' }}>
                    This crowd data file has been automatically integrated into the live simulation. 
                    The Dashboard, Navigation, and Crowd Intelligence views are now using your uploaded data as a baseline.
                  </p>
                </div>
              )}
            </>
          ) : (
            <div className="glass-card no-hover">
              <div className="empty-state">
                <div className="empty-state-icon">📊</div>
                <div className="empty-state-text">
                  {uploadedFiles.length > 0
                    ? 'Select a file to preview its data'
                    : 'Upload a file to get started'}
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--color-text-tertiary)' }}>
                  Supports CSV, PDF, TXT, and DOCX files up to 10MB
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
