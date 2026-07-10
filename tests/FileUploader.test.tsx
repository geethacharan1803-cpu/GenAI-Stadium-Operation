import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import React from 'react';
import FileUploader from '../src/components/FileUploader';

describe('FileUploader Component', () => {
  it('should render upload zone and drag-and-drop label text', () => {
    const handleFileSelect = vi.fn();
    render(<FileUploader onFileSelect={handleFileSelect} />);

    expect(screen.getByText('Drag & drop a file, or click to browse')).toBeDefined();
    expect(screen.getByText(/Supported formats: CSV, PDF, TXT, DOCX/i)).toBeDefined();
  });
});
