/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  images: {
    domains: ["localhost", "unbuy.vercel.app"],
    unoptimized: true,
  },
  // Add this to handle Node.js protocol imports
  webpack: (config, { isServer }) => {
    if (!isServer) {
      // Don't resolve Node.js modules on the client
      config.resolve.fallback = {
        fs: false,
        net: false,
        tls: false,
        child_process: false,
      }
    }
    return config
  },
}

export default nextConfig
