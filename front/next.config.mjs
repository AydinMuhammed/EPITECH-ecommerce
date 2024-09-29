/** @type {import('next').NextConfig} */
const nextConfig = {
    async rewrites() {
      return [
        {
          source: '/api/:path*',
          destination: 'http://nginx/api/:path*', // Utilisez le nom du service Nginx
        },
      ];
    },
  };
  
  export default nextConfig;