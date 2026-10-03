import { createRequire } from 'node:module';

const require = createRequire(import.meta.url);

const {
  NormalModuleReplacementPlugin,
} = require('next/dist/compiled/webpack/webpack-lib.js');

/** @type {import('next').NextConfig} */
const nextConfig = {
  poweredByHeader: false,
  output: 'export',
  trailingSlash: true,
  webpack: (config, { isServer }) => {
    config.experiments = {
      ...(config.experiments || {}),
      asyncWebAssembly: true,
    };

    if (!isServer) {
      const emptyModule = require.resolve('./empty-node-module.js');

      for (const request of [
        'node:module',
        'node:fs',
        'node:path',
        'node:url',
        'node:crypto',
        'node:fs/promises',
      ]) {
        config.plugins.push(
          new NormalModuleReplacementPlugin(
            new RegExp(
              '^' +
                request.replace(/[:/]/g, '\\$&') +
                '$'
            ),
            emptyModule
          )
        );
      }
    }

    return config;
  },
};

export default nextConfig;
