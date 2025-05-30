import type {NextConfig} from 'next';

const nextConfig: NextConfig = {

  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  
  },

  devIndicators: {
    buildActivity: false,
  },
  
  eslint: {
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;
