import { createRequire } from 'node:module';

const require = createRequire(
  import.meta.url
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...(config.experiments || {}),
      asyncWebAssembly: true,
    };

    if (!isServer) {
      const emptyModule =
        require.resolve('./empty-node-module.js');

      config.resolve =
        config.resolve || {};

      config.resolve.alias = {
        ...(config.resolve.alias || {}),
        'node:module': emptyModule,
        'node:fs': emptyModule,
        'node:path': emptyModule,
        'node:url': emptyModule,
        'node:crypto': emptyModule,
        'node:fs/promises': emptyModule,
      };
    }

    return config;
  },
  async headers() {
    return [
      {
        source: '/sql-wasm.wasm',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/wasm',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/qpdf.wasm',
        headers: [
          {
            key: 'Content-Type',
            value: 'application/wasm',
          },
          {
            key: 'Cache-Control',
            value: 'public, max-age=31536000, immutable',
          },
        ],
      },
      {
        source: '/(.*)',
        headers: [
          {
            key: 'X-Content-Type-Options',
            value: 'nosniff',
          },
          {
            key: 'Referrer-Policy',
            value: 'strict-origin-when-cross-origin',
          },
          {
            key: 'X-Frame-Options',
            value: 'SAMEORIGIN',
          },
        ],
      },
    ];
  },
};

export default nextConfig;
