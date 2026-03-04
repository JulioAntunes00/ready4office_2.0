/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  // Desativa a otimização de imagens padrão do Next.js, pois o Hostinger estático não suporta
  images: {
    unoptimized: true,
  },
};

export default nextConfig;