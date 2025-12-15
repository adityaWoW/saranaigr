import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  reactStrictMode: true,
  typescript: {
    ignoreBuildErrors: true,
  },
  webpack(config) {
    // config.module.rules.push({
    //   test: /\.css$/,
    //   // use: ["css-loader", "postcss-loader"],
    //   use: [
    //     'style-loader',
    //     'css-loader',
    //     {
    //       loader: 'postcss-loader',
    //       options: {
    //         postcssOptions: {
    //           plugins: [
    //             require('@tailwindcss/postcss'), // Use the main Tailwind CSS package
    //             require('autoprefixer'), // Autoprefixer for browser compatibility
    //           ],
    //         },
    //       },
    //     },
    //   ],
    // });
    return config;
  },
};

export default nextConfig;
