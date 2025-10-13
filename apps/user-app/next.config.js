// /** @type {import('next').NextConfig} */
// // const nextConfig = {};

// // export default nextConfig;
// next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
    images: {
      domains: ["images.unsplash.com"],
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'lh3.googleusercontent.com',
        },
      ],
    },
  
  };
  
  export default nextConfig;
  