import { describe, it, expect } from 'vitest';

const formatFileSize = (bytes: number) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

describe('formatFileSize', () => {
  it('returns "0 Bytes" for zero', () => {
    expect(formatFileSize(0)).toBe('0 Bytes');
  });

  it('formats bytes correctly', () => {
    expect(formatFileSize(500)).toBe('500 Bytes');
  });

  it('formats kilobytes correctly', () => {
    expect(formatFileSize(2048)).toBe('2 KB');
  });

  it('formats megabytes correctly', () => {
    expect(formatFileSize(5242880)).toBe('5 MB');
  });
});