import type { NextConfig } from 'next';
const config: NextConfig = {
  async headers() {
    return [
      { source: '/benevoles/sw.js', headers: [{ key: 'Service-Worker-Allowed', value: '/benevoles' }, { key: 'Cache-Control', value: 'no-store' }] },
      { source: '/api/benevoles/:path*', headers: [{ key: 'Cache-Control', value: 'no-store' }, { key: 'X-Content-Type-Options', value: 'nosniff' }] },
    ];
  },
};
export default config;
