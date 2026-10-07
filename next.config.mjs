import { fileURLToPath } from "node:url";

/** @type {import('next').NextConfig} */
const nextConfig = {
  webpack: (config) => {
    // Corrige a colisão de `__webpack_exports__` do pdf.js com o webpack do Next 14 (ver o loader)
    config.module.rules.push({
      test: /pdfjs-dist[\\/]build[\\/]pdf(\.min)?\.mjs$/,
      use: fileURLToPath(
        new URL("./scripts/pdfjs-exports-loader.cjs", import.meta.url),
      ),
    });
    return config;
  },
};

export default nextConfig;
