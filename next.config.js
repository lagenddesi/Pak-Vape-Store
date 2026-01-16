/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  /* Agar aap images use kar rahe hain to ye domains allow karna behtar hai */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
