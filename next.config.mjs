import { createRequire } from 'node:module';

const require = createRequire(
  import.meta.url
);

const {
  NormalModuleReplacementPlugin,
} = require(
  'next/dist/compiled/webpack/webpack-lib.js'
);

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  async redirects(){return[{source:'/tools/sip-calculator',destination:'/tools/sip-wealth-calculator',permanent:true}]},
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...(config.experiments || {}),
      asyncWebAssembly: true,
    };

    if (!isServer) {
      const emptyModule =
        require.resolve('./empty-node-module.js');

      for (
        const request of [
          'node:module',
          'node:fs',
          'node:path',
          'node:url',
          'node:crypto',
          'node:fs/promises',
        ]
      ) {
        config.plugins.push(
          new NormalModuleReplacementPlugin(
            new RegExp(
              '^' +
                request.replace(
                  /[:/]/g,
                  '\\$&'
                ) +
                '$'
            ),
            emptyModule
          )
        );
      }
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
