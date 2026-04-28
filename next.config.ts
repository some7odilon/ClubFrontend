import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */

   eslint: {
    // Ignorer les erreurs ESLint pendant le build de production
    ignoreDuringBuilds: true,
  },

  typescript: {
    // ⚠️ OPTIONNEL : ignorer aussi les erreurs TypeScript (déconseillé en prod)
    ignoreBuildErrors: true,
  },

   distDir: '.next',
  generateBuildId: async () => {
    return 'build-' + Date.now()
  },

};

export default nextConfig;
