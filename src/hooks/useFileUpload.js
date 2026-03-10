"use client";

import { useState, useCallback } from 'react';

export const useFileUpload = ({ 
  maxFiles = 1, 
  maxSize = 10 * 1024 * 1024, // 10MB
  accept = '*' 
} = {}) => {
  const [files, setFiles] = useState([]);
  const [errors, setErrors] = useState([]);
  const [isUploading, setIsUploading] = useState(false);
  const [progress, setProgress] = useState(0);

  const validateFile = useCallback((file) => {
    const errors = [];

    if (file.size > maxSize) {
      errors.push(`Arquivo "${file.name}" excede o tamanho máximo de ${maxSize / 1024 / 1024}MB`);
    }

    if (accept !== '*' && !accept.split(',').some(type => file.type.includes(type.trim()))) {
      errors.push(`Tipo de arquivo "${file.type}" não é aceito`);
    }

    return errors;
  }, [maxSize, accept]);

  const addFiles = useCallback((newFiles) => {
    const validFiles = [];
    const newErrors = [];

    newFiles.forEach(file => {
      const fileErrors = validateFile(file);
      if (fileErrors.length > 0) {
        newErrors.push(...fileErrors);
      } else {
        validFiles.push(file);
      }
    });

    if (files.length + validFiles.length > maxFiles) {
      newErrors.push(`Máximo de ${maxFiles} arquivo(s) permitido(s)`);
    } else {
      setFiles(prev => [...prev, ...validFiles.slice(0, maxFiles - files.length)]);
    }

    setErrors(newErrors);
    return validFiles;
  }, [files, maxFiles, validateFile]);

  const removeFile = useCallback((index) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
    setErrors([]);
  }, []);

  const clearFiles = useCallback(() => {
    setFiles([]);
    setErrors([]);
    setProgress(0);
  }, []);

  const uploadFiles = useCallback(async (uploadFn) => {
    if (files.length === 0) return;

    setIsUploading(true);
    setProgress(0);

    try {
      const results = await uploadFn(files, (progress) => {
        setProgress(progress);
      });
      
      setProgress(100);
      return results;
    } catch (error) {
      setErrors([error.message || 'Erro no upload']);
      throw error;
    } finally {
      setIsUploading(false);
    }
  }, [files]);

  return {
    files,
    errors,
    isUploading,
    progress,
    addFiles,
    removeFile,
    clearFiles,
    uploadFiles,
    hasFiles: files.length > 0,
    fileCount: files.length,
    totalSize: files.reduce((total, file) => total + file.size, 0)
  };
};
