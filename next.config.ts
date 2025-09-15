import type { NextConfig } from "next";

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  // Production optimizations
  reactStrictMode: true,
  
  // Disable ESLint during build (for deployment)
  eslint: {
    ignoreDuringBuilds: true,
  },
  
  // Disable TypeScript build errors for deployment
  typescript: {
    ignoreBuildErrors: isProd,
  },
  
  // Vercel deployment settings
  output: 'standalone',
  
  // Image optimization
  images: {
    domains: ['localhost'],
    formats: ['image/webp', 'image/avif'],
  },
  
  // Webpack configuration
  webpack: (config, { dev, isServer }) => {
    // Fallback for Node.js modules in the browser
    if (!isServer) {
      config.resolve.fallback = {
        ...config.resolve.fallback,
        crypto: false,
        stream: false,
        assert: false,
        http: false,
        https: false,
        os: false,
        url: false,
        zlib: false,
        fs: false,
        path: false,
      };
    }

    // Handle magic-sdk dependency issues
    config.resolve.alias = {
      ...config.resolve.alias,
      '@magic-ext/oauth': '@magic-ext/oauth',
    };

    // Production optimizations
    if (isProd) {
      config.optimization = {
        ...config.optimization,
        splitChunks: {
          chunks: 'all',
          cacheGroups: {
            default: false,
            vendors: false,
            // Vendor chunk
            vendor: {
              chunks: 'all',
              test: /node_modules/,
              name: 'vendors',
              priority: 20,
            },
            // Common chunk
            common: {
              chunks: 'all',
              minChunks: 2,
              name: 'commons',
              priority: 10,
            },
          },
        },
      };
    }

    return config;
  },
  
  // Environment variables validation
  env: {
    NEXT_PUBLIC_THIRDWEB_CLIENT_ID: process.env.NEXT_PUBLIC_THIRDWEB_CLIENT_ID,
    NEXT_PUBLIC_CONTRACT_ADDRESS: process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
    NEXT_PUBLIC_APP_NAME: process.env.NEXT_PUBLIC_APP_NAME || "Water Pipeline Governance",
    NEXT_PUBLIC_DEFAULT_CHAIN_ID: process.env.NEXT_PUBLIC_DEFAULT_CHAIN_ID || "1287",
  },
  
  // Experimental features
  experimental: {
    esmExternals: true,
    optimizeCss: false, // Disabled to avoid critters dependency issue
  },
  
  // Security headers (already handled in vercel.json but keeping as backup)
  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-DNS-Prefetch-Control',
            value: 'on'
          },
          {
            key: 'Strict-Transport-Security',
            value: 'max-age=63072000; includeSubDomains; preload'
          },
        ],
      },
    ];
  },
};

export default nextConfig;
