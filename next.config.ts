import type {NextConfig} from 'next';
import {PHASE_DEVELOPMENT_SERVER} from 'next/constants';
import {ASSET_PREFIX, BASE_PATH} from './lib/sitePaths';

const nextConfig = (phase: string): NextConfig => ({
  // next dev сверяет URL с generateStaticParams строго: /%D0%A1…/ ≠ «Сухой корм» → E443.
  // Статический экспорт нужен только на сборке (CI / npm run build).
  ...(phase === PHASE_DEVELOPMENT_SERVER ? {} : {output: 'export' as const}),
  basePath: BASE_PATH,
  assetPrefix: ASSET_PREFIX,
  reactStrictMode: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  },
  // Allow access to remote image placeholder.
  images: {
    unoptimized: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'picsum.photos',
        port: '',
        pathname: '/**', // This allows any path under the hostname
      },
    ],
  },
  webpack: (config, {dev}) => {
    // HMR is disabled in AI Studio via DISABLE_HMR env var.
    // Do not modifyâfile watching is disabled to prevent flickering during agent edits.
    if (dev && process.env.DISABLE_HMR === 'true') {
      config.watchOptions = {
        ignored: /.*/,
      };
    }
    return config;
  },
});

export default nextConfig;
