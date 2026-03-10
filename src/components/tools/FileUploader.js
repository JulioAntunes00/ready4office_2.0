"use client";

import React, { useCallback, useState } from 'react';
import { useDropzone } from 'react-dropzone';

const FileUploader = ({ 
  onFilesDrop, 
  accept = '*', 
  maxFiles = 1, 
  maxSize = 10 * 1024 * 1024, // 10MB
  className = '',
  multiple = false,
  disabled = false
}) => {
  const [error, setError] = useState('');

  const onDrop = useCallback((acceptedFiles, fileRejections) => {
    setError('');
    
    if (fileRejections.length > 0) {
      const rejection = fileRejections[0];
      if (rejection.errors.some(e => e.code === 'file-too-large')) {
        setError('Arquivo muito grande. Tamanho máximo: 10MB');
      } else if (rejection.errors.some(e => e.code === 'file-invalid-type')) {
        setError('Tipo de arquivo não suportado');
      } else {
        setError('Erro ao fazer upload do arquivo');
      }
      return;
    }

    onFilesDrop(acceptedFiles);
  }, [onFilesDrop]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept,
    maxFiles,
    maxSize,
    multiple,
    disabled
  });

  const baseClasses = 'border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300';
  const stateClasses = isDragActive 
    ? 'border-orange-500 bg-orange-50 dark:bg-orange-900/20' 
    : 'border-gray-300 dark:border-gray-700 hover:border-gray-400 dark:hover:border-gray-600';
  const disabledClasses = disabled ? 'opacity-50 cursor-not-allowed' : '';

  const classes = `${baseClasses} ${stateClasses} ${disabledClasses} ${className}`;

  return (
    <div className={classes} {...getRootProps()}>
      <input {...getInputProps()} />
      
      <div className="flex flex-col items-center space-y-4">
        <div className="w-16 h-16 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
        
        <div className="text-gray-600 dark:text-gray-400">
          {isDragActive ? (
            <p>Solte os arquivos aqui...</p>
          ) : (
            <div>
              <p className="font-medium">Arraste arquivos aqui ou clique para selecionar</p>
              <p className="text-sm mt-1">Máximo {maxFiles} arquivo(s) • Tamanho máximo: 10MB</p>
            </div>
          )}
        </div>
      </div>
      
      {error && (
        <div className="mt-4 text-sm text-red-600 dark:text-red-400">
          {error}
        </div>
      )}
    </div>
  );
};

export default FileUploader;
