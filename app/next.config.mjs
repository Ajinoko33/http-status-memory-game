/** @type {import('next').NextConfig} */
const urlPrefix = '/http-status-memory-game';

const nextConfig = {
  images: {
    disableStaticImages: true,
  },
  output: 'export',

  basePath: urlPrefix,
  trailingSlash: false,
};

export default nextConfig;
