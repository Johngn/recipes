/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  swcMinify: true,
  images: {
    domains: [
      'www.pixelstalk.net',
      'cdn.lifestyleasia.com',
      'www.biology-questions-and-answers.com',
    ],
  },
};

module.exports = nextConfig;
