/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Warning: This allows production builds to successfully complete even if
    // your project has ESLint errors.
    ignoreDuringBuilds: true,
  },
  typescript: {
    // Warning: Dangerous because it allows errors to go unreported in production builds.
    // Use this only if you're running `tsc --noEmit` separately in your CI/CD pipeline.
    ignoreBuildErrors: false,
  },
};

module.exports = nextConfig;
