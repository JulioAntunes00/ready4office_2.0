// Utilitários para manipulação de PDF

export const validatePDFFile = (file) => {
  if (!file) return { valid: false, error: 'Nenhum arquivo fornecido' };
  
  if (file.type !== 'application/pdf') {
    return { valid: false, error: 'O arquivo deve ser um PDF' };
  }
  
  const maxSize = 50 * 1024 * 1024; // 50MB
  if (file.size > maxSize) {
    return { valid: false, error: 'O arquivo não pode exceder 50MB' };
  }
  
  return { valid: true };
};

export const getPDFInfo = async (file) => {
  return new Promise((resolve) => {
    const reader = new FileReader();
    reader.onload = () => {
      // Informações básicas do arquivo
      const info = {
        name: file.name,
        size: file.size,
        sizeFormatted: formatFileSize(file.size),
        lastModified: new Date(file.lastModified).toLocaleDateString('pt-BR'),
        type: file.type
      };
      resolve(info);
    };
    reader.readAsArrayBuffer(file);
  });
};

export const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

export const downloadFile = (blob, filename) => {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
};

export const generateUniqueFilename = (originalName, suffix = '') => {
  const nameWithoutExt = originalName.replace(/\.[^/.]+$/, '');
  const extension = originalName.split('.').pop();
  const timestamp = new Date().getTime();
  
  return `${nameWithoutExt}${suffix ? '_' + suffix : ''}_${timestamp}.${extension}`;
};
